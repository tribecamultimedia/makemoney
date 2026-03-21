from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class LegacyPlanInputs:
    children_fund_target: float
    long_term_reserve_months: int
    annual_family_contribution: float
    wealth_transfer_priority: str


@dataclass(frozen=True, slots=True)
class LegacyPlanSummary:
    posture: str
    reserve_target: float
    reserve_gap: float
    children_target_gap: float
    recommendation: str
    why: tuple[str, ...]
    risks: tuple[str, ...]
    safer_option: str
    confidence: str
