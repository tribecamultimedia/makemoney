from __future__ import annotations

import json
import os
from datetime import UTC, datetime

import pandas as pd

from .ledger import read_equity_curve, read_ledger
from .notifications import DiscordNotifier


def build_report() -> dict[str, object]:
    ledger = read_ledger()
    equity = read_equity_curve()
    if equity.empty:
        return {
            "trades": 0,
            "submitted": 0,
            "errors": 0,
            "latest_equity": 0.0,
            "return_pct": 0.0,
            "max_drawdown_pct": 0.0,
            "protect_count": 0,
            "win_rate_pct": 0.0,
        }
    equity = equity.sort_values("timestamp").reset_index(drop=True)
    submitted = int((ledger["status"] == "submitted").sum()) if not ledger.empty else 0
    errors = int((ledger["status"] == "error").sum()) if not ledger.empty else 0
    protect_count = int(((ledger["status"] == "submitted") & (ledger["action"] == "PROTECT")).sum()) if not ledger.empty else 0
    start_equity = float(equity["equity"].iloc[0])
    latest_equity = float(equity["equity"].iloc[-1])
    return_pct = 0.0 if start_equity == 0 else ((latest_equity / start_equity) - 1.0) * 100.0
    running_peak = equity["equity"].cummax()
    max_drawdown_pct = abs(float(((equity["equity"] / running_peak) - 1.0).min()) * 100.0)
    win_rate_pct = 0.0
    if not ledger.empty and submitted > 0:
        ledger_frame = ledger.copy().sort_values("timestamp")
        ledger_frame["timestamp"] = pd.to_datetime(ledger_frame["timestamp"])
        wins = 0
        evaluated = 0
        for row in ledger_frame[ledger_frame["status"] == "submitted"].itertuples():
            before = equity[equity["timestamp"] <= row.timestamp]
            after = equity[equity["timestamp"] > row.timestamp]
            if before.empty or after.empty:
                continue
            before_equity = float(before.iloc[-1]["equity"])
            after_equity = float(after.iloc[0]["equity"])
            evaluated += 1
            if row.action == "BUY" and after_equity >= before_equity:
                wins += 1
            elif row.action == "PROTECT" and after_equity <= before_equity:
                wins += 1
        win_rate_pct = 0.0 if evaluated == 0 else (wins / evaluated) * 100.0
    return {
        "trades": int(len(ledger)),
        "submitted": submitted,
        "errors": errors,
        "latest_equity": latest_equity,
        "return_pct": return_pct,
        "max_drawdown_pct": max_drawdown_pct,
        "protect_count": protect_count,
        "win_rate_pct": win_rate_pct,
    }


def main() -> None:
    notifier = DiscordNotifier(
        webhook_url=os.getenv("DISCORD_WEBHOOK_URL"),
        username="Sovereign AI",
        app_url=os.getenv("APP_URL", "https://makemoneywithtommy.streamlit.app"),
    )
    report = build_report()
    notifier.send_report(report=report, timestamp=datetime.now(UTC))
    print(json.dumps(report))


if __name__ == "__main__":
    main()
