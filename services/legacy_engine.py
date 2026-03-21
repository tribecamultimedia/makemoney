from __future__ import annotations

from dataclasses import asdict

from domain.legacy import LegacyPlanInputs, LegacyPlanSummary


class LegacyEngine:
    """Starter long-duration family capital planning engine for TELAJ."""

    @staticmethod
    def default_inputs() -> dict[str, object]:
        return {
            "children_fund_target": 0.0,
            "long_term_reserve_months": 12,
            "annual_family_contribution": 0.0,
            "wealth_transfer_priority": "balanced",
        }

    def normalize_inputs(self, raw: dict[str, object] | None) -> dict[str, object]:
        defaults = self.default_inputs()
        if raw is None:
            return defaults
        normalized = defaults.copy()
        for key, default in defaults.items():
            if isinstance(default, (int, float)):
                try:
                    normalized[key] = type(default)(raw.get(key, default))  # type: ignore[call-arg]
                except Exception:
                    normalized[key] = default
            else:
                normalized[key] = str(raw.get(key, default))
        return normalized

    def build_plan(
        self,
        *,
        profile: dict[str, str],
        balance_sheet_inputs: dict[str, object],
        raw_inputs: dict[str, object] | None = None,
    ) -> dict[str, object]:
        normalized = self.normalize_inputs(raw_inputs)
        inputs = LegacyPlanInputs(
            children_fund_target=float(normalized["children_fund_target"]),
            long_term_reserve_months=int(normalized["long_term_reserve_months"]),
            annual_family_contribution=float(normalized["annual_family_contribution"]),
            wealth_transfer_priority=str(normalized["wealth_transfer_priority"]),
        )

        liquid_assets = float(balance_sheet_inputs.get("liquid_assets", 0.0) or 0.0)
        monthly_expenses = float(balance_sheet_inputs.get("monthly_household_expenses", 0.0) or 0.0)
        monthly_liability_payment = float(balance_sheet_inputs.get("monthly_liability_payment", 0.0) or 0.0)
        reserve_target = (monthly_expenses + monthly_liability_payment) * inputs.long_term_reserve_months
        reserve_gap = max(reserve_target - liquid_assets, 0.0)
        children_target_gap = max(inputs.children_fund_target - max(liquid_assets - reserve_gap, 0.0), 0.0)

        wealth_for = profile.get("wealth_for", "me")
        goal = profile.get("primary_goal", "growth")
        if wealth_for in {"children", "multi-generational"} or goal == "legacy":
            posture = "Legacy planning is already a core job of this balance sheet."
        else:
            posture = "Legacy planning should stay visible even if the household is still building its first durable base."

        if reserve_gap > 0:
            recommendation = "Build the long-term reserve first, then formalize the legacy bucket."
            why = (
                "Legacy capital is stronger when it is built on top of resilience rather than hope.",
                "Families should not fund tomorrow's promises by weakening today's stability.",
            )
            risks = (
                "Trying to accelerate legacy funding without a reserve can force withdrawals at the wrong moment.",
                "A symbolic legacy bucket is not the same as a durable family capital plan.",
            )
            safer_option = "Separate emergency reserves from true long-duration legacy capital."
            confidence = "High"
        elif children_target_gap > 0:
            recommendation = "Start a dedicated children or legacy fund with automatic annual contributions."
            why = (
                "The operating base is stable enough to begin ring-fencing future family capital.",
                "A dedicated long-duration bucket prevents legacy goals from being diluted by short-term noise.",
            )
            risks = (
                "Legacy buckets still need a simple asset mix and contribution discipline.",
                "Do not overfund long-duration goals if near-term liabilities remain fragile.",
            )
            safer_option = "Start smaller, automate the contribution, and review annually instead of overcommitting on day one."
            confidence = "Medium-High"
        else:
            recommendation = "Maintain and grow the family legacy bucket with discipline."
            why = (
                "The family already has the ingredients for a credible long-duration capital plan.",
                "The next task is consistency, not reinvention.",
            )
            risks = (
                "Legacy capital can drift into too much conservatism or too much concentration if it is left unmanaged.",
                "Families often forget to revisit the purpose of the money as life changes.",
            )
            safer_option = "Review the family mandate yearly and keep the reserve separate from the legacy pool."
            confidence = "Medium"

        result = LegacyPlanSummary(
            posture=posture,
            reserve_target=round(reserve_target, 2),
            reserve_gap=round(reserve_gap, 2),
            children_target_gap=round(children_target_gap, 2),
            recommendation=recommendation,
            why=why,
            risks=risks,
            safer_option=safer_option,
            confidence=confidence,
        )
        payload = asdict(result)
        payload["inputs"] = asdict(inputs)
        return payload
