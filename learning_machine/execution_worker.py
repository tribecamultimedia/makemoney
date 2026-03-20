from __future__ import annotations

import json
import os
from datetime import UTC, datetime

from .execution import BrokerCredentials, ExecutionSignal, SovereignAgent
from .data import DataPipeline
from .intelligence import CreditLiquidityFactor, EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory, PortfolioAllocator
from .ledger import LedgerEntry, append_equity_snapshot, append_ledger
from .notifications import DiscordNotifier
from .signal_worker import build_signal_state
from .trade_manager import TradeManager


DEFAULT_TICKERS = ("SPY", "QQQ")


def is_market_hours(now: datetime) -> bool:
    if now.weekday() > 4:
        return False
    minutes = now.hour * 60 + now.minute
    return (14 * 60 + 30) <= minutes <= (21 * 60)


def build_credentials_from_env() -> BrokerCredentials:
    api_key = os.getenv("ALPACA_API_KEY", "")
    secret_key = os.getenv("ALPACA_SECRET_KEY", "")
    if not api_key or not secret_key:
        raise RuntimeError("ALPACA_API_KEY and ALPACA_SECRET_KEY are required.")
    return BrokerCredentials(
        api_key=api_key,
        secret_key=secret_key,
        paper=(os.getenv("ALPACA_MODE", "paper").lower() != "live"),
        account_size=float(os.getenv("ACCOUNT_SIZE", "200")),
        max_position_notional=float(os.getenv("MAX_POSITION_NOTIONAL", "50")),
        daily_loss_limit_pct=float(os.getenv("DAILY_LOSS_LIMIT_PCT", "0.03")),
        cooldown_minutes=int(os.getenv("COOLDOWN_MINUTES", "60")),
        auto_harvest=os.getenv("AUTO_HARVEST", "false").lower() == "true",
    )

def main() -> None:
    now = datetime.now(UTC)
    if not is_market_hours(now):
        print(json.dumps({"executed": False, "reason": "outside_market_hours"}))
        return

    credentials = build_credentials_from_env()
    manager = TradeManager(credentials)
    notifier = DiscordNotifier(
        webhook_url=os.getenv("DISCORD_WEBHOOK_URL"),
        username="Sovereign AI",
        app_url=os.getenv("APP_URL", "https://makemoneywithtommy.streamlit.app"),
    )
    signal_state = build_signal_state(fred_api_key=os.getenv("FRED_API_KEY"))
    pipeline = DataPipeline(fred_api_key=os.getenv("FRED_API_KEY"))
    regime_snapshot = pipeline.regime_snapshot()
    stress_snapshot = pipeline.market_stress_signal()
    internals = MarketInternalsFactory().build()
    credit = CreditLiquidityFactor().build()
    event_risk = EventRiskFilter().evaluate(pipeline.get_economic_calendar())
    decision_engine = EnsembleDecisionEngine()
    allocator = PortfolioAllocator()
    snapshot = manager.portfolio_snapshot()
    append_equity_snapshot(
        timestamp=now.isoformat(),
        equity=float(snapshot["equity"]),
        cash=float(snapshot["cash"]),
        mode=credentials.paper and "PAPER" or "LIVE",
    )
    if float(snapshot["daily_pnl_pct"]) <= -credentials.daily_loss_limit_pct:
        print(json.dumps({"executed": False, "reason": "daily_loss_limit"}))
        return

    sovereign_agent = SovereignAgent()
    protect_override = sovereign_agent.should_kill_trade(signal_state.hourly_drawdown)
    results: list[dict[str, object]] = []
    decisions = {}
    for symbol in DEFAULT_TICKERS:
        sovereign_score = pipeline.generate_sovereign_score(symbol)
        decisions[symbol] = decision_engine.decide(
            ticker=symbol,
            regime_snapshot=regime_snapshot,
            stress_snapshot=stress_snapshot,
            sovereign_score=sovereign_score,
            internals=internals,
            event_risk=event_risk,
            credit=credit,
            base_notional=credentials.max_position_notional,
        )
    allocation = allocator.allocate(decisions=decisions, total_notional=credentials.max_position_notional * len(DEFAULT_TICKERS))
    for symbol in DEFAULT_TICKERS:
        decision = decisions[symbol]
        signal = ExecutionSignal(
            symbol=symbol,
            action=decision.action,
            confidence=decision.confidence,
            reason=f"{decision.summary} | {decision.attribution}",
            target_notional=allocation.notionals.get(symbol, decision.target_notional),
        )
        live_signal = signal
        if protect_override:
            live_signal = sovereign_agent.override_signal(signal, signal_state.hourly_drawdown)
        try:
            result = manager.sync_with_signal(live_signal)
            status = "submitted" if result.get("submitted") else "rejected"
            append_ledger(
                LedgerEntry(
                    timestamp=now.isoformat(),
                    symbol=live_signal.symbol,
                    mode=credentials.paper and "PAPER" or "LIVE",
                    action=live_signal.action,
                    status=status,
                    reason=live_signal.reason if status == "submitted" else str(result.get("reason")),
                    notional=float(result.get("notional", live_signal.target_notional)),
                    equity=float(snapshot["equity"]),
                    cash=float(snapshot["cash"]),
                )
            )
            if result.get("submitted"):
                notifier.send_signal(
                    asset_name=live_signal.symbol,
                    action=live_signal.action,
                    reason=live_signal.reason,
                    price=0.0,
                    timestamp=now,
                )
            results.append({"symbol": live_signal.symbol, "status": status})
        except Exception as exc:
            append_ledger(
                LedgerEntry(
                    timestamp=now.isoformat(),
                    symbol=live_signal.symbol,
                    mode=credentials.paper and "PAPER" or "LIVE",
                    action=live_signal.action,
                    status="error",
                    reason=str(exc),
                    notional=live_signal.target_notional,
                    equity=float(snapshot["equity"]),
                    cash=float(snapshot["cash"]),
                )
            )
            results.append({"symbol": live_signal.symbol, "status": "error", "error": str(exc)})

    try:
        closing_snapshot = manager.portfolio_snapshot()
        append_equity_snapshot(
            timestamp=datetime.now(UTC).isoformat(),
            equity=float(closing_snapshot["equity"]),
            cash=float(closing_snapshot["cash"]),
            mode=credentials.paper and "PAPER" or "LIVE",
        )
    except Exception:
        closing_snapshot = snapshot

    print(json.dumps({"executed": True, "mode": signal_state.mode, "results": results}))


if __name__ == "__main__":
    main()
