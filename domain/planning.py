from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class AllocationItem:
    label: str
    weight: int


@dataclass(frozen=True, slots=True)
class PlannerComparisonRow:
    asset: str
    value_today: float
    return_pct: float


@dataclass(frozen=True, slots=True)
class PlanningRequest:
    amount: float
    horizon_years: int
    risk_profile: str
    account_type: str


@dataclass(frozen=True, slots=True)
class MoneyGeniePlan:
    plan_name: str
    allocation: tuple[AllocationItem, ...]
    summary: str
    reasons: tuple[str, ...]
    key_risks: tuple[str, ...]
    suitable_time_horizon: str
    safer_alternative: str
    footer: str
    account_note: str
    board_note: str
