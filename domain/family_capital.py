from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class FamilyCapitalCard:
    title: str
    value: str
    detail: str
    target_section: str


@dataclass(frozen=True, slots=True)
class FamilyCapitalDashboard:
    title: str
    subtitle: str
    cards: tuple[FamilyCapitalCard, ...] = field(default_factory=tuple)
    focus: tuple[str, ...] = field(default_factory=tuple)
