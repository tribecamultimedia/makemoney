from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time
from dataclasses import dataclass
from typing import Any
from urllib.parse import quote

import pandas as pd
import requests


def _oauth_quote(value: str) -> str:
    return quote(value, safe="~")


def _build_oauth1_authorization_header(
    *,
    method: str,
    url: str,
    consumer_key: str,
    consumer_secret: str,
    access_token: str,
    access_token_secret: str,
) -> str:
    oauth_params = {
        "oauth_consumer_key": consumer_key,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": access_token,
        "oauth_version": "1.0",
    }
    encoded_pairs = sorted((_oauth_quote(key), _oauth_quote(value)) for key, value in oauth_params.items())
    parameter_string = "&".join(f"{key}={value}" for key, value in encoded_pairs)
    signature_base = "&".join(
        [
            method.upper(),
            _oauth_quote(url),
            _oauth_quote(parameter_string),
        ]
    )
    signing_key = f"{_oauth_quote(consumer_secret)}&{_oauth_quote(access_token_secret)}"
    signature = base64.b64encode(
        hmac.new(signing_key.encode("utf-8"), signature_base.encode("utf-8"), hashlib.sha1).digest()
    ).decode("utf-8")
    oauth_params["oauth_signature"] = signature
    header_value = ", ".join(
        f'{_oauth_quote(key)}="{_oauth_quote(value)}"' for key, value in sorted(oauth_params.items())
    )
    return f"OAuth {header_value}"


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


@dataclass(slots=True)
class XNotifier:
    consumer_key: str | None
    consumer_secret: str | None
    access_token: str | None
    access_token_secret: str | None
    app_url: str = "http://localhost:8502"
    endpoint: str = "https://api.x.com/2/tweets"

    @property
    def configured(self) -> bool:
        return all(
            (
                self.consumer_key,
                self.consumer_secret,
                self.access_token,
                self.access_token_secret,
            )
        )

    def _post_tweet(self, *, text: str, reply_to_id: str | None = None) -> str | None:
        if not self.configured:
            return None

        payload: dict[str, object] = {"text": text[:280]}
        if reply_to_id:
            payload["reply"] = {"in_reply_to_tweet_id": reply_to_id}

        headers = {
            "Authorization": _build_oauth1_authorization_header(
                method="POST",
                url=self.endpoint,
                consumer_key=self.consumer_key or "",
                consumer_secret=self.consumer_secret or "",
                access_token=self.access_token or "",
                access_token_secret=self.access_token_secret or "",
            ),
            "Content-Type": "application/json",
        }
        try:
            response = requests.post(self.endpoint, headers=headers, data=json.dumps(payload), timeout=10)
            response.raise_for_status()
            body = response.json()
            data = body.get("data", {})
            tweet_id = data.get("id")
            return str(tweet_id) if tweet_id else None
        except (requests.RequestException, ValueError):
            return None

    def send_top_signals_thread(
        self,
        *,
        label: str,
        message: str,
        signals: tuple[dict[str, object], ...],
    ) -> bool:
        if not self.configured or not signals:
            return False

        opener = (
            f"TELAJ Market Pulse: {label}\n"
            f"{message[:170]}\n"
            f"More: {self.app_url}"
        )[:280]
        parent_id = self._post_tweet(text=opener)
        if not parent_id:
            return False

        posted = 1
        for item in signals[:4]:
            ticker = str(item.get("ticker", "Asset"))
            signal = str(item.get("signal", "hold")).upper()
            confidence = item.get("confidence", "")
            why = str(item.get("why", ""))
            safer = str(item.get("safer", ""))
            horizon = str(item.get("horizon", ""))
            body = f"{ticker}: {signal}"
            if confidence != "":
                body += f" ({confidence}%)"
            if why:
                body += f"\n{why}"
            if safer:
                body += f"\nSafer: {safer}"
            if horizon:
                body += f"\nHorizon: {horizon}"
            next_id = self._post_tweet(text=body, reply_to_id=parent_id)
            if not next_id:
                return False
            parent_id = next_id
            posted += 1
        return posted > 1

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


@dataclass(slots=True)
class LinkedInNotifier:
    access_token: str | None
    organization_urn: str | None
    app_url: str = "https://telaj.com"
    version: str = "202601"
    endpoint: str = "https://api.linkedin.com/rest/posts"
    dry_run: bool = False

    @property
    def configured(self) -> bool:
        return bool(self.access_token and self.organization_urn)

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Linkedin-Version": self.version,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
        }

    def post_organization_update(
        self,
        *,
        commentary: str,
        article_url: str | None = None,
        article_title: str | None = None,
        article_description: str | None = None,
    ) -> dict[str, Any] | None:
        if not self.configured:
            return None

        payload: dict[str, Any] = {
            "author": self.organization_urn,
            "commentary": commentary[:3000],
            "visibility": "PUBLIC",
            "distribution": {
                "feedDistribution": "MAIN_FEED",
                "targetEntities": [],
                "thirdPartyDistributionChannels": [],
            },
            "lifecycleState": "PUBLISHED",
            "isReshareDisabledByAuthor": False,
        }
        if article_url:
            payload["content"] = {
                "article": {
                    "source": article_url,
                    "title": article_title or "TELAJ",
                    "description": article_description or "TELAJ daily decision engine update.",
                }
            }

        if self.dry_run:
            return {"ok": True, "dry_run": True, "payload": payload}

        try:
            response = requests.post(self.endpoint, headers=self._headers(), data=json.dumps(payload), timeout=15)
            response.raise_for_status()
            return {
                "ok": True,
                "status_code": response.status_code,
                "post_id": response.headers.get("x-restli-id", ""),
            }
        except requests.RequestException as exc:
            body = ""
            response = getattr(exc, "response", None)
            if response is not None:
                body = response.text[:500]
            return {"ok": False, "error": str(exc), "body": body}

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
