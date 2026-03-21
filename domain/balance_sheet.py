from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class BalanceSheetBucket:
    label: str
    posture: str
    recommendation: str


@dataclass(frozen=True, slots=True)
class BalanceSheetSummary:
    liquid_assets: BalanceSheetBucket
    investments: BalanceSheetBucket
    real_estate: BalanceSheetBucket
    business_assets: BalanceSheetBucket
    liabilities: BalanceSheetBucket
    total_assets: float
    total_liabilities: float
    net_worth: float
    net_worth_posture: str
    productivity_summary: str
    liability_summary: str
    legacy_summary: str


@dataclass(frozen=True, slots=True)
class BalanceSheetInputs:
    liquid_assets: float
    investments: float
    real_estate: float
    business_assets: float
    liabilities: float
    monthly_liability_payment: float
    average_interest_rate_pct: float
    monthly_household_income: float
    monthly_household_expenses: float


@dataclass(frozen=True, slots=True)
class LiabilityPressureResult:
    pressure_level: str
    urgency: str
    monthly_burden: float
    interest_rate_pct: float
    burden_to_income_pct: float
    free_cash_flow_after_liabilities: float
    impact_on_growth: str
    recommendation: str
    confidence: str


@dataclass(frozen=True, slots=True)
class AssetProductivityItem:
    asset_class: str
    estimated_return_profile: str
    cash_flow_profile: str
    liquidity_profile: str
    risk_profile: str
    recommendation: str
    reason: str


@dataclass(frozen=True, slots=True)
class AssetProductivityReport:
    posture: str
    items: tuple[AssetProductivityItem, ...]
    summary: str


@dataclass(frozen=True, slots=True)
class AllocationRecommendation:
    recommendation: str
    why: tuple[str, ...]
    risks: tuple[str, ...]
    safer_option: str
    who_its_for: str
    confidence: str
    next_priority_stack: tuple[str, ...]
