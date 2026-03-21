"""Domain models for future TELAJ-friendly extraction."""

from .portfolio import PortfolioChecklistItem, PortfolioDoctorResult
from .planning import AllocationItem, MoneyGeniePlan, PlannerComparisonRow

__all__ = [
    "AllocationItem",
    "MoneyGeniePlan",
    "PortfolioChecklistItem",
    "PortfolioDoctorResult",
    "PlannerComparisonRow",
]
