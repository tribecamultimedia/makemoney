from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from uuid import uuid4

import requests

from .execution import BrokerCredentials, ExecutionSignal

try:
    from coinbase.rest import RESTClient
except Exception:  # pragma: no cover - optional until Coinbase support is installed
    RESTClient = None


@dataclass(slots=True)
class TradeManager:
    credentials: BrokerCredentials
    max_spread_bps: float = 25.0

    @property
    def provider(self) -> str:
        return self.credentials.provider.lower()

    @property
    def trading_base_url(self) -> str:
        if self.provider == "coinbase":
            if self.credentials.paper:
                return "https://api-sandbox.coinbase.com"
            return "https://api.coinbase.com"
        if self.credentials.paper:
            return "https://paper-api.alpaca.markets"
        return "https://api.alpaca.markets"

    @property
    def market_data_url(self) -> str:
        if self.provider == "coinbase":
            return self.trading_base_url
        return "https://data.alpaca.markets"

    @property
    def headers(self) -> dict[str, str]:
        if self.provider == "coinbase":
            return {}
        return {
            "APCA-API-KEY-ID": self.credentials.api_key,
            "APCA-API-SECRET-KEY": self.credentials.secret_key,
        }

    def account(self) -> dict[str, object]:
        if self.provider == "coinbase":
            return self._coinbase_account_snapshot()
        response = requests.get(f"{self.trading_base_url}/v2/account", headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()

    def positions(self) -> list[dict[str, object]]:
        if self.provider == "coinbase":
            return self._coinbase_positions()
        response = requests.get(f"{self.trading_base_url}/v2/positions", headers=self.headers, timeout=10)
        response.raise_for_status()
        return list(response.json())

    def position(self, symbol: str) -> dict[str, object] | None:
        if self.provider == "coinbase":
            for row in self._coinbase_positions():
                if row.get("symbol") == symbol:
                    return row
            return None
        response = requests.get(
            f"{self.trading_base_url}/v2/positions/{symbol}",
            headers=self.headers,
            timeout=10,
        )
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.json()

    def portfolio_snapshot(self) -> dict[str, object]:
        if self.provider == "coinbase":
            account = self._coinbase_account_snapshot()
            positions = self._coinbase_positions()
            return {
                "equity": float(account.get("equity", 0.0)),
                "buying_power": float(account.get("buying_power", 0.0)),
                "cash": float(account.get("cash", 0.0)),
                "daily_pnl_pct": float(account.get("daily_pnl_pct", 0.0)),
                "positions": positions,
                "wallet_balances": list(account.get("wallet_balances", [])),
            }

        account = self.account()
        positions = self.positions()
        equity = float(account.get("equity", 0.0))
        last_equity = float(account.get("last_equity", equity or 1.0))
        daily_pnl_pct = 0.0 if last_equity == 0 else (equity / last_equity) - 1.0
        return {
            "equity": equity,
            "buying_power": float(account.get("buying_power", 0.0)),
            "cash": float(account.get("cash", 0.0)),
            "daily_pnl_pct": daily_pnl_pct,
            "positions": positions,
        }

    def latest_quote(self, symbol: str) -> dict[str, object]:
        if self.provider == "coinbase":
            return self._coinbase_best_bid_ask(symbol)
        response = requests.get(
            f"{self.market_data_url}/v2/stocks/{symbol}/quotes/latest",
            headers=self.headers,
            timeout=10,
        )
        response.raise_for_status()
        return response.json().get("quote", {})

    def spread_is_tight(self, symbol: str) -> tuple[bool, float]:
        quote = self.latest_quote(symbol)
        if self.provider == "coinbase":
            ask = float(quote.get("ask", 0.0))
            bid = float(quote.get("bid", 0.0))
        else:
            ask = float(quote.get("ap", 0.0))
            bid = float(quote.get("bp", 0.0))
        if ask <= 0 or bid <= 0:
            return False, 999.0
        midpoint = (ask + bid) / 2
        spread_bps = ((ask - bid) / midpoint) * 10_000
        return spread_bps <= self.max_spread_bps, spread_bps

    def sync_with_signal(self, signal: ExecutionSignal) -> dict[str, object]:
        if self.provider == "coinbase":
            return self._sync_coinbase(signal)

        spread_ok, spread_bps = self.spread_is_tight(signal.symbol)
        if not spread_ok:
            return {
                "submitted": False,
                "reason": f"Spread too wide at {spread_bps:.1f} bps.",
            }

        capped_notional = min(signal.target_notional, self.credentials.max_position_notional)
        if signal.action == "PROTECT":
            position = self.position(signal.symbol)
            if position is None:
                return {
                    "submitted": False,
                    "reason": "No open position to protect.",
                }
            response = requests.delete(
                f"{self.trading_base_url}/v2/positions/{signal.symbol}",
                headers=self.headers,
                timeout=10,
            )
            if response.status_code not in (200, 204):
                response.raise_for_status()
            return {
                "submitted": True,
                "spread_bps": spread_bps,
                "order": {"status": "closed_position", "symbol": signal.symbol},
            }

        position = self.position(signal.symbol)
        current_market_value = 0.0 if position is None else abs(float(position.get("market_value", 0.0)))
        remaining_notional = round(capped_notional - current_market_value, 2)
        if remaining_notional <= 5.0:
            return {
                "submitted": False,
                "reason": f"Target allocation already in place at ${current_market_value:,.2f}.",
            }

        order_payload = {
            "symbol": signal.symbol,
            "side": "buy",
            "type": "market",
            "time_in_force": "day",
            "notional": remaining_notional,
        }
        response = requests.post(
            f"{self.trading_base_url}/v2/orders",
            headers={**self.headers, "Content-Type": "application/json"},
            json=order_payload,
            timeout=10,
        )
        response.raise_for_status()
        order = response.json()
        if self.credentials.auto_harvest:
            self.submit_auto_harvest(symbol=signal.symbol)
        return {
            "submitted": True,
            "spread_bps": spread_bps,
            "order": order,
            "notional": remaining_notional,
        }

    def submit_auto_harvest(self, symbol: str) -> dict[str, object]:
        if self.provider == "coinbase":
            position = self.position(symbol)
            if position is None:
                return {"submitted": False, "reason": "No open position to harvest."}
            qty = float(position.get("qty", 0.0))
            if qty <= 0:
                return {"submitted": False, "reason": "No quantity available to harvest."}
            harvest_qty = round(qty * self.credentials.harvest_take_pct, 8)
            if harvest_qty <= 0:
                return {"submitted": False, "reason": "Harvest quantity rounded to zero."}
            return self._coinbase_create_order(
                symbol=symbol,
                side="SELL",
                quote_size=None,
                base_size=str(harvest_qty),
            )

        position_response = requests.get(
            f"{self.trading_base_url}/v2/positions/{symbol}",
            headers=self.headers,
            timeout=10,
        )
        position_response.raise_for_status()
        position = position_response.json()
        unrealized_pct = float(position.get("unrealized_plpc", 0.0))
        qty = float(position.get("qty", 0.0))
        if unrealized_pct < self.credentials.harvest_trigger_pct or qty <= 0:
            return {"submitted": False, "reason": "Harvest trigger not reached."}

        harvest_qty = round(qty * self.credentials.harvest_take_pct, 6)
        payload = {
            "symbol": symbol,
            "side": "sell",
            "type": "market",
            "time_in_force": "day",
            "qty": str(harvest_qty),
        }
        response = requests.post(
            f"{self.trading_base_url}/v2/orders",
            headers={**self.headers, "Content-Type": "application/json"},
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        return {"submitted": True, "order": response.json()}

    def _sync_coinbase(self, signal: ExecutionSignal) -> dict[str, object]:
        self._ensure_coinbase_support()
        spread_ok, spread_bps = self.spread_is_tight(signal.symbol)
        if not spread_ok:
            return {"submitted": False, "reason": f"Spread too wide at {spread_bps:.1f} bps."}

        capped_notional = min(signal.target_notional, self.credentials.max_position_notional)
        if signal.action == "PROTECT":
            position = self.position(signal.symbol)
            if position is None:
                return {"submitted": False, "reason": "No open position to protect."}
            qty = float(position.get("qty", 0.0))
            if qty <= 0:
                return {"submitted": False, "reason": "No open quantity to protect."}
            return self._coinbase_create_order(
                symbol=signal.symbol,
                side="SELL",
                quote_size=None,
                base_size=str(round(qty, 8)),
            )

        snapshot = self.portfolio_snapshot()
        position = self.position(signal.symbol)
        current_market_value = 0.0 if position is None else abs(float(position.get("market_value", 0.0)))
        remaining_notional = round(min(capped_notional, float(snapshot["cash"])) - current_market_value, 2)
        if remaining_notional <= 5.0:
            return {
                "submitted": False,
                "reason": f"Target allocation already in place at ${current_market_value:,.2f}.",
            }
        order = self._coinbase_create_order(
            symbol=signal.symbol,
            side="BUY",
            quote_size=f"{remaining_notional:.2f}",
            base_size=None,
        )
        order["spread_bps"] = spread_bps
        order["notional"] = remaining_notional
        if order.get("submitted") and self.credentials.auto_harvest:
            self.submit_auto_harvest(symbol=signal.symbol)
        return order

    def _coinbase_account_snapshot(self) -> dict[str, object]:
        accounts = self._coinbase_list_accounts()
        wallet_rows = self._coinbase_wallet_rows(accounts)
        equity = 0.0
        cash = 0.0
        for row in wallet_rows:
            currency = str(row.get("currency", "")).upper()
            balance = float(row.get("available_balance", 0.0))
            if currency in {"USD", "USDC", "USDT"}:
                cash += balance
                equity += balance
                continue
            if balance <= 0:
                continue
            midpoint = self._coinbase_mark_price(currency)
            equity += balance * midpoint
        return {
            "equity": equity,
            "cash": cash,
            "buying_power": cash,
            "daily_pnl_pct": 0.0,
            "wallet_balances": wallet_rows,
        }

    def _coinbase_positions(self) -> list[dict[str, object]]:
        rows: list[dict[str, object]] = []
        for row in self._coinbase_wallet_rows(self._coinbase_list_accounts()):
            currency = str(row.get("currency", "")).upper()
            qty = float(row.get("available_balance", 0.0))
            if currency in {"USD", "USDC", "USDT", ""} or qty <= 0:
                continue
            product_id = self._coinbase_product_for_currency(currency)
            midpoint = self._coinbase_mark_price(currency)
            rows.append(
                {
                    "symbol": product_id,
                    "qty": qty,
                    "market_value": qty * midpoint,
                    "unrealized_plpc": 0.0,
                }
            )
        return rows

    def _coinbase_list_accounts(self) -> list[dict[str, Any]]:
        payload = self._coinbase_request("GET", "/api/v3/brokerage/accounts", params={"limit": 250})
        return list(payload.get("accounts", []))

    @staticmethod
    def _coinbase_wallet_rows(accounts: list[dict[str, Any]]) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for account in accounts:
            currency = str(account.get("currency", "")).upper()
            available_balance = TradeManager._coinbase_balance_value(account.get("available_balance"))
            hold_balance = TradeManager._coinbase_balance_value(account.get("hold"))
            if currency == "":
                continue
            rows.append(
                {
                    "currency": currency,
                    "available_balance": available_balance,
                    "hold_balance": hold_balance,
                    "type": str(account.get("type", "")),
                    "uuid": str(account.get("uuid", "")),
                }
            )
        return rows

    @staticmethod
    def _coinbase_balance_value(payload: Any) -> float:
        if isinstance(payload, dict):
            raw = payload.get("value", 0.0)
        else:
            raw = payload if payload is not None else 0.0
        try:
            return float(raw)
        except (TypeError, ValueError):
            return 0.0

    def _coinbase_product_for_currency(self, currency: str) -> str:
        if currency == "USDC":
            return "USDC-USD"
        return f"{currency}-USD"

    def _coinbase_mark_price(self, currency: str) -> float:
        if currency in {"USD", "USDC", "USDT"}:
            return 1.0
        product_id = self._coinbase_product_for_currency(currency)
        try:
            quote = self._coinbase_best_bid_ask(product_id)
            return (float(quote.get("bid", 0.0)) + float(quote.get("ask", 0.0))) / 2
        except Exception:
            return 0.0

    def _coinbase_best_bid_ask(self, symbol: str) -> dict[str, Any]:
        payload = self._coinbase_request("GET", "/api/v3/brokerage/best_bid_ask", params={"product_ids": symbol})
        if "pricebooks" in payload and payload["pricebooks"]:
            book = payload["pricebooks"][0]
            bids = book.get("bids", [])
            asks = book.get("asks", [])
            bid = bids[0]["price"] if bids else 0.0
            ask = asks[0]["price"] if asks else 0.0
            return {"bid": float(bid), "ask": float(ask)}
        if "best_bid_ask" in payload:
            row = payload["best_bid_ask"]
            return {"bid": float(row.get("bid", 0.0)), "ask": float(row.get("ask", 0.0))}
        return {"bid": 0.0, "ask": 0.0}

    def _coinbase_create_order(
        self,
        *,
        symbol: str,
        side: str,
        quote_size: str | None,
        base_size: str | None,
    ) -> dict[str, object]:
        configuration: dict[str, object] = {"market_market_ioc": {}}
        if quote_size is not None:
            configuration["market_market_ioc"]["quote_size"] = quote_size
        if base_size is not None:
            configuration["market_market_ioc"]["base_size"] = base_size
        payload = {
            "client_order_id": str(uuid4()),
            "product_id": symbol,
            "side": side,
            "order_configuration": configuration,
        }
        data = self._coinbase_request("POST", "/api/v3/brokerage/orders", json=payload)
        success = bool(data.get("success", True))
        failure_reason = data.get("error_response", {}).get("message") or data.get("failure_reason")
        return {
            "submitted": success,
            "order": data,
            "reason": failure_reason or ("Coinbase order accepted." if success else "Coinbase rejected the order."),
        }

    def _coinbase_request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, object] | None = None,
        json: dict[str, object] | None = None,
    ) -> dict[str, Any]:
        client = self._coinbase_client()
        if method == "GET":
            response = client.get(path, params=params or {})
        elif method == "POST":
            response = client.post(path, data=json or {})
        else:
            raise RuntimeError(f"Unsupported Coinbase method: {method}")
        return self._coinbase_to_dict(response)

    @staticmethod
    def _coinbase_to_dict(response: Any) -> dict[str, Any]:
        if hasattr(response, "to_dict"):
            return dict(response.to_dict())
        if isinstance(response, dict):
            return response
        if hasattr(response, "__dict__"):
            return dict(response.__dict__)
        raise RuntimeError("Coinbase SDK returned an unsupported response type.")

    def _coinbase_client(self):
        self._ensure_coinbase_support()
        if self.credentials.paper:
            raise RuntimeError("Coinbase sandbox mode is not wired yet in the official SDK path. Use Live for now.")
        return RESTClient(
            api_key=self.credentials.api_key,
            api_secret=self.credentials.secret_key.replace("\\n", "\n").strip(),
            timeout=15,
        )

    def _ensure_coinbase_support(self) -> None:
        if RESTClient is None:
            raise RuntimeError(
                "Coinbase support requires coinbase-advanced-py. Redeploy Streamlit or run `uv sync` locally."
            )
