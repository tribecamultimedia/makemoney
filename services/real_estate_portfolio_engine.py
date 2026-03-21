from __future__ import annotations

from dataclasses import asdict

from domain.real_estate import PropertyRecord, RealEstatePortfolioSummary
from .real_estate_decision_engine import RealEstateDecisionEngine
from .real_estate_lab import RealEstateLab


class RealEstatePortfolioEngine:
    """Persistent property registry and aggregate portfolio view for TELAJ."""

    def build_portfolio(self, registry: list[dict[str, object]]) -> dict[str, object]:
        properties: list[dict[str, object]] = []
        total_property_value = 0.0
        total_mortgage_balance = 0.0
        total_monthly_cash_flow = 0.0
        weighted_rate_numerator = 0.0

        lab = RealEstateLab()
        decision_engine = RealEstateDecisionEngine()

        for raw in registry:
            record = PropertyRecord(
                property_name=str(raw.get("property_name", "Property")),
                property_type=str(raw.get("property_type", "Residential")),
                estimated_value=float(raw.get("estimated_value", 0.0) or 0.0),
                mortgage_balance=float(raw.get("mortgage_balance", 0.0) or 0.0),
                monthly_rent=float(raw.get("monthly_rent", 0.0) or 0.0),
                monthly_expenses=float(raw.get("monthly_expenses", 0.0) or 0.0),
                interest_rate_pct=float(raw.get("interest_rate_pct", 0.0) or 0.0),
                occupancy_status=str(raw.get("occupancy_status", "occupied")),
            )
            if record.estimated_value <= 0:
                continue

            down_payment_pct = max(
                min(((record.estimated_value - record.mortgage_balance) / max(record.estimated_value, 1.0)) * 100.0, 100.0),
                0.0,
            )
            analysis = lab.analyze(
                purchase_price=record.estimated_value,
                down_payment_pct=down_payment_pct,
                monthly_rent=record.monthly_rent,
                rate_pct=record.interest_rate_pct,
                monthly_expenses=record.monthly_expenses,
                expected_appreciation_pct=3.0,
                holding_period_years=7,
            )
            decision = decision_engine.decide(analysis)
            equity = max(record.estimated_value - record.mortgage_balance, 0.0)
            total_property_value += record.estimated_value
            total_mortgage_balance += record.mortgage_balance
            total_monthly_cash_flow += float(analysis["monthly_cash_flow"])
            weighted_rate_numerator += record.interest_rate_pct * record.mortgage_balance

            property_payload = asdict(record)
            property_payload["equity"] = round(equity, 2)
            property_payload["analysis"] = analysis
            property_payload["decision"] = decision
            properties.append(property_payload)

        total_equity = max(total_property_value - total_mortgage_balance, 0.0)
        average_interest_rate_pct = (
            0.0
            if total_mortgage_balance <= 0
            else weighted_rate_numerator / total_mortgage_balance
        )

        if not properties:
            posture = "No property registry yet."
        elif total_monthly_cash_flow < 0:
            posture = "The property portfolio is consuming cash and needs a sharper decision standard."
        elif average_interest_rate_pct > 6.5:
            posture = "The property portfolio is productive, but financing still looks heavy."
        else:
            posture = "The property portfolio is contributing to family capital rather than only consuming attention."

        summary = RealEstatePortfolioSummary(
            total_property_value=round(total_property_value, 2),
            total_mortgage_balance=round(total_mortgage_balance, 2),
            total_equity=round(total_equity, 2),
            total_monthly_cash_flow=round(total_monthly_cash_flow, 2),
            average_interest_rate_pct=round(average_interest_rate_pct, 2),
            posture=posture,
        )
        return {
            "summary": asdict(summary),
            "properties": properties,
        }
