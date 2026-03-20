from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

import pandas as pd


STATE_DIR = Path(".state")
LEDGER_PATH = STATE_DIR / "trade_ledger.jsonl"
EQUITY_PATH = STATE_DIR / "equity_curve.jsonl"


@dataclass(slots=True)
class LedgerEntry:
    timestamp: str
    symbol: str
    mode: str
    action: str
    status: str
    reason: str
    notional: float
    equity: float | None = None
    cash: float | None = None


def append_ledger(entry: LedgerEntry) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    with LEDGER_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(asdict(entry)) + "\n")


def append_equity_snapshot(*, timestamp: str, equity: float, cash: float, mode: str) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    payload = {"timestamp": timestamp, "equity": equity, "cash": cash, "mode": mode}
    with EQUITY_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def read_ledger() -> pd.DataFrame:
    if not LEDGER_PATH.exists():
        return pd.DataFrame(columns=["timestamp", "symbol", "mode", "action", "status", "reason", "notional"])
    rows = [json.loads(line) for line in LEDGER_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]
    return pd.DataFrame(rows)


def read_equity_curve() -> pd.DataFrame:
    if not EQUITY_PATH.exists():
        return pd.DataFrame(columns=["timestamp", "equity", "cash", "mode"])
    rows = [json.loads(line) for line in EQUITY_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]
    frame = pd.DataFrame(rows)
    if not frame.empty:
        frame["timestamp"] = pd.to_datetime(frame["timestamp"])
    return frame.sort_values("timestamp")
