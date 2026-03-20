"""Learning Machine package."""

from .backtest import run_backtest
from .data import DataPipeline
from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker
from .experiment_tracker import log_experiment_run, read_experiment_runs
from .env import TradingEnvironment
from .features import FeatureFactory
from .intelligence import (
    AllocationPlan,
    CreditLiquidityFactor,
    CreditLiquiditySnapshot,
    EnsembleDecision,
    EnsembleDecisionEngine,
    EventRiskFilter,
    EventRiskSnapshot,
    MarketInternalsFactory,
    MarketInternalsSnapshot,
    PositionSizer,
    TradeAttributionLog,
)
from .ledger import append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
from .risk import CircuitBreaker
from .sentiment import SimulatedNewsFeed, SentimentSnapshot
from .trade_manager import TradeManager

__all__ = [
    "BrokerCredentials",
    "CircuitBreaker",
    "DataPipeline",
    "ExecutionSignal",
    "FeatureFactory",
    "GlobalCircuitBreaker",
    "AllocationPlan",
    "CreditLiquidityFactor",
    "CreditLiquiditySnapshot",
    "EnsembleDecision",
    "EnsembleDecisionEngine",
    "EventRiskFilter",
    "EventRiskSnapshot",
    "MarketInternalsFactory",
    "MarketInternalsSnapshot",
    "PositionSizer",
    "TradeAttributionLog",
    "log_experiment_run",
    "read_experiment_runs",
    "append_equity_snapshot",
    "append_ledger",
    "read_equity_curve",
    "read_ledger",
    "SentimentSnapshot",
    "SimulatedNewsFeed",
    "TradeManager",
    "TradingEnvironment",
    "run_backtest",
]
