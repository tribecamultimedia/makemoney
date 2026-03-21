from __future__ import annotations


class TaxEducationService:
    """Educational service for tax-aware framing only. Not professional advice."""

    version = "v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "tax_education",
            "status": "active",
            "purpose": "Educational tax-wrapper and real-estate tax framing service.",
        }

    @staticmethod
    def depreciation_note(*, purchase_price: float) -> str:
        building_basis = purchase_price * 0.8
        annual_estimate = building_basis / 27.5
        return (
            "Educational only: rental property owners in many cases can deduct building depreciation over time. "
            f"A very rough straight-line illustration on an 80% building basis would be about ${annual_estimate:,.0f} per year. "
            "Real tax treatment depends on jurisdiction, basis allocation, use, income, and your personal situation."
        )
