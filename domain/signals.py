from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class SignalIdea:
    ticker: str
    score: float
    action: str
    rating: str
    momentum_20d: float
    drawdown_20d: float
    volatility_20d: float
    copy: str


@dataclass(frozen=True, slots=True)
class MachineStance:
    mode: str
    label: str
    message: str


@dataclass(frozen=True, slots=True)
class DailyBriefing:
    title: str
    body: str
    footer: str


@dataclass(frozen=True, slots=True)
class MediaTone:
    tone: str
    tone_color: str
    summary: str
    commentary: str
    score: float
    headlines: tuple[dict[str, str], ...] = field(default_factory=tuple)


@dataclass(frozen=True, slots=True)
class MarketPulseSummary:
    mode: str
    score: int
    label: str
    narrative: str
    message: str


@dataclass(frozen=True, slots=True)
class EverydayGuideSummary:
    best_idea_title: str
    best_idea_footer: str
    avoid_title: str
    avoid_footer: str
    next_step_title: str
    next_step_footer: str
