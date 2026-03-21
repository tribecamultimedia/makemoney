from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class RealEstateScenario:
    purchase_price: float
    down_payment_pct: float
    monthly_rent: float
    rate_pct: float
    monthly_expenses: float
    expected_appreciation_pct: float
    holding_period_years: int


@dataclass(frozen=True, slots=True)
class RealEstateAnalysis:
    monthly_cash_flow: float
    cap_rate_pct: float
    cash_on_cash_pct: float
    downside_cash_flow: float
    estimated_equity_gain: float
    summary: str
    downside_summary: str
    tax_note: str

