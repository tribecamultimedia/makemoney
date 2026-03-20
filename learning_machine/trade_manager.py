from __future__ import annotations

from dataclasses import dataclass

import requests

from .execution import BrokerCredentials, ExecutionSignal


@dataclass(slots=True)
class TradeManager:
    credentials: BrokerCredentials
    max_spread_bps: float = 25.0

    @property
    def trading_base_url(self) -> str:
        if self.credentials.paper:
            return "https://paper-api.alpaca.markets"
        return "https://api.alpaca.markets"

    @property
    def market_data_url(self) -> str:
        return "https://data.alpaca.markets"

    @property
    def headers(self) -> dict[str, str]:
        return {
            "APCA-API-KEY-ID": self.credentials.api_key,
            "APCA-API-SECRET-KEY": self.credentials.secret_key,
        }

    def account(self) -> dict[str, object]:
        response = requests.get(f"{self.trading_base_url}/v2/account", headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()

    def positions(self) -> list[dict[str, object]]:
        response = requests.get(f"{self.trading_base_url}/v2/positions", headers=self.headers, timeout=10)
        response.raise_for_status()
        return list(response.json())

    def position(self, symbol: str) -> dict[str, object] | None:
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
        response = requests.get(
            f"{self.market_data_url}/v2/stocks/{symbol}/quotes/latest",
            headers=self.headers,
            timeout=10,
        )
        response.raise_for_status()
        return response.json().get("quote", {})

    def spread_is_tight(self, symbol: str) -> tuple[bool, float]:
        quote = self.latest_quote(symbol)
        ask = float(quote.get("ap", 0.0))
        bid = float(quote.get("bp", 0.0))
        if ask <= 0 or bid <= 0:
            return False, 999.0
        midpoint = (ask + bid) / 2
        spread_bps = ((ask - bid) / midpoint) * 10_000
        return spread_bps <= self.max_spread_bps, spread_bps

    def sync_with_signal(self, signal: ExecutionSignal) -> dict[str, object]:
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
