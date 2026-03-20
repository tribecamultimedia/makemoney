from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

import pandas as pd
import yfinance as yf


def _extract_close_series(data: pd.DataFrame, symbol: str) -> pd.Series:
    if not isinstance(data.columns, pd.MultiIndex):
        close_column = "Close" if "Close" in data.columns else "close"
        return pd.Series(data[close_column]).dropna().astype(float)

    level0 = data.columns.get_level_values(0)
    level1 = data.columns.get_level_values(1)

    if symbol in level0:
        frame = data[symbol]
        close_column = "Close" if "Close" in frame.columns else "close"
        return pd.Series(frame[close_column]).dropna().astype(float)

    if symbol in level1:
        close_key = ("Close", symbol) if ("Close", symbol) in data.columns else ("close", symbol)
        return pd.Series(data[close_key]).dropna().astype(float)

    raise KeyError(symbol)


@dataclass(slots=True)
class MarketInternalsSnapshot:
    vix_level: float
    vix_regime: str
    tlt_return_20d: float
    gld_return_20d: float
    xlf_above_50dma: bool
    soxx_above_50dma: bool
    qqq_vs_spy_momentum: float
    cross_asset_confirmation: float
    summary: str


@dataclass(slots=True)
class EventRiskSnapshot:
    block_new_risk: bool
    size_multiplier: float
    next_event: str
    hours_to_event: float
    summary: str


@dataclass(slots=True)
class CreditLiquiditySnapshot:
    hyg_return_20d: float
    lqd_return_20d: float
    iwm_vs_spy_momentum: float
    liquidity_score: float
    summary: str


@dataclass(slots=True)
class EnsembleDecision:
    mode: str
    action: str
    confidence: float
    composite_score: float
    target_notional: float
    summary: str
    attribution: str


@dataclass(slots=True)
class AllocationPlan:
    weights: dict[str, float]
    notionals: dict[str, float]
    summary: str


class MarketInternalsFactory:
    def build(self) -> MarketInternalsSnapshot:
        symbols = ["^VIX", "TLT", "GLD", "XLF", "SOXX", "SPY", "QQQ"]
        data = yf.download(
            symbols,
            period="6mo",
            interval="1d",
            auto_adjust=False,
            progress=False,
            group_by="ticker",
        )
        closes: dict[str, pd.Series] = {}
        for symbol in symbols:
            closes[symbol] = _extract_close_series(data, symbol)

        vix_level = float(closes["^VIX"].iloc[-1])
        tlt_return_20d = float(closes["TLT"].pct_change(20).iloc[-1] * 100.0)
        gld_return_20d = float(closes["GLD"].pct_change(20).iloc[-1] * 100.0)
        xlf_above_50dma = bool(closes["XLF"].iloc[-1] > closes["XLF"].rolling(50).mean().iloc[-1])
        soxx_above_50dma = bool(closes["SOXX"].iloc[-1] > closes["SOXX"].rolling(50).mean().iloc[-1])
        qqq_vs_spy_momentum = float(
            closes["QQQ"].pct_change(20).iloc[-1] - closes["SPY"].pct_change(20).iloc[-1]
        ) * 100.0

        confirmation = 0.0
        confirmation += 0.35 if vix_level < 18 else -0.35 if vix_level > 24 else 0.0
        confirmation += 0.20 if tlt_return_20d < 0 else -0.10
        confirmation += 0.10 if gld_return_20d < 3.0 else -0.10
        confirmation += 0.15 if xlf_above_50dma else -0.15
        confirmation += 0.15 if soxx_above_50dma else -0.15
        confirmation += 0.10 if qqq_vs_spy_momentum > 0 else -0.05

        if confirmation >= 0.4:
            summary = "Cross-asset internals are confirming risk appetite instead of quietly arguing with it."
        elif confirmation <= -0.2:
            summary = "Other markets are not signing off on this risk story. That usually matters."
        else:
            summary = "Internals are mixed. The market is giving answers in pencil, not ink."

        return MarketInternalsSnapshot(
            vix_level=vix_level,
            vix_regime="calm" if vix_level < 18 else "stress" if vix_level > 24 else "neutral",
            tlt_return_20d=tlt_return_20d,
            gld_return_20d=gld_return_20d,
            xlf_above_50dma=xlf_above_50dma,
            soxx_above_50dma=soxx_above_50dma,
            qqq_vs_spy_momentum=qqq_vs_spy_momentum,
            cross_asset_confirmation=confirmation,
            summary=summary,
        )


