from __future__ import annotations

from dataclasses import asdict

from domain.balance_sheet import BalanceSheetInputs, LiabilityPressureResult


class LiabilityPressureEngine:
    """Starter liability pressure engine for TELAJ."""

    def evaluate(self, profile: dict[str, str], raw_inputs: dict[str, object] | None = None) -> dict[str, object]:
        values = {
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
        if raw_inputs:
            for key in values:
                try:
                    values[key] = float(raw_inputs.get(key, values[key]))  # type: ignore[arg-type]
                except Exception:
                    values[key] = 0.0

        inputs = BalanceSheetInputs(**values)
        liquid_plus_invested = max(inputs.liquid_assets + inputs.investments, 1.0)
        liability_ratio = inputs.liabilities / liquid_plus_invested
        payment_ratio = inputs.monthly_liability_payment / max(inputs.liquid_assets / 12.0, 1.0)
        interest_rate = inputs.average_interest_rate_pct
        burden_to_income_pct = (
            0.0
            if inputs.monthly_household_income <= 0
            else (inputs.monthly_liability_payment / inputs.monthly_household_income) * 100.0
        )
        free_cash_flow_after_liabilities = inputs.monthly_household_income - inputs.monthly_household_expenses - inputs.monthly_liability_payment

        if inputs.liabilities <= 0:
            pressure_level = "Low"
            urgency = "Low"
            impact_on_growth = "Liabilities are not the main brake on compounding right now."
            recommendation = "Keep liabilities efficient, but focus on reserves and long-term assets."
            confidence = "Medium"
        elif liability_ratio > 1.0 or interest_rate >= 10 or burden_to_income_pct >= 25 or free_cash_flow_after_liabilities < 0 or profile.get("liabilities") in {"Consumer or credit card debt", "A heavy mix of liabilities"}:
            pressure_level = "High"
            urgency = "Act now"
            impact_on_growth = "Debt is likely absorbing too much future capital that should be compounding elsewhere."
            recommendation = "Prioritize the highest-cost liability and reduce the monthly drag before chasing more risk assets."
            confidence = "High"
        elif liability_ratio > 0.5 or interest_rate >= 6 or payment_ratio > 1.0 or burden_to_income_pct >= 12:
            pressure_level = "Moderate"
            urgency = "Review soon"
            impact_on_growth = "Liabilities are not catastrophic, but they are strong enough to weaken the family's growth rate."
            recommendation = "Rank liabilities by cost and flexibility, then decide whether partial payoff beats the next investment."
            confidence = "Medium-High"
        else:
            pressure_level = "Controlled"
            urgency = "Monitor"
            impact_on_growth = "Liabilities are present, but they do not yet dominate the balance sheet."
            recommendation = "Keep debt efficient and avoid turning a manageable burden into a silent long-term drag."
            confidence = "Medium"

        result = LiabilityPressureResult(
            pressure_level=pressure_level,
            urgency=urgency,
            monthly_burden=inputs.monthly_liability_payment,
            interest_rate_pct=interest_rate,
            burden_to_income_pct=burden_to_income_pct,
            free_cash_flow_after_liabilities=free_cash_flow_after_liabilities,
            impact_on_growth=impact_on_growth,
            recommendation=recommendation,
            confidence=confidence,
        )
        return asdict(result)
