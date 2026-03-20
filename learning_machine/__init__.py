"""Learning Machine package."""

from .backtest import run_backtest
from .data import DataPipeline
from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker
from .env import TradingEnvironment
from .features import FeatureFactory
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
