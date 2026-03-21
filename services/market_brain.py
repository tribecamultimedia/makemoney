from __future__ import annotations

from dataclasses import asdict

import pandas as pd

from domain.signals import MachineStance, MarketPulseSummary, SignalIdea


class MarketBrainService:
    """Reusable read-only market intelligence facade for UI and future API use."""

    version = "v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "market_brain",
            "status": "active",
            "purpose": "Reusable market intelligence facade for board, pulse, and stance summaries.",
        }

    @staticmethod
    def superbrain_rating(score: float) -> dict[str, str]:
        if score >= 75:
            return {"label": "High-conviction setup", "action": "BUY"}
        if score >= 55:
            return {"label": "Respectable but selective", "action": "HOLD"}
        return {"label": "Too weak to trust", "action": "PROTECT"}

    @staticmethod
    def pulse_message(mode: str) -> str:
        if mode == "capital_preservation":
            return "This market is acting like a toddler with leverage. Cash first."
        if mode == "tactical_accumulation":
            return "There is a trade here, not a romance. Scale in and keep your dignity."
        return "The tape is finally acting rational enough to fund optimism."

    def build_pulse_summary(
        self,
        *,
        regime_snapshot: dict[str, float | str],
        stress_snapshot: dict[str, float | bool],
    ) -> MarketPulseSummary:
        mode = "risk_on_expansion"
        score = 84
        label = "Risk-On Expansion"
        if bool(stress_snapshot["triggered"]) or str(regime_snapshot["state"]) == "capital_preservation":
            mode = "capital_preservation"
            score = 18
            label = "Capital Preservation Mode"
        elif str(regime_snapshot["state"]) == "tactical_accumulation":
            mode = "tactical_accumulation"
            score = 52
            label = "Tactical Accumulation"
        return MarketPulseSummary(
            mode=mode,
            score=score,
            label=label,
            narrative=str(regime_snapshot["narrative"]),
            message=self.pulse_message(mode),
        )

    def build_machine_stance(
        self,
        *,
        pulse: MarketPulseSummary,
        latest_signal: dict[str, object] | None,
    ) -> MachineStance:
        if latest_signal is not None:
            return MachineStance(
                mode=str(latest_signal.get("mode", pulse.mode)),
                label=str(latest_signal["label"]),
                message=str(latest_signal["message"]),
            )
        return MachineStance(mode=pulse.mode, label=pulse.label, message=pulse.message)

    def build_signal_ideas(self, *, pipeline, tickers: tuple[str, ...]) -> tuple[SignalIdea, ...]:
        rows: list[SignalIdea] = []
        for ticker in tickers:
            payload = pipeline.generate_sovereign_score(ticker)
            rating = self.superbrain_rating(float(payload["score"]))
            rows.append(
                SignalIdea(
                    ticker=ticker,
                    score=float(payload["score"]),
                    action=rating["action"],
                    rating=rating["label"],
                    momentum_20d=float(payload["momentum_20d"]),
                    drawdown_20d=float(payload["drawdown_20d"]),
                    volatility_20d=float(payload["volatility_20d"]),
                    copy=str(payload["copy"]),
                )
            )
        rows = sorted(rows, key=lambda row: (-row.score, row.ticker))
        return tuple(rows)

    def build_board_frame(self, *, pipeline, tickers: tuple[str, ...]) -> pd.DataFrame:
        return pd.DataFrame([asdict(row) for row in self.build_signal_ideas(pipeline=pipeline, tickers=tickers)])
