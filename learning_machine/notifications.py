from __future__ import annotations

from dataclasses import dataclass

import pandas as pd
import requests


@dataclass(slots=True)
class DiscordNotifier:
    webhook_url: str | None
    username: str = "makemoneywithtommy"
    app_url: str = "http://localhost:8502"

    def send_signal(
        self,
        *,
        asset_name: str,
        action: str,
        reason: str,
        price: float,
        timestamp: pd.Timestamp,
    ) -> bool:
        if not self.webhook_url:
            return False

        display_action = "🚀 BUY" if action == "BUY" else "🛡️ PROTECT"
        color = 0xD4AF37 if action == "BUY" else 0xC0392B
        payload = {
            "username": self.username,
            "embeds": [
                {
                    "title": "💰 New Money-Making Signal from The Guru",
                    "color": color,
                    "fields": [
                        {"name": "Asset Name", "value": asset_name, "inline": True},
                        {"name": "Action", "value": display_action, "inline": True},
                        {"name": "Price", "value": f"${price:,.2f}", "inline": True},
                        {"name": "Guru's Logic", "value": reason, "inline": False},
                        {"name": "Open The App", "value": self.app_url, "inline": False},
                    ],
                    "footer": {"text": f"Signal time: {pd.Timestamp(timestamp).isoformat()}"},
                }
            ],
        }
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            return True
        except requests.RequestException:
            return False

    def send_regime_change(
        self,
        *,
        tickers: tuple[str, ...],
        label: str,
        message: str,
        reason: str,
    ) -> bool:
        if not self.webhook_url:
            return False

        payload = {
            "username": self.username,
            "embeds": [
                {
                    "title": "The Guru's Market Pulse Changed",
                    "color": 0xD4AF37,
                    "fields": [
                        {"name": "Watching", "value": ", ".join(tickers), "inline": True},
                        {"name": "New Pulse", "value": label, "inline": True},
                        {"name": "What changed", "value": message, "inline": False},
                        {"name": "Why it matters", "value": reason, "inline": False},
                        {"name": "Open The App", "value": self.app_url, "inline": False},
                    ],
                }
            ],
        }
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            return True
        except requests.RequestException:
            return False

    def send_top_signals(self, *, signals: tuple[dict[str, object], ...], timestamp: pd.Timestamp) -> bool:
        if not self.webhook_url or not signals:
            return False

        fields = []
        for item in signals[:4]:
            ticker = str(item.get("ticker", "Asset"))
            label = str(item.get("label", "Signal"))
            signal = str(item.get("signal", "hold")).upper()
            confidence = item.get("confidence", "")
            why = str(item.get("why", ""))
            safer = str(item.get("safer", ""))
            horizon = str(item.get("horizon", ""))
            value = why
            if safer:
                value += f"\nSafer option: {safer}"
            if horizon:
                value += f"\nHorizon: {horizon}"
            if confidence != "":
                value += f"\nConfidence: {confidence}%"
            fields.append(
                {
                    "name": f"{ticker} · {label} · {signal}",
                    "value": value[:1024],
                    "inline": False,
                }
            )

        payload = {
            "username": self.username,
            "embeds": [
                {
                    "title": "TELAJ Top Signals",
                    "color": 0x1F6BFF,
                    "fields": fields,
                    "footer": {"text": f"Signal time: {pd.Timestamp(timestamp).isoformat()}"},
                }
            ],
        }
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            return True
        except requests.RequestException:
            return False

    def send_report(self, *, report: dict[str, object], timestamp: pd.Timestamp) -> bool:
        if not self.webhook_url:
            return False

        payload = {
            "username": self.username,
            "embeds": [
                {
                    "title": "Sovereign AI Daily Paper Report",
                    "color": 0x00F5FF,
                    "fields": [
                        {"name": "Trades Logged", "value": str(report["trades"]), "inline": True},
                        {"name": "Submitted", "value": str(report["submitted"]), "inline": True},
                        {"name": "Errors", "value": str(report["errors"]), "inline": True},
                        {"name": "Latest Equity", "value": f"${float(report['latest_equity']):,.2f}", "inline": True},
                        {"name": "Return", "value": f"{float(report['return_pct']):.2f}%", "inline": True},
                        {"name": "Max Drawdown", "value": f"{float(report['max_drawdown_pct']):.2f}%", "inline": True},
                        {"name": "Win Rate", "value": f"{float(report['win_rate_pct']):.1f}%", "inline": True},
                        {"name": "Protect Actions", "value": str(report["protect_count"]), "inline": True},
                        {"name": "Open The App", "value": self.app_url, "inline": False},
                    ],
                    "footer": {"text": f"Report time: {pd.Timestamp(timestamp).isoformat()}"},
                }
            ],
        }
        try:
            response = requests.post(self.webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            return True
        except requests.RequestException:
            return False
