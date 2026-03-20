from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd


@dataclass(slots=True)
class SentimentSnapshot:
    as_of: str
    regime: str
    spy_bias: float
    qqq_bias: float
    rationale: str
    sources: tuple[str, ...]


CURRENT_SENTIMENT = SentimentSnapshot(
    as_of="2026-03-20",
    regime="mild_risk_off",
    spy_bias=-0.08,
    qqq_bias=-0.18,
    rationale=(
        "U.S. equity sentiment is cautious as inflation, higher Treasury yields, and energy "
        "pressure weigh on growth-heavy indices more than the broad market."
    ),
    sources=(
        "https://www.reuters.com/markets/us/",
        "https://fred.stlouisfed.org/series/T10Y2Y",
        "https://fred.stlouisfed.org/series/CPIAUCSL",
    ),
)


class SimulatedNewsFeed:
    """Creates deterministic daily sentiment series seeded by a current market snapshot."""

    def __init__(self, snapshot: SentimentSnapshot = CURRENT_SENTIMENT, seed: int = 7) -> None:
        self.snapshot = snapshot
        self.rng = np.random.default_rng(seed)

    def generate(self, index: pd.DatetimeIndex, ticker: str) -> pd.Series:
        base = self.snapshot.spy_bias if ticker.upper() == "SPY" else self.snapshot.qqq_bias
        seasonal = 0.05 * np.sin(np.linspace(0.0, 8.0 * np.pi, len(index)))
        shock = self.rng.normal(0.0, 0.04, len(index))
        sentiment = np.clip(base + seasonal + shock, -1.0, 1.0)
        return pd.Series(sentiment, index=index, name="sentiment_score")
