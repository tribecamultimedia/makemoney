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
        return "https://paper-api.alpaca.markets"

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

        if signal.action == "PROTECT":
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

        order_payload = {
            "symbol": signal.symbol,
            "side": "buy",
            "type": "market",
            "time_in_force": "day",
            "notional": round(signal.target_notional, 2),
        }
        response = requests.post(
            f"{self.trading_base_url}/v2/orders",
            headers={**self.headers, "Content-Type": "application/json"},
            json=order_payload,
            timeout=10,
        )
        response.raise_for_status()
        return {
            "submitted": True,
            "spread_bps": spread_bps,
            "order": response.json(),
        }
