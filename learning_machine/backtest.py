from __future__ import annotations

from collections.abc import Callable
from typing import TYPE_CHECKING

import pandas as pd

from .risk import CircuitBreaker

if TYPE_CHECKING:
    from .notifications import DiscordNotifier


def run_backtest(
    data: pd.DataFrame,
    signal_fn: Callable[[pd.Series, dict[str, float]], int],
    initial_cash: float = 100_000.0,
    slippage_bps: float = 10.0,
    max_session_drawdown: float = 0.05,
    asset_name: str = "Asset",
    notifier: DiscordNotifier | None = None,
    reason_fn: Callable[[pd.Series, int, dict[str, float]], str] | None = None,
) -> pd.DataFrame:
    """
    Replays a long/flat policy over historical data.

    `signal_fn` returns 0 for flat and 1 for long.
    """

    cash = initial_cash
    shares = 0.0
    position = 0
    circuit_breaker = CircuitBreaker(max_session_drawdown=max_session_drawdown)
    records: list[dict[str, float | int | pd.Timestamp | bool]] = []

    for timestamp, row in data.iterrows():
        close = float(row["close"])
        context = {
            "position": float(position),
            "cash_ratio": cash / initial_cash,
            "equity_ratio": (cash + shares * close) / initial_cash,
        }
        signal = int(signal_fn(row, context))
        execution_price = close * (1 + slippage_bps / 10_000.0) if signal == 1 else close * (
            1 - slippage_bps / 10_000.0
        )

        if signal != position:
            if notifier is not None:
                action = "BUY" if signal == 1 else "SELL"
                reason = (
                    reason_fn(row, signal, context)
                    if reason_fn is not None
                    else "The model detected a shift in trend and risk balance."
                )
                notifier.send_signal(
                    asset_name=asset_name,
                    action=action,
                    reason=reason,
                    price=close,
                    timestamp=timestamp,
                )
            if position == 1:
                cash += shares * execution_price
                shares = 0.0
            elif signal == 1:
                shares = cash / execution_price if execution_price else 0.0
                cash = 0.0
            position = signal

        equity = cash + shares * close
        halted = circuit_breaker.update(equity / initial_cash)
        records.append(
            {
                "date": timestamp,
                "close": close,
                "signal": signal,
                "position": position,
                "cash": cash,
                "shares": shares,
                "equity": equity,
                "halted": halted,
                "yield_curve_10y_2y": float(row.get("yield_curve_10y_2y", 0.0)),
                "inflation_yoy": float(row.get("inflation_yoy", 0.0)),
                "sentiment_score": float(row.get("sentiment_score", 0.0)),
            }
        )
        if halted:
            break

    frame = pd.DataFrame.from_records(records).set_index("date")
    frame["returns"] = frame["equity"].pct_change().fillna(0.0)
    frame["drawdown"] = 1.0 - frame["equity"] / frame["equity"].cummax()
    return frame
