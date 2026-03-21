from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class OnboardingState:
    current_step: int = 0
    completed: bool = False
    answers: dict[str, str] = field(default_factory=dict)

