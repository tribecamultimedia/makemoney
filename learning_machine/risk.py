from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class CircuitBreaker:
    max_session_drawdown: float = 0.05
    peak_equity: float = field(init=False, default=1.0)
    halted: bool = field(init=False, default=False)

    def __post_init__(self) -> None:
        self.reset()

    def reset(self) -> None:
        self.peak_equity = 1.0
        self.halted = False

    def update(self, equity: float) -> bool:
        self.peak_equity = max(self.peak_equity, equity)
        drawdown = 0.0 if self.peak_equity == 0 else 1.0 - (equity / self.peak_equity)
        self.halted = drawdown >= self.max_session_drawdown
        return self.halted