class EventRiskFilter:
    def evaluate(self, events: list[dict[str, object]]) -> EventRiskSnapshot:
        if not events:
            return EventRiskSnapshot(False, 1.0, "No scheduled event", 999.0, "No event pressure detected.")

        next_event = events[0]
        event_name = str(next_event["event"])
        event_time = datetime.fromisoformat(str(next_event["timestamp"]))
        hours_to_event = max((event_time - datetime.now(timezone.utc)).total_seconds() / 3600.0, 0.0)

        if hours_to_event <= 6:
            return EventRiskSnapshot(
                block_new_risk=True,
                size_multiplier=0.0,
                next_event=event_name,
                hours_to_event=hours_to_event,
                summary="A top-tier macro event is almost here. New risk can wait until the shouting stops.",
            )
        if hours_to_event <= 24:
            return EventRiskSnapshot(
                block_new_risk=False,
                size_multiplier=0.5,
                next_event=event_name,
                hours_to_event=hours_to_event,
                summary="A major macro event is within a day, so size should stay on a leash.",
            )
        return EventRiskSnapshot(
            block_new_risk=False,
            size_multiplier=1.0,
            next_event=event_name,
            hours_to_event=hours_to_event,
            summary="The event calendar is not an immediate execution threat.",
        )


class CreditLiquidityFactor:
    def build(self) -> CreditLiquiditySnapshot:
        symbols = ["HYG", "LQD", "IWM", "SPY"]
        data = yf.download(
            symbols,
            period="6mo",
            interval="1d",
            auto_adjust=False,
            progress=False,
            group_by="ticker",
        )
        closes: dict[str, pd.Series] = {}
        for symbol in symbols:
            closes[symbol] = _extract_close_series(data, symbol)

        hyg_return_20d = float(closes["HYG"].pct_change(20).iloc[-1] * 100.0)
        lqd_return_20d = float(closes["LQD"].pct_change(20).iloc[-1] * 100.0)
        iwm_vs_spy_momentum = float(
            closes["IWM"].pct_change(20).iloc[-1] - closes["SPY"].pct_change(20).iloc[-1]
        ) * 100.0

        liquidity_score = 0.0
        liquidity_score += 0.3 if hyg_return_20d > 0 else -0.3
        liquidity_score += 0.2 if lqd_return_20d > 0 else -0.2
        liquidity_score += 0.15 if iwm_vs_spy_momentum > 0 else -0.1

        if liquidity_score >= 0.3:
            summary = "Credit and small-cap liquidity are cooperating. That usually means risk appetite has real backing."
        elif liquidity_score <= -0.2:
            summary = "Credit is not confirming the equity story. Institutions would notice."
        else:
            summary = "Liquidity is neither hostile nor enthusiastic. Treat that as faint praise."

        return CreditLiquiditySnapshot(
            hyg_return_20d=hyg_return_20d,
            lqd_return_20d=lqd_return_20d,
            iwm_vs_spy_momentum=iwm_vs_spy_momentum,
            liquidity_score=liquidity_score,
            summary=summary,
        )


class PositionSizer:
    def size_notional(
        self,
        *,
        base_notional: float,
        confidence: float,
        sovereign_score: float,
        volatility_20d: float,
        event_multiplier: float,
        regime_state: str,
    ) -> float:
        size_multiplier = max(0.1, min(confidence, 1.0))
        size_multiplier *= max(0.25, min(sovereign_score / 100.0, 1.0))
        size_multiplier *= event_multiplier
        if volatility_20d > 28:
            size_multiplier *= 0.6
        elif volatility_20d > 20:
            size_multiplier *= 0.8
        if regime_state == "tactical_accumulation":
            size_multiplier *= 0.7
        if regime_state == "capital_preservation":
            size_multiplier = 0.0
        return round(base_notional * size_multiplier, 2)


class TradeAttributionLog:
    def summarize(
        self,
        *,
        regime_state: str,
        sovereign_score: float,
        internals: MarketInternalsSnapshot,
        event_risk: EventRiskSnapshot,
        credit: CreditLiquiditySnapshot,
        version: str,
    ) -> str:
        parts = [
            f"version={version}",
            f"regime={regime_state}",
            f"score={sovereign_score:.1f}",
            f"vix={internals.vix_level:.1f}",
            f"cross_asset={internals.cross_asset_confirmation:+.2f}",
            f"liquidity={credit.liquidity_score:+.2f}",
            f"event={event_risk.next_event}",
            f"hours_to_event={event_risk.hours_to_event:.1f}",
        ]
        return " | ".join(parts)


