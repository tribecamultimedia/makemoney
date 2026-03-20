from __future__ import annotations

from dataclasses import asdict, dataclass

import pandas as pd

from .storage import append_equity_record, append_ledger_record, read_equity_frame, read_ledger_frame


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
    append_ledger_record(asdict(entry))


def append_equity_snapshot(*, timestamp: str, equity: float, cash: float, mode: str) -> None:
    payload = {"timestamp": timestamp, "equity": equity, "cash": cash, "mode": mode}
    append_equity_record(payload)


def read_ledger() -> pd.DataFrame:
    return read_ledger_frame()


def read_equity_curve() -> pd.DataFrame:
    return read_equity_frame()
