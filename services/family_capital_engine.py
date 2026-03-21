from __future__ import annotations

from domain.family_capital import FamilyCapitalCard, FamilyCapitalDashboard


class FamilyCapitalEngine:
    """Reusable summary layer for the TELAJ family operating view."""

    version = "v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "family_capital_engine",
            "status": "active",
            "purpose": "Builds the family capital dashboard summary for Streamlit and future TELAJ APIs.",
        }

    def build_dashboard(
        self,
        *,
        profile: dict[str, object],
        summary: dict[str, object],
        liability: dict[str, object],
        productivity: dict[str, object],
        allocation: dict[str, object],
        legacy: dict[str, object],
        real_estate: dict[str, object],
        balance_inputs: dict[str, object],
    ) -> FamilyCapitalDashboard:
        monthly_income = float(balance_inputs.get("monthly_household_income", 0.0))
        monthly_expenses = float(balance_inputs.get("monthly_household_expenses", 0.0))
        monthly_liabilities = float(liability.get("monthly_burden", 0.0))
        free_cash_flow = monthly_income - monthly_expenses - monthly_liabilities
        reserve_gap = float(legacy.get("reserve_gap", 0.0))
        children_gap = float(legacy.get("children_target_gap", 0.0))
        property_summary = real_estate.get("summary", {})

        cards = (
            FamilyCapitalCard(
                title="Next dollar",
                value=str(allocation.get("recommendation", "Not ready")),
                detail=f"Confidence: {allocation.get('confidence', 'N/A')}",
                target_section="Allocation",
            ),
            FamilyCapitalCard(
                title="Liability pressure",
                value=str(liability.get("pressure_level", "Unknown")),
                detail=f"Burden / income: {float(liability.get('burden_to_income_pct', 0.0)):.1f}%",
                target_section="Balance Sheet",
            ),
            FamilyCapitalCard(
                title="Property posture",
                value=str(property_summary.get("posture", "No property registry yet.")),
                detail=f"Properties: {len(real_estate.get('properties', []))}",
                target_section="Real Estate",
            ),
            FamilyCapitalCard(
                title="Household runway",
                value=f"${free_cash_flow:,.0f} / month",
                detail=f"Income ${monthly_income:,.0f} | Expenses ${monthly_expenses:,.0f} | Liabilities ${monthly_liabilities:,.0f}",
                target_section="Scenario Lab",
            ),
            FamilyCapitalCard(
                title="Asset productivity",
                value=str(productivity.get("posture", "No productivity read yet.")),
                detail=str(productivity.get("summary", "Add more of the balance sheet to improve this read.")),
                target_section="Portfolio",
            ),
            FamilyCapitalCard(
                title="Legacy gap",
                value=f"${children_gap:,.0f}" if children_gap > 0 else "No immediate legacy gap detected.",
                detail=f"Reserve gap ${reserve_gap:,.0f}",
                target_section="Balance Sheet",
            ),
        )

        focus = tuple(
            item
            for item in (
                allocation.get("safer_option"),
                liability.get("recommendation"),
                legacy.get("recommendation"),
            )
            if isinstance(item, str) and item
        )

        return FamilyCapitalDashboard(
            title="Family Capital Dashboard",
            subtitle=(
                f"Net worth ${float(summary.get('net_worth', 0.0)):,.0f} | "
                f"{str(profile.get('archetype', 'TELAJ household'))}"
            ),
            cards=cards,
            focus=focus,
        )