class PortfolioAllocator:
    def allocate(self, *, decisions: dict[str, EnsembleDecision], total_notional: float) -> AllocationPlan:
        buy_scores = {
            ticker: max(decision.composite_score, 0.0)
            for ticker, decision in decisions.items()
            if decision.action == "BUY"
        }
        if not buy_scores:
            return AllocationPlan(
                weights={ticker: 0.0 for ticker in decisions},
                notionals={ticker: 0.0 for ticker in decisions},
                summary="No asset earned a real allocation. Cash remains the least offensive asset.",
            )

        total_score = sum(buy_scores.values()) or 1.0
        weights = {ticker: score / total_score for ticker, score in buy_scores.items()}
        notionals = {ticker: round(total_notional * weight, 2) for ticker, weight in weights.items()}
        full_weights = {ticker: weights.get(ticker, 0.0) for ticker in decisions}
        full_notionals = {ticker: notionals.get(ticker, 0.0) for ticker in decisions}
        summary = "Capital is being distributed by composite conviction, not equally out of politeness."
        return AllocationPlan(weights=full_weights, notionals=full_notionals, summary=summary)


class EnsembleDecisionEngine:
    version = "ensemble-v2"

    def __init__(self) -> None:
        self.position_sizer = PositionSizer()
        self.attribution_log = TradeAttributionLog()

    def decide(
        self,
        *,
        ticker: str,
        regime_snapshot: dict[str, float | str],
        stress_snapshot: dict[str, float | bool],
        sovereign_score: dict[str, float | str],
        internals: MarketInternalsSnapshot,
        event_risk: EventRiskSnapshot,
        credit: CreditLiquiditySnapshot,
        base_notional: float,
    ) -> EnsembleDecision:
        regime_state = str(regime_snapshot["state"])
        score = float(sovereign_score["score"])
        composite = score
        composite += internals.cross_asset_confirmation * 20.0
        composite += credit.liquidity_score * 18.0
        composite -= 18.0 if bool(stress_snapshot["triggered"]) else 0.0
        composite -= 10.0 if event_risk.block_new_risk else 0.0
        composite = max(0.0, min(100.0, composite))

        if bool(stress_snapshot["triggered"]) or regime_state == "capital_preservation":
            action = "PROTECT"
            mode = "capital_preservation"
            confidence = 0.98
            target_notional = 0.0
            summary = (
                f"{ticker}: macro and market stress are aligned against risk. Preservation beats prediction."
            )
        elif event_risk.block_new_risk:
            action = "PROTECT"
            mode = "event_freeze"
            confidence = 0.9
            target_notional = 0.0
            summary = f"{ticker}: a major macro event is too close. New exposure can wait."
        else:
            action = "BUY" if composite >= 52.0 else "PROTECT"
            mode = "risk_on_expansion" if composite >= 72 else "tactical_accumulation" if composite >= 52 else "capital_preservation"
            confidence = 0.55 + (composite / 200.0)
            target_notional = self.position_sizer.size_notional(
                base_notional=base_notional,
                confidence=confidence,
                sovereign_score=score,
                volatility_20d=float(sovereign_score["volatility_20d"]),
                event_multiplier=event_risk.size_multiplier,
                regime_state=regime_state,
            )
            if action == "BUY" and target_notional <= 5.0:
                action = "PROTECT"
                mode = "capital_preservation"
            summary = (
                f"{ticker}: score {score:.0f}, cross-asset confirmation {internals.cross_asset_confirmation:+.2f}, "
                f"event risk size {event_risk.size_multiplier:.2f}."
            )

        attribution = self.attribution_log.summarize(
            regime_state=regime_state,
            sovereign_score=score,
            internals=internals,
            event_risk=event_risk,
            credit=credit,
            version=self.version,
        )
        return EnsembleDecision(
            mode=mode,
            action=action,
            confidence=min(max(confidence, 0.0), 0.99),
            composite_score=round(composite, 1),
            target_notional=target_notional,
            summary=summary,
            attribution=attribution,
        )
