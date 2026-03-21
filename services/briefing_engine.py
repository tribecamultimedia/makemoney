from __future__ import annotations

from domain.signals import DailyBriefing, EverydayGuideSummary, MarketPulseSummary, MediaTone


class BriefingEngine:
    """Reusable plain-English briefing and summary layer."""

    version = "v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "briefing_engine",
            "status": "active",
            "purpose": "Plain-English market, media, and everyday guidance service.",
        }

    @staticmethod
    def build_daily_briefing(
        *,
        regime_snapshot: dict[str, float | str],
        pulse: MarketPulseSummary,
        bundle: str,
    ) -> DailyBriefing:
        curve = float(regime_snapshot["yield_curve_10y_2y"])
        if pulse.mode == "risk_on_expansion":
            body = (
                f"Good morning. The Yield Curve is at {curve:.2f}, which is the financial equivalent of a clear sky. "
                f"I've expanded your {bundle} core. If you were looking for a sign from the universe, this is it, only with better math."
            )
        elif pulse.mode == "tactical_accumulation":
            body = (
                f"Good morning. The Yield Curve is at {curve:.2f}. The weather is decent, not perfect. "
                "The Guru is accumulating with discipline instead of pretending every green candle is destiny."
            )
        else:
            body = (
                f"Good morning. The Yield Curve is at {curve:.2f}, and the market is being dramatic again. "
                "I've moved the posture toward defense because preserving capital beats giving speeches about conviction."
            )
        return DailyBriefing(title="Today's Briefing", body=body, footer=f"Yield Curve: {curve:.2f}")

    @staticmethod
    def build_media_tone(media_brief: dict[str, object]) -> MediaTone:
        headlines = tuple(dict(row) for row in media_brief.get("headlines", []) if isinstance(row, dict))
        return MediaTone(
            tone=str(media_brief.get("tone", "Mixed")),
            tone_color=str(media_brief.get("tone_color", "neutral")),
            summary=str(media_brief.get("summary", "")),
            commentary=str(media_brief.get("commentary", "")),
            score=float(media_brief.get("score", 0.0)),
            headlines=headlines,
        )

    @staticmethod
    def build_hype_copy(*, sentiment_score: int, pulse: MarketPulseSummary) -> str:
        if sentiment_score >= 75 and pulse.mode == "capital_preservation":
            return "The internet is screaming 'To the Moon.' The Guru is looking at the actual interest rates. One of them is lying. Hint: It's the one with the rocket emoji."
        if sentiment_score >= 75:
            return "The crowd finally found a pulse. Fine. Just remember volume is not wisdom."
        if sentiment_score <= 35 and pulse.mode == "risk_on_expansion":
            return "Retail is sulking while the macro tape improves. That usually means the market is already leaving without them."
        return "Noise is moderate. Which is perfect, because serious money prefers rooms without chanting."

    @staticmethod
    def build_everyday_guide(
        *,
        board,
        media_tone: MediaTone,
        machine_stance_label: str,
    ) -> EverydayGuideSummary | None:
        if board.empty:
            return None
        best = board.iloc[0]
        worst = board.iloc[-1]
        if str(best["action"]) == "BUY" and media_tone.tone != "Defensive":
            next_step = "Start small with the strongest idea, then let the machine earn the right to add more."
        elif "Capital Preservation" in machine_stance_label or str(best["action"]) == "PROTECT":
            next_step = "Do less for now. Cash and patience are real positions when the market feels unstable."
        else:
            next_step = "Watch first, then move slowly. The machine is not seeing a clean all-clear yet."
        return EverydayGuideSummary(
            best_idea_title=f"{best['ticker']} looks strongest right now.",
            best_idea_footer=f"{best['action']} | Score {best['score']:.1f} | {best['copy']}",
            avoid_title=f"{worst['ticker']} is the weakest setup on the board.",
            avoid_footer=f"{worst['action']} | Score {worst['score']:.1f} | Better to wait than force it.",
            next_step_title=next_step,
            next_step_footer=f"Media tone: {media_tone.tone} | Machine stance: {machine_stance_label}",
        )
