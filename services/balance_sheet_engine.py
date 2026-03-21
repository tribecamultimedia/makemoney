from __future__ import annotations

from dataclasses import asdict

from domain.balance_sheet import BalanceSheetBucket, BalanceSheetInputs, BalanceSheetSummary


class BalanceSheetEngine:
    """Starter family balance-sheet and productivity framing for TELAJ."""

    @staticmethod
    def default_inputs() -> dict[str, float]:
        return {
            "liquid_assets": 0.0,
            "investments": 0.0,
            "real_estate": 0.0,
            "business_assets": 0.0,
            "liabilities": 0.0,
            "monthly_liability_payment": 0.0,
            "average_interest_rate_pct": 0.0,
            "monthly_household_income": 0.0,
            "monthly_household_expenses": 0.0,
        }

    def normalize_inputs(self, raw: dict[str, object] | None) -> dict[str, float]:
        defaults = self.default_inputs()
        if raw is None:
            return defaults
        normalized = defaults.copy()
        for key in defaults:
            try:
                normalized[key] = float(raw.get(key, defaults[key]))  # type: ignore[arg-type]
            except Exception:
                normalized[key] = defaults[key]
        return normalized

    def build_summary(self, profile: dict[str, str], raw_inputs: dict[str, object] | None = None) -> dict[str, object]:
        normalized_inputs = self.normalize_inputs(raw_inputs)
        inputs = BalanceSheetInputs(**normalized_inputs)
        owned_assets = profile.get("owned_assets", "")
        liabilities = profile.get("liabilities", "")
        liquidity_profile = profile.get("liquidity_profile", "")
        goal = profile.get("primary_goal", "growth")
        wealth_for = profile.get("wealth_for", "me")

        liquid_assets = BalanceSheetBucket(
            label="Liquid assets",
            posture=liquidity_profile or "Not yet assessed",
            recommendation="Increase reserves first." if liquidity_profile in {"Very little is liquid", "A smaller share is liquid"} else "Maintain disciplined liquidity.",
        )
        investments = BalanceSheetBucket(
            label="Investments",
            posture="Active exposure already exists." if profile.get("invested_assets") not in {"None yet", ""} else "Investment base is still early.",
            recommendation="Keep compounding core positions." if goal in {"growth", "legacy"} else "Prefer steadier exposure.",
        )
        real_estate = BalanceSheetBucket(
            label="Real estate",
            posture="Property already matters in the balance sheet." if "real estate" in owned_assets.lower() or "property" in owned_assets.lower() or "mix" in owned_assets.lower() else "Not a core driver yet.",
            recommendation="Review yield, debt load, and flexibility.",
        )
        business_assets = BalanceSheetBucket(
            label="Business assets",
            posture="Private asset exposure exists." if "business" in owned_assets.lower() else "No clear business concentration.",
            recommendation="Keep private assets reviewed, not assumed productive.",
        )
        liability_bucket = BalanceSheetBucket(
            label="Liabilities",
            posture=(liabilities or "No meaningful debt") + (f" | ${inputs.liabilities:,.0f}" if inputs.liabilities > 0 else ""),
            recommendation="Pay down drag first." if liabilities in {"Consumer or credit card debt", "A heavy mix of liabilities"} else "Keep liabilities efficient and intentional.",
        )

        total_assets = inputs.liquid_assets + inputs.investments + inputs.real_estate + inputs.business_assets
        total_liabilities = inputs.liabilities
        net_worth = total_assets - total_liabilities

        if liabilities in {"Consumer or credit card debt", "A heavy mix of liabilities"}:
            net_worth_posture = "Balance sheet is carrying too much pressure on the liability side."
        elif liquidity_profile in {"Very little is liquid", "A smaller share is liquid"}:
            net_worth_posture = "The family may be asset-rich but not liquid enough."
        elif "mix" in owned_assets.lower():
            net_worth_posture = "The family base is diversified enough to optimize, not just accumulate."
        else:
            net_worth_posture = "The family base is still being built and should stay simple."

        productivity_summary = (
            "TELAJ should treat every asset as either helping cash flow, growth, resilience, or none of the above."
        )
        liability_summary = (
            "Liabilities must be ranked by how much they block compounding, not only by how normal they feel."
        )
        legacy_summary = (
            "Legacy planning is already relevant here."
            if wealth_for in {"children", "multi-generational"}
            else "Legacy can stay simple for now, but the system should still name who the wealth is for."
        )

        summary = BalanceSheetSummary(
            liquid_assets=liquid_assets,
            investments=investments,
            real_estate=real_estate,
            business_assets=business_assets,
            liabilities=liability_bucket,
            total_assets=total_assets,
            total_liabilities=total_liabilities,
            net_worth=net_worth,
            net_worth_posture=net_worth_posture,
            productivity_summary=productivity_summary,
            liability_summary=liability_summary,
            legacy_summary=legacy_summary,
        )
        return {
            "liquid_assets": asdict(summary.liquid_assets),
            "investments": asdict(summary.investments),
            "real_estate": asdict(summary.real_estate),
            "business_assets": asdict(summary.business_assets),
            "liabilities": asdict(summary.liabilities),
            "inputs": asdict(inputs),
            "total_assets": summary.total_assets,
            "total_liabilities": summary.total_liabilities,
            "net_worth": summary.net_worth,
            "net_worth_posture": summary.net_worth_posture,
            "productivity_summary": summary.productivity_summary,
            "liability_summary": summary.liability_summary,
            "legacy_summary": summary.legacy_summary,
        }
