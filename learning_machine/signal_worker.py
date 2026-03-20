from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from pathlib import Path

from .data import DataConfig, DataPipeline
from .notifications import DiscordNotifier


STATE_PATH = Path(".state/latest_signal.json")
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

    mode = "risk_on_expansion"
    label = "Risk-On Expansion"
    message = "Core positions can stay engaged while macro conditions remain supportive."
    reason = str(regime["narrative"])

    if bool(stress["triggered"]) or str(regime["state"]) == "capital_preservation":
        mode = "capital_preservation"
        label = "Capital Preservation Mode"
        message = "Cash is king while macro stress and market structure stay fragile."
        if bool(stress["triggered"]):
            reason = (
                "The market has dropped more than 3% in an hour, so Sovereign AI is forcing a "
                "portfolio-wide protective stance."
            )
    elif str(regime["state"]) == "tactical_accumulation":
        mode = "tactical_accumulation"
        label = "Tactical Accumulation"
        message = "Scale in carefully while the market builds a stronger foundation."

    return SignalState(
        mode=mode,
        label=label,
        message=message,
        reason=reason,
        hourly_drawdown=float(stress["hourly_drawdown"]),
    )


def load_previous_state() -> SignalState | None:
    if not STATE_PATH.exists():
        return None
    payload = json.loads(STATE_PATH.read_text())
    return SignalState(**payload)


def save_state(state: SignalState) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(asdict(state), indent=2))


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
