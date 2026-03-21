"""Domain models for future TELAJ-friendly extraction."""

from .portfolio import PortfolioChecklistItem, PortfolioDoctorResult
from .planning import AllocationItem, MoneyGeniePlan, PlannerComparisonRow, PlanningRequest
from .real_estate import RealEstateAnalysis, RealEstateScenario
from .scenarios import ScenarioShockResult, WealthMapState
from .signals import DailyBriefing, EverydayGuideSummary, MachineStance, MarketPulseSummary, MediaTone, SignalIdea
from .user_profiles import OnboardingState

__all__ = [
    "AllocationItem",
    "DailyBriefing",
    "EverydayGuideSummary",
    "MachineStance",
    "MoneyGeniePlan",
    "MarketPulseSummary",
    "MediaTone",
    "OnboardingState",
    "PortfolioChecklistItem",
    "PortfolioDoctorResult",
    "PlannerComparisonRow",
    "PlanningRequest",
    "RealEstateAnalysis",
    "RealEstateScenario",
    "ScenarioShockResult",
    "SignalIdea",
    "WealthMapState",
]
