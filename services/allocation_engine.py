from __future__ import annotations

from dataclasses import asdict

from domain.balance_sheet import AllocationRecommendation


class AllocationEngine:
    """Starter capital allocation engine for TELAJ."""

    def recommend_next_dollar(self, profile: dict[str, str], balance_sheet: dict[str, object] | None = None, liability_pressure: dict[str, object] | None = None) -> dict[str, object]:
        liabilities = profile.get("liabilities", "")
        liquidity_profile = profile.get("liquidity_profile", "")
        goal = profile.get("primary_goal", "growth")
        wealth_for = profile.get("wealth_for", "me")
        liability_level = str((liability_pressure or {}).get("pressure_level", ""))
        net_worth = float((balance_sheet or {}).get("net_worth", 0.0) or 0.0)

        if liability_level == "High" or liabilities in {"Consumer or credit card debt", "A heavy mix of liabilities"}:
            recommendation = "Debt reduction"
            why = (
                "High-cost liabilities are likely beating your expected investment return after stress.",
                "Removing bad debt creates cleaner compounding room for the family.",
            )
            risks = (
                "If you over-focus on debt, you can delay building reserves.",
                "Not all debt is urgent, so the system still needs a ranking, not a blanket reaction.",
            )
            safer_option = "Build a minimal cash buffer first, then attack the worst liability."
            priority_stack = ("Cash reserve", "Debt reduction", "Retirement accounts", "Core investments")
            confidence = "High"
        elif liquidity_profile in {"Very little is liquid", "A smaller share is liquid"} and net_worth >= 0:
            recommendation = "Cash reserve"
            why = (
                "Low liquidity turns ordinary stress into forced decisions.",
                "A family office mindset starts with resilience before optimization.",
            )
            risks = (
                "Holding too much idle cash for too long can slow long-term growth.",
                "Cash alone does not build wealth unless it is a temporary staging area.",
            )
            safer_option = "Build a reserve target, then automatically route the next dollars into long-term assets."
            priority_stack = ("Cash reserve", "Debt reduction", "Core investments", "Children funds")
            confidence = "High"
        elif goal == "legacy" or wealth_for in {"children", "multi-generational"}:
            recommendation = "Children and legacy funds"
            why = (
                "The stated goal is larger than short-term return.",
                "Dedicated long-duration capital helps separate legacy planning from reactive market decisions.",
            )
            risks = (
                "Legacy buckets can become symbolic if the core family balance sheet is still weak.",
                "You should not build future promises on top of a fragile present balance sheet.",
            )
            safer_option = "Fund reserves and retirement first, then formalize the legacy bucket."
            priority_stack = ("Retirement accounts", "Children funds", "Core investments", "Cash reserve")
            confidence = "Medium"
        elif goal == "income":
            recommendation = "Real estate optimization"
            why = (
                "The stated goal is stronger recurring cash flow, not only abstract appreciation.",
                "Optimizing yield and reducing drag matters more than chasing another idea.",
            )
            risks = (
                "Income assets can still carry leverage, vacancy, or market-specific risk.",
                "Reaching for yield can quietly increase fragility.",
            )
            safer_option = "Blend income goals with a reserve and broad market core."
            priority_stack = ("Debt reduction", "Real estate optimization", "Core investments", "Cash reserve")
            confidence = "Medium"
        else:
            recommendation = "Investments"
            why = (
                "The family appears stable enough to direct the next dollar into long-term compounding.",
                "A disciplined investment program is the cleanest engine for long-term wealth growth.",
            )
            risks = (
                "Investing without enough reserves can turn drawdowns into behavioral mistakes.",
                "Concentration risk can undo otherwise good long-term decisions.",
            )
            safer_option = "Use a balanced core mix and keep a visible reserve target."
            priority_stack = ("Retirement accounts", "Core investments", "Cash reserve", "Children funds")
            confidence = "Medium-High"

        result = AllocationRecommendation(
            recommendation=recommendation,
            why=why,
            risks=risks,
            safer_option=safer_option,
            who_its_for=wealth_for.replace("-", " ").title(),
            confidence=confidence,
            next_priority_stack=priority_stack,
        )
        return {
            "recommendation": result.recommendation,
            "why": list(result.why),
            "risks": list(result.risks),
            "safer_option": result.safer_option,
            "who_its_for": result.who_its_for,
            "confidence": result.confidence,
            "next_priority_stack": list(result.next_priority_stack),
        }
