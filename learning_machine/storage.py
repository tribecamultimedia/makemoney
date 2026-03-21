from __future__ import annotations

import json
import os
from dataclasses import asdict
from pathlib import Path

import pandas as pd
import requests


STATE_DIR = Path(".state")
LEDGER_PATH = STATE_DIR / "trade_ledger.jsonl"
EQUITY_PATH = STATE_DIR / "equity_curve.jsonl"
SIGNAL_PATH = STATE_DIR / "latest_signal.json"
FAMILY_WEALTH_PATH = STATE_DIR / "family_wealth_state.json"


LEDGER_COLUMNS = ["timestamp", "symbol", "mode", "action", "status", "reason", "notional", "equity", "cash"]
EQUITY_COLUMNS = ["timestamp", "equity", "cash", "mode"]


def _streamlit_secrets() -> dict[str, str]:
    try:
        import streamlit as st  # type: ignore
    except Exception:
        return {}
    try:
        return {key: str(value) for key, value in st.secrets.items()}
    except Exception:
        return {}


def _get_setting(name: str, default: str = "") -> str:
    value = os.getenv(name)
    if value:
        return value
    return _streamlit_secrets().get(name, default)


def shared_storage_enabled() -> bool:
    return bool(_get_setting("SUPABASE_URL") and _get_setting("SUPABASE_SERVICE_ROLE_KEY"))


def _supabase_headers() -> dict[str, str]:
    key = _get_setting("SUPABASE_SERVICE_ROLE_KEY")
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }


def _supabase_base() -> str:
    return _get_setting("SUPABASE_URL").rstrip("/") + "/rest/v1"


def _ensure_state_dir() -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)


def append_local_jsonl(path: Path, payload: dict[str, object]) -> None:
    _ensure_state_dir()
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def read_local_jsonl(path: Path, columns: list[str]) -> pd.DataFrame:
    if not path.exists():
        return pd.DataFrame(columns=columns)
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not rows:
        return pd.DataFrame(columns=columns)
    return pd.DataFrame(rows)


def append_ledger_record(payload: dict[str, object]) -> None:
    if shared_storage_enabled():
        response = requests.post(
            f"{_supabase_base()}/trade_ledger",
            headers={**_supabase_headers(), "Prefer": "return=minimal"},
            json=payload,
            timeout=15,
        )
        response.raise_for_status()
        return
    append_local_jsonl(LEDGER_PATH, payload)


def append_equity_record(payload: dict[str, object]) -> None:
    if shared_storage_enabled():
        response = requests.post(
            f"{_supabase_base()}/equity_curve",
            headers={**_supabase_headers(), "Prefer": "return=minimal"},
            json=payload,
            timeout=15,
        )
        response.raise_for_status()
        return
    append_local_jsonl(EQUITY_PATH, payload)


def read_ledger_frame(limit: int | None = None) -> pd.DataFrame:
    if shared_storage_enabled():
        query = "?select=timestamp,symbol,mode,action,status,reason,notional,equity,cash&order=timestamp.desc"
        if limit is not None:
            query += f"&limit={limit}"
        response = requests.get(f"{_supabase_base()}/trade_ledger{query}", headers=_supabase_headers(), timeout=15)
        response.raise_for_status()
        frame = pd.DataFrame(response.json())
    else:
        frame = read_local_jsonl(LEDGER_PATH, LEDGER_COLUMNS)
    if frame.empty:
        return pd.DataFrame(columns=LEDGER_COLUMNS)
    return frame


def read_equity_frame(limit: int | None = None) -> pd.DataFrame:
    if shared_storage_enabled():
        query = "?select=timestamp,equity,cash,mode&order=timestamp.asc"
        if limit is not None:
            query += f"&limit={limit}"
        response = requests.get(f"{_supabase_base()}/equity_curve{query}", headers=_supabase_headers(), timeout=15)
        response.raise_for_status()
        frame = pd.DataFrame(response.json())
    else:
        frame = read_local_jsonl(EQUITY_PATH, EQUITY_COLUMNS)
    if frame.empty:
        return pd.DataFrame(columns=EQUITY_COLUMNS)
    frame["timestamp"] = pd.to_datetime(frame["timestamp"])
    return frame.sort_values("timestamp")


def save_signal_payload(payload: dict[str, object]) -> None:
    if shared_storage_enabled():
        data = {"id": "current", **payload}
        response = requests.post(
            f"{_supabase_base()}/latest_signal?on_conflict=id",
            headers={**_supabase_headers(), "Prefer": "resolution=merge-duplicates,return=minimal"},
            json=data,
            timeout=15,
        )
        response.raise_for_status()
        return
    _ensure_state_dir()
    SIGNAL_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def load_signal_payload() -> dict[str, object] | None:
    if shared_storage_enabled():
        response = requests.get(
            f"{_supabase_base()}/latest_signal?select=mode,label,message,reason,hourly_drawdown,updated_at&id=eq.current",
            headers=_supabase_headers(),
            timeout=15,
        )
        response.raise_for_status()
        rows = response.json()
        return rows[0] if rows else None
    if not SIGNAL_PATH.exists():
        return None
    return json.loads(SIGNAL_PATH.read_text(encoding="utf-8"))


def save_family_wealth_state(
    *,
    profile: dict[str, object],
    balance_sheet: dict[str, object],
    legacy_plan: dict[str, object] | None = None,
    real_estate_registry: list[dict[str, object]] | None = None,
) -> None:
    payload = {
        "id": "current",
        "profile": profile,
        "balance_sheet": balance_sheet,
        "legacy_plan": legacy_plan or {},
        "real_estate_registry": real_estate_registry or [],
        "updated_at": pd.Timestamp.utcnow().isoformat(),
    }
    if shared_storage_enabled():
        try:
            response = requests.post(
                f"{_supabase_base()}/family_wealth_state?on_conflict=id",
                headers={**_supabase_headers(), "Prefer": "resolution=merge-duplicates,return=minimal"},
                json=payload,
                timeout=15,
            )
            response.raise_for_status()
            return
        except Exception:
            pass
    _ensure_state_dir()
    FAMILY_WEALTH_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def load_family_wealth_state() -> dict[str, object] | None:
    if shared_storage_enabled():
        try:
            response = requests.get(
                f"{_supabase_base()}/family_wealth_state?select=profile,balance_sheet,legacy_plan,real_estate_registry,updated_at&id=eq.current",
                headers=_supabase_headers(),
                timeout=15,
            )
            response.raise_for_status()
            rows = response.json()
            if rows:
                return rows[0]
        except Exception:
            pass
    if not FAMILY_WEALTH_PATH.exists():
        return None
    return json.loads(FAMILY_WEALTH_PATH.read_text(encoding="utf-8"))
