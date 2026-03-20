from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


STATE_DIR = Path(".state")
EXPERIMENT_PATH = STATE_DIR / "experiment_runs.jsonl"


def log_experiment_run(payload: dict[str, object]) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    with EXPERIMENT_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def read_experiment_runs(limit: int | None = None) -> pd.DataFrame:
    if not EXPERIMENT_PATH.exists():
        return pd.DataFrame(columns=["timestamp", "engine_version", "mode", "summary"])
    rows = [json.loads(line) for line in EXPERIMENT_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]
    frame = pd.DataFrame(rows)
    if frame.empty:
        return pd.DataFrame(columns=["timestamp", "engine_version", "mode", "summary"])
    frame["timestamp"] = pd.to_datetime(frame["timestamp"])
    frame = frame.sort_values("timestamp", ascending=False)
    return frame.head(limit) if limit is not None else frame
