from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from datetime import UTC, datetime

from .data import DataConfig, DataPipeline
from .experiment_tracker import log_experiment_run
from .intelligence import CreditLiquidityFactor, EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory
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
    top_signals: tuple[dict[str, object], ...] = ()


def build_top_signals(state: SignalState) -> tuple[dict[str, object], ...]:
    if state.mode == "tactical_accumulation":
        return (
            {
                "ticker": "SPY",
                "label": "Broad ETF core",
                "signal": "add slowly",
                "confidence": 74,
                "why": "The market is still below recent highs and close enough to recent lows that broad exposure is more attractive than waiting for a perfect entry.",
                "safer": "Buy in tranches instead of all at once.",
                "horizon": "6-18 months",
            },
            {
                "ticker": "GLD",
                "label": "Gold defense",
                "signal": "buy",
                "confidence": 71,
                "why": "Volatility and macro uncertainty still justify a defensive hedge.",
                "safer": "Add a smaller hedge rather than oversizing it.",
                "horizon": "3-12 months",
            },
            {
                "ticker": "SGOV",
                "label": "Treasury reserve sleeve",
                "signal": "hold",
                "confidence": 79,
                "why": "Short-duration Treasuries still work well for reserve capital while the market remains uneven.",
                "safer": "Keep it as the reserve sleeve, not the whole portfolio.",
                "horizon": "0-12 months",
            },
            {
                "ticker": "QQQ",
                "label": "High-beta growth",
                "signal": "avoid",
                "confidence": 67,
                "why": "This part of the market is more vulnerable if momentum rolls over again.",
                "safer": "Use broad ETFs instead of concentrated beta.",
                "horizon": "1-6 months",
            },
        )
    if state.mode == "capital_preservation" or state.mode == "event_freeze":
        return (
            {
                "ticker": "SGOV",
                "label": "Treasury reserve sleeve",
                "signal": "buy",
                "confidence": 82,
                "why": "Capital preservation matters more than reaching for return while stress is elevated.",
                "safer": "Keep reserve capital short duration and liquid.",
                "horizon": "0-12 months",
            },
            {
                "ticker": "GLD",
                "label": "Gold defense",
                "signal": "add slowly",
                "confidence": 73,
                "why": "Gold still helps if policy and macro conditions remain unsettled.",
                "safer": "Build the hedge gradually.",
                "horizon": "3-12 months",
            },
            {
                "ticker": "SPY",
                "label": "Broad ETF core",
                "signal": "hold",
                "confidence": 61,
                "why": "Core exposure can stay on, but this is not the time for aggressive adding.",
                "safer": "Wait for calmer conditions before increasing size.",
                "horizon": "6-18 months",
            },
            {
                "ticker": "QQQ",
                "label": "High-beta growth",
                "signal": "avoid",
                "confidence": 76,
                "why": "High-beta exposure is the least attractive part of the stack in a preservation regime.",
                "safer": "Use broad ETFs or Treasuries instead.",
                "horizon": "1-6 months",
            },
        )
    return (
        {
            "ticker": "SPY",
            "label": "Broad ETF core",
            "signal": "buy",
            "confidence": 76,
            "why": "Risk conditions are supportive enough to keep compounding through diversified equity exposure.",
            "safer": "Build in tranches if volatility rises.",
            "horizon": "6-18 months",
        },
        {
            "ticker": "GLD",
            "label": "Gold defense",
            "signal": "hold",
            "confidence": 64,
            "why": "Gold still helps diversification, but the regime does not require an oversized hedge.",
            "safer": "Keep it as ballast, not the center of the plan.",
            "horizon": "3-12 months",
        },
        {
            "ticker": "SGOV",
            "label": "Treasury reserve sleeve",
            "signal": "hold",
            "confidence": 74,
            "why": "Reserve capital still belongs in short-duration safety, even when growth conditions improve.",
            "safer": "Do not drain the reserve sleeve to chase extra return.",
            "horizon": "0-12 months",
        },
        {
            "ticker": "QQQ",
            "label": "High-beta growth",
            "signal": "add slowly",
            "confidence": 62,
            "why": "Momentum can work in a supportive regime, but concentrated beta still deserves caution.",
            "safer": "Prefer broad ETFs if conviction is lower.",
            "horizon": "1-6 months",
        },
    )


def build_signal_state(fred_api_key: str | None = None) -> SignalState:
    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(tickers=DEFAULT_TICKERS),
    )
    regime = pipeline.regime_snapshot()
    stress = pipeline.market_stress_signal()
    sovereign_score = pipeline.generate_sovereign_score(DEFAULT_TICKERS[0])
    internals = MarketInternalsFactory().build()
    credit = CreditLiquidityFactor().build()
    event_risk = EventRiskFilter().evaluate(pipeline.get_economic_calendar())
    decision = EnsembleDecisionEngine().decide(
        ticker=DEFAULT_TICKERS[0],
        regime_snapshot=regime,
        stress_snapshot=stress,
        sovereign_score=sovereign_score,
        internals=internals,
        event_risk=event_risk,
        credit=credit,
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
    reason = f"{regime['narrative']} | {internals.summary} | {credit.summary} | {event_risk.summary} | {decision.attribution}"

    state = SignalState(
        mode=mode,
        label=label,
        message=message,
        reason=reason,
        hourly_drawdown=float(stress["hourly_drawdown"]),
    )
    return SignalState(**{**asdict(state), "top_signals": build_top_signals(state)})


def load_previous_state() -> SignalState | None:
    payload = load_signal_payload()
    if payload is None:
        return None
    relevant = {
        "mode": payload["mode"],
        "label": payload["label"],
        "message": payload["message"],
        "reason": payload["reason"],
        "hourly_drawdown": payload["hourly_drawdown"],
        "top_signals": tuple(payload.get("top_signals", [])),
    }
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
    notifier.send_top_signals(signals=state.top_signals, timestamp=pd.Timestamp(datetime.now(UTC)))
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
    log_experiment_run(
        {
            "timestamp": datetime.now(UTC).isoformat(),
            "engine_version": EnsembleDecisionEngine.version,
            "mode": state.mode,
            "summary": state.message,
        }
    )
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
