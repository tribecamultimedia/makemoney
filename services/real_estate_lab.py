from __future__ import annotations

from dataclasses import asdict

from domain.real_estate import RealEstateAnalysis, RealEstateScenario
from .tax_education import TaxEducationService


class RealEstateLab:
    """Educational real-estate analysis service."""

    version = "v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "real_estate_lab",
            "status": "active",
            "purpose": "Educational calculator-style real estate scenario service.",
        }

    @staticmethod
    def _monthly_mortgage_payment(principal: float, annual_rate_pct: float, years: int = 30) -> float:
        monthly_rate = annual_rate_pct / 100.0 / 12.0
        periods = years * 12
        if principal <= 0:
            return 0.0
        if monthly_rate <= 0:
            return principal / periods
        return principal * (monthly_rate * (1 + monthly_rate) ** periods) / (((1 + monthly_rate) ** periods) - 1)

    def analyze(
        self,
        *,
        purchase_price: float,
        down_payment_pct: float,
        monthly_rent: float,
        rate_pct: float,
        monthly_expenses: float,
        expected_appreciation_pct: float,
        holding_period_years: int,
    ) -> dict[str, object]:
        request = RealEstateScenario(
            purchase_price=purchase_price,
            down_payment_pct=down_payment_pct,
            monthly_rent=monthly_rent,
            rate_pct=rate_pct,
            monthly_expenses=monthly_expenses,
            expected_appreciation_pct=expected_appreciation_pct,
            holding_period_years=holding_period_years,
        )
        down_payment = purchase_price * (down_payment_pct / 100.0)
        loan_amount = max(purchase_price - down_payment, 0.0)
        mortgage = self._monthly_mortgage_payment(loan_amount, rate_pct)
        monthly_cash_flow = monthly_rent - monthly_expenses - mortgage
        annual_noi = max((monthly_rent - monthly_expenses) * 12.0, 0.0)
        cap_rate_pct = 0.0 if purchase_price <= 0 else (annual_noi / purchase_price) * 100.0
        cash_invested = max(down_payment, 1.0)
        annual_cash_flow = monthly_cash_flow * 12.0
        cash_on_cash_pct = (annual_cash_flow / cash_invested) * 100.0
        stressed_rent = monthly_rent * 0.9
        stressed_expenses = monthly_expenses * 1.1
        downside_cash_flow = stressed_rent - stressed_expenses - mortgage
        estimated_sale_value = purchase_price * ((1 + expected_appreciation_pct / 100.0) ** holding_period_years)
        estimated_equity_gain = max(estimated_sale_value - purchase_price, 0.0)
        summary = (
            f"At these assumptions, the property would generate about ${monthly_cash_flow:,.0f} per month in simple cash flow "
            f"with a cap rate near {cap_rate_pct:.1f}%."
        )
        downside_summary = (
            f"If rent comes in softer and costs run hotter, monthly cash flow could fall to about ${downside_cash_flow:,.0f}. "
            "That is the version to respect before falling in love with the optimistic case."
        )
        tax_note = TaxEducationService().depreciation_note(purchase_price=purchase_price)
        result = RealEstateAnalysis(
            monthly_cash_flow=round(monthly_cash_flow, 2),
            cap_rate_pct=round(cap_rate_pct, 2),
            cash_on_cash_pct=round(cash_on_cash_pct, 2),
            downside_cash_flow=round(downside_cash_flow, 2),
            estimated_equity_gain=round(estimated_equity_gain, 2),
            summary=summary,
            downside_summary=downside_summary,
            tax_note=tax_note,
        )
        payload = asdict(result)
        payload["request"] = asdict(request)
        return payload
