from __future__ import annotations

import json
import os
from datetime import UTC, datetime

from .ledger import read_equity_curve, read_ledger
from .notifications import DiscordNotifier


def build_report() -> dict[str, object]:
    ledger = read_ledger()
    equity = read_equity_curve()
    if equity.empty:
        return {"trades": 0, "submitted": 0, "errors": 0, "latest_equity": 0.0, "return_pct": 0.0}
    submitted = int((ledger["status"] == "submitted").sum()) if not ledger.empty else 0
    errors = int((ledger["status"] == "error").sum()) if not ledger.empty else 0
    start_equity = float(equity["equity"].iloc[0])
    latest_equity = float(equity["equity"].iloc[-1])
    return_pct = 0.0 if start_equity == 0 else ((latest_equity / start_equity) - 1.0) * 100.0
    return {
        "trades": int(len(ledger)),
        "submitted": submitted,
        "errors": errors,
        "latest_equity": latest_equity,
        "return_pct": return_pct,
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
