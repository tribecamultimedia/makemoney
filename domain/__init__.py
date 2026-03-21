"""Domain models for future TELAJ-friendly extraction."""

from .balance_sheet import (
    AllocationRecommendation,
    AssetProductivityItem,
    AssetProductivityReport,
    BalanceSheetBucket,
    BalanceSheetInputs,
    BalanceSheetSummary,
    LiabilityPressureResult,
)
from .family_capital import FamilyCapitalCard, FamilyCapitalDashboard
from .legacy import LegacyPlanInputs, LegacyPlanSummary
from .portfolio import PortfolioChecklistItem, PortfolioDoctorResult
from .planning import AllocationItem, MoneyGeniePlan, PlannerComparisonRow, PlanningRequest
from .real_estate import PropertyRecord, RealEstateAnalysis, RealEstateDecision, RealEstatePortfolioSummary, RealEstateScenario
from .scenarios import HouseholdScenarioResult, ScenarioShockResult, WealthMapState
from .signals import DailyBriefing, EverydayGuideSummary, MachineStance, MarketPulseSummary, MediaTone, SignalIdea
from .user_profiles import FamilyProfile, OnboardingState

__all__ = [
    "AllocationItem",
    "AllocationRecommendation",
    "AssetProductivityItem",
    "AssetProductivityReport",
    "BalanceSheetBucket",
    "BalanceSheetInputs",
    "BalanceSheetSummary",
    "DailyBriefing",
    "EverydayGuideSummary",
    "FamilyProfile",
    "FamilyCapitalCard",
    "FamilyCapitalDashboard",
    "HouseholdScenarioResult",
    "LegacyPlanInputs",
    "LegacyPlanSummary",
    "MachineStance",
    "MoneyGeniePlan",
    "MarketPulseSummary",
    "MediaTone",
    "OnboardingState",
    "PortfolioChecklistItem",
    "PortfolioDoctorResult",
    "PlannerComparisonRow",
    "PlanningRequest",
    "PropertyRecord",
    "RealEstateAnalysis",
    "RealEstateDecision",
    "RealEstatePortfolioSummary",
    "RealEstateScenario",
    "ScenarioShockResult",
    "SignalIdea",
    "LiabilityPressureResult",
    "WealthMapState",
]
