from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class BrokerCredentials:
    api_key: str
    secret_key: str
    paper: bool = True
    auto_harvest: bool = False
    harvest_trigger_pct: float = 0.03
    harvest_take_pct: float = 0.25


@dataclass(slots=True)
class ExecutionSignal:
    symbol: str
    action: str
    confidence: float
    reason: str
    target_notional: float


@dataclass(slots=True)
class GlobalCircuitBreaker:
    hourly_drawdown_limit: float = -0.03

    def should_protect(self, hourly_return: float) -> bool:
        return hourly_return <= self.hourly_drawdown_limit
