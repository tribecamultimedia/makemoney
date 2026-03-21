from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class WealthMapState:
    cash_pct: float
    stocks_pct: float
    bonds_pct: float
    crypto_pct: float
    real_estate_pct: float
    diversification_score: int
    risk_score: int
    status: str
    notes: tuple[str, ...]


@dataclass(frozen=True, slots=True)
class ScenarioShockResult:
    scenario_name: str
    shock_description: str
    portfolio_impact_pct: float
    cash_impact_pct: float
    stocks_impact_pct: float
    bonds_impact_pct: float
    crypto_impact_pct: float
    real_estate_impact_pct: float
    worst_bucket: str
    best_bucket: str
    guidance: tuple[str, ...]
    narrative: str

