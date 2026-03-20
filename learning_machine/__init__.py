"""Learning Machine package."""

from .backtest import run_backtest
from .data import DataPipeline
from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker
from .env import TradingEnvironment
from .features import FeatureFactory
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
    "SentimentSnapshot",
    "SimulatedNewsFeed",
    "TradeManager",
    "TradingEnvironment",
    "run_backtest",
]
