from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class PortfolioChecklistItem:
    simple_check: str
    answer: str
    meaning: str


@dataclass(frozen=True, slots=True)
class PortfolioDoctorResult:
    diagnosis: str
    footer: str
    cash_pct: float
    concentration_pct: float
    conflict_symbols: tuple[str, ...]
    checklist: tuple[PortfolioChecklistItem, ...]
