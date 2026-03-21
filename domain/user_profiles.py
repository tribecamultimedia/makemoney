from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class FamilyProfile:
    owned_assets: str
    liabilities: str
    liquidity_profile: str
    primary_goal: str
    wealth_for: str
    drawdown_response: str
    invested_assets: str
    archetype: str
    risk_level: str
    liquidity_priority: str
    legacy_priority: str
    operating_posture: str


@dataclass(slots=True)
class OnboardingState:
    current_step: int = 0
    completed: bool = False
    answers: dict[str, str] = field(default_factory=dict)
    profile: dict[str, str] = field(default_factory=dict)
