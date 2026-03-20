from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands


@dataclass(slots=True)
class FeatureConfig:
    frac_diff_d: float = 0.4
    frac_diff_window: int = 20
    rsi_window: int = 14
    realized_vol_window: int = 20
    bollinger_window: int = 20


class FeatureFactory:
    """Feature engineering module for market and macro inputs."""

    def __init__(self, config: FeatureConfig | None = None) -> None:
        self.config = config or FeatureConfig()

    def transform(self, df: pd.DataFrame, sentiment: pd.Series | None = None) -> pd.DataFrame:
        features = df.copy()
        close = features["close"].astype(float)
        returns = close.pct_change().fillna(0.0)

        features["log_return"] = np.log(close).diff().fillna(0.0)
        features["realized_vol_20"] = returns.rolling(self.config.realized_vol_window).std().fillna(0.0)
        features["frac_diff_close"] = self._fractional_diff(
            close,
            d=self.config.frac_diff_d,
            window=self.config.frac_diff_window,
        )
        rsi = RSIIndicator(close, window=self.config.rsi_window).rsi().fillna(50.0)
        features["vol_scaled_rsi"] = (
            (rsi - 50.0) / (features["realized_vol_20"] + 1e-6)
        ).replace([np.inf, -np.inf], 0.0)
        bands = BollingerBands(close, window=self.config.bollinger_window)
        features["bb_width"] = (
            (bands.bollinger_hband() - bands.bollinger_lband()) / close
        ).fillna(0.0)
        features["volume_zscore"] = self._rolling_zscore(features["volume"].astype(float), 20)
        features["trend_5d"] = close.pct_change(5).fillna(0.0)
        features["trend_20d"] = close.pct_change(20).fillna(0.0)

        if sentiment is None:
            features["sentiment_score"] = 0.0
        else:
            features["sentiment_score"] = sentiment.reindex(features.index).ffill().fillna(0.0)

        feature_columns = [
            "open",
            "high",
            "low",
            "close",
            "volume",
            "yield_curve_10y_2y",
            "inflation_yoy",
            "log_return",
            "realized_vol_20",
            "frac_diff_close",
            "vol_scaled_rsi",
            "bb_width",
            "volume_zscore",
            "trend_5d",
            "trend_20d",
            "sentiment_score",
        ]
        return features[feature_columns].replace([np.inf, -np.inf], 0.0).dropna()

    def _fractional_diff(self, series: pd.Series, d: float, window: int) -> pd.Series:
        weights = self._frac_diff_weights(d, window)
        output = pd.Series(index=series.index, dtype=float)
        for idx in range(window - 1, len(series)):
            window_slice = series.iloc[idx - window + 1 : idx + 1]
            output.iloc[idx] = np.dot(weights[::-1], window_slice)
        return output.bfill().fillna(0.0)

    @staticmethod
    def _frac_diff_weights(d: float, window: int) -> np.ndarray:
        weights = [1.0]
        for k in range(1, window):
            weights.append(-weights[-1] * (d - k + 1) / k)
        return np.array(weights, dtype=float)

    @staticmethod
    def _rolling_zscore(series: pd.Series, window: int) -> pd.Series:
        mean = series.rolling(window).mean()
        std = series.rolling(window).std().replace(0.0, np.nan)
        return ((series - mean) / std).fillna(0.0)
