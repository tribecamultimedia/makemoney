from __future__ import annotations

from dataclasses import asdict

from domain.user_profiles import FamilyProfile


class OnboardingEngine:
    """Derive a reusable TELAJ family profile from the onboarding interview."""

    def build_family_profile(self, answers: dict[str, str]) -> dict[str, str]:
        goal = answers.get("primary_goal", "growth")
        wealth_for = answers.get("wealth_for", "me")
        drawdown = answers.get("drawdown_response", "Wait and watch")
        liquidity = answers.get("liquidity_profile", "I am not sure")

        if goal == "legacy" or wealth_for == "multi-generational":
            archetype = "Legacy Builder"
        elif goal == "safety":
            archetype = "Foundation Protector"
        elif drawdown == "Buy more" and goal == "growth":
            archetype = "Compounding Builder"
        else:
            archetype = "Steady Family Builder"

        if drawdown in {"Sell quickly", "I do not know"}:
            risk_level = "Cautious"
        elif drawdown == "Buy more":
            risk_level = "Assertive"
        else:
            risk_level = "Balanced"

        if liquidity in {"Very little is liquid", "A smaller share is liquid"}:
            liquidity_priority = "High"
        elif liquidity == "About half is liquid":
            liquidity_priority = "Moderate"
        else:
            liquidity_priority = "Normal"

        legacy_priority = (
            "High"
            if wealth_for in {"children", "multi-generational"} or goal == "legacy"
            else "Moderate"
            if wealth_for == "spouse"
            else "Low"
        )

        if goal == "safety":
            operating_posture = "Protect and organize first."
        elif goal == "income":
            operating_posture = "Strengthen cash flow and reduce drag."
        elif goal == "legacy":
            operating_posture = "Build durable family capital."
        else:
            operating_posture = "Compound steadily without losing discipline."

        profile = FamilyProfile(
            owned_assets=answers.get("owned_assets", ""),
            liabilities=answers.get("liabilities", ""),
            liquidity_profile=liquidity,
            primary_goal=goal,
            wealth_for=wealth_for,
            drawdown_response=drawdown,
            invested_assets=answers.get("invested_assets", ""),
            archetype=archetype,
            risk_level=risk_level,
            liquidity_priority=liquidity_priority,
            legacy_priority=legacy_priority,
            operating_posture=operating_posture,
        )
        return asdict(profile)
