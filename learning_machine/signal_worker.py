from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from datetime import UTC, datetime

from .data import DataConfig, DataPipeline
from .intelligence import EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory
from .notifications import DiscordNotifier
from .storage import load_signal_payload, save_signal_payload


DEFAULT_APP_URL = "https://makemoneywithtommy.streamlit.app"
DEFAULT_TICKERS = ("SPY", "QQQ")


@dataclass(slots=True)
class SignalState:
    mode: str
    label: str
    message: str
    reason: str
    hourly_drawdown: float


def build_signal_state(fred_api_key: str | None = None) -> SignalState:
    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(tickers=DEFAULT_TICKERS),
    )
    regime = pipeline.regime_snapshot()
    stress = pipeline.market_stress_signal()
    sovereign_score = pipeline.generate_sovereign_score(DEFAULT_TICKERS[0])
    internals = MarketInternalsFactory().build()
    event_risk = EventRiskFilter().evaluate(pipeline.get_economic_calendar())
    decision = EnsembleDecisionEngine().decide(
        ticker=DEFAULT_TICKERS[0],
        regime_snapshot=regime,
        stress_snapshot=stress,
        sovereign_score=sovereign_score,
        internals=internals,
        event_risk=event_risk,
        base_notional=50.0,
    )

    mode = decision.mode
    label = {
        "risk_on_expansion": "Risk-On Expansion",
        "tactical_accumulation": "Tactical Accumulation",
        "capital_preservation": "Capital Preservation Mode",
        "event_freeze": "Event Freeze",
    }.get(decision.mode, "Risk-On Expansion")
    message = decision.summary
    reason = f"{regime['narrative']} | {internals.summary} | {event_risk.summary} | {decision.attribution}"

    return SignalState(
        mode=mode,
        label=label,
        message=message,
        reason=reason,
        hourly_drawdown=float(stress["hourly_drawdown"]),
    )


def load_previous_state() -> SignalState | None:
    payload = load_signal_payload()
    if payload is None:
        return None
    relevant = {key: payload[key] for key in ("mode", "label", "message", "reason", "hourly_drawdown")}
    return SignalState(**relevant)


def save_state(state: SignalState) -> None:
    payload = asdict(state)
    payload["updated_at"] = datetime.now(UTC).isoformat()
    save_signal_payload(payload)


def latest_state_payload() -> dict[str, object] | None:
    previous = load_previous_state()
    if previous is None:
        return None
    payload = asdict(previous)
    payload["app_url"] = DEFAULT_APP_URL
    return payload


def notify_if_changed(state: SignalState, notifier: DiscordNotifier) -> bool:
    previous = load_previous_state()
    save_state(state)
    if previous is not None and previous.mode == state.mode:
        return False

    notifier.send_regime_change(
        tickers=DEFAULT_TICKERS,
        label=state.label,
        message=state.message,
        reason=state.reason,
    )
    return True


def main() -> None:
    fred_api_key = os.getenv("FRED_API_KEY")
    discord_webhook = os.getenv("DISCORD_WEBHOOK_URL")
    app_url = os.getenv("APP_URL") or DEFAULT_APP_URL

    if not fred_api_key:
        raise RuntimeError("FRED_API_KEY is required for the signal worker.")
    if not discord_webhook:
        raise RuntimeError("DISCORD_WEBHOOK_URL is required for the signal worker.")

    state = build_signal_state(fred_api_key=fred_api_key)
    notifier = DiscordNotifier(
        webhook_url=discord_webhook,
        username="Sovereign AI",
        app_url=app_url,
    )
    changed = notify_if_changed(state, notifier)
    print(
        json.dumps(
            {
                "changed": changed,
                "mode": state.mode,
                "label": state.label,
                "hourly_drawdown": state.hourly_drawdown,
            }
        )
    )


if __name__ == "__main__":
    main()
