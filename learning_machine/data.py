from __future__ import annotations

import ssl
import urllib.request
from dataclasses import dataclass

import pandas as pd
import yfinance as yf
from fredapi import Fred

ssl._create_default_https_context = ssl._create_unverified_context

DEFAULT_FRED_API_KEY = "ecd3cca5a73f34459ae038422dfd970a"

try:
    import streamlit as st
except ImportError:  # pragma: no cover - streamlit is optional outside the UI
    st = None


@dataclass(slots=True)
class DataConfig:
    start: str = "2015-01-01"
    end: str = "2026-03-20"
    tickers: tuple[str, ...] = ("SPY", "QQQ")
    fred_series: dict[str, str] | None = None

    def __post_init__(self) -> None:
        if self.fred_series is None:
            self.fred_series = {
                "yield_curve_10y_2y": "T10Y2Y",
                "cpi_all_items": "CPIAUCSL",
            }


class DataPipeline:
    """Loads market and macro inputs and returns a single indexed frame per ticker."""

    def __init__(self, fred_api_key: str | None = None, config: DataConfig | None = None) -> None:
        self.config = config or DataConfig()
        resolved_key = self._resolve_fred_api_key(fred_api_key)
        self.fred = Fred(api_key=resolved_key) if resolved_key else None

    @staticmethod
    def _install_unverified_https_opener() -> None:
        context = ssl._create_unverified_context()
        opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=context))
        urllib.request.install_opener(opener)

    @staticmethod
    def _resolve_fred_api_key(explicit_key: str | None) -> str | None:
        if explicit_key:
            return explicit_key
        if st is not None:
            try:
                return str(st.secrets["FRED_API_KEY"])
            except Exception:
                pass
        return DEFAULT_FRED_API_KEY

    def load_ohlcv(self) -> dict[str, pd.DataFrame]:
        frames: dict[str, pd.DataFrame] = {}
        for ticker in self.config.tickers:
            df = yf.download(
                ticker,
                start=self.config.start,
                end=self.config.end,
                auto_adjust=False,
                progress=False,
            )
            if df.empty:
                raise ValueError(f"No OHLCV data returned for {ticker}.")
            df = self._normalize_yfinance_columns(df)
            df.index = pd.to_datetime(df.index).tz_localize(None)
            frames[ticker] = df
        return frames

    def load_macro(self, market_index: pd.DatetimeIndex) -> pd.DataFrame:
        macro = pd.DataFrame(index=market_index)
        if self.fred is None:
            macro["yield_curve_10y_2y"] = 0.0
            macro["cpi_all_items"] = 0.0
            macro["inflation_yoy"] = 0.0
            return macro

        self._install_unverified_https_opener()
        for feature_name, series_id in self.config.fred_series.items():
            values = self.fred.get_series(
                series_id,
                observation_start=self.config.start,
                observation_end=self.config.end,
            )
            series = pd.Series(values, name=feature_name)
            series.index = pd.to_datetime(series.index).tz_localize(None)
            macro = macro.join(series, how="left")

        macro = macro.sort_index().ffill().bfill()
        if "cpi_all_items" in macro:
            macro["inflation_yoy"] = macro["cpi_all_items"].pct_change(12).mul(100).fillna(0.0)
        else:
            macro["inflation_yoy"] = 0.0
        return macro

    def build_dataset(self) -> dict[str, pd.DataFrame]:
        ohlcv = self.load_ohlcv()
        reference_index = next(iter(ohlcv.values())).index
        macro = self.load_macro(reference_index)
        merged: dict[str, pd.DataFrame] = {}
        for ticker, frame in ohlcv.items():
            merged[ticker] = frame.join(macro, how="left").sort_index().ffill().dropna()
        return merged

    @staticmethod
    def _normalize_yfinance_columns(df: pd.DataFrame) -> pd.DataFrame:
        columns: list[str] = []
        for column in df.columns:
            if isinstance(column, tuple):
                column = next((part for part in column if part), column[0])
            normalized = str(column).lower().replace(" ", "_")
            columns.append(normalized)
        normalized_df = df.copy()
        normalized_df.columns = columns
        if "adj_close" in normalized_df.columns and "close" not in normalized_df.columns:
            normalized_df = normalized_df.rename(columns={"adj_close": "close"})
        return normalized_df
