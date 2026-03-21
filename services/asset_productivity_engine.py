from __future__ import annotations

from dataclasses import asdict

from domain.balance_sheet import AssetProductivityItem, AssetProductivityReport


class AssetProductivityEngine:
    """Starter productivity framing for family wealth buckets."""

    def build_report(self, profile: dict[str, str], balance_sheet: dict[str, object]) -> dict[str, object]:
        inputs = dict(balance_sheet.get("inputs", {})) if isinstance(balance_sheet, dict) else {}
        items: list[AssetProductivityItem] = []

        liquid_assets = float(inputs.get("liquid_assets", 0.0) or 0.0)
        investments = float(inputs.get("investments", 0.0) or 0.0)
        real_estate = float(inputs.get("real_estate", 0.0) or 0.0)
        business_assets = float(inputs.get("business_assets", 0.0) or 0.0)

        if liquid_assets > 0:
            items.append(
                AssetProductivityItem(
                    asset_class="Liquid assets",
                    estimated_return_profile="Low",
                    cash_flow_profile="Low",
                    liquidity_profile="High",
                    risk_profile="Low",
                    recommendation="Keep" if profile.get("liquidity_priority") in {"High", "Moderate"} else "Optimize",
                    reason="Cash is productive when it prevents forced selling and protects the family operating base.",
                )
            )
        if investments > 0:
            items.append(
                AssetProductivityItem(
                    asset_class="Investments",
                    estimated_return_profile="Medium to high",
                    cash_flow_profile="Low to medium",
                    liquidity_profile="Medium to high",
                    risk_profile=profile.get("risk_level", "Balanced"),
                    recommendation="Keep",
                    reason="A diversified investment base is usually the cleanest long-term compounding engine.",
                )
            )
        if real_estate > 0:
            items.append(
                AssetProductivityItem(
                    asset_class="Real estate",
                    estimated_return_profile="Medium",
                    cash_flow_profile="Medium",
                    liquidity_profile="Low",
                    risk_profile="Medium",
                    recommendation="Review",
                    reason="Property can be productive, but only if yield, leverage, and flexibility justify the capital tied up.",
                )
            )
        if business_assets > 0:
            items.append(
                AssetProductivityItem(
                    asset_class="Business assets",
                    estimated_return_profile="Variable",
                    cash_flow_profile="Variable",
                    liquidity_profile="Low",
                    risk_profile="High",
                    recommendation="Review",
                    reason="Private assets should be treated as concentrated risk until proven consistently productive.",
                )
            )

        if not items:
            items.append(
                AssetProductivityItem(
                    asset_class="No funded asset bucket yet",
                    estimated_return_profile="Unknown",
                    cash_flow_profile="Unknown",
                    liquidity_profile="Unknown",
                    risk_profile="Unknown",
                    recommendation="Build",
                    reason="TELAJ needs actual funded assets before it can judge what is productive versus decorative.",
                )
            )

        if any(item.recommendation == "Review" for item in items):
            posture = "Some assets need a productivity review before the next dollar is deployed."
        elif any(item.recommendation == "Optimize" for item in items):
            posture = "The family balance sheet is stable, but some capital may still be too idle."
        else:
            posture = "Most funded assets are serving a clear role in the plan."

        summary = "TELAJ should classify assets by what they do for the family: growth, cash flow, resilience, or drag."
        report = AssetProductivityReport(posture=posture, items=tuple(items), summary=summary)
        return {
            "posture": report.posture,
            "summary": report.summary,
            "items": [asdict(item) for item in report.items],
        }
