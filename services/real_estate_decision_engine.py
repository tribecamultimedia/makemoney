from __future__ import annotations

from dataclasses import asdict

from domain.real_estate import RealEstateDecision


class RealEstateDecisionEngine:
    """Turn property math into a TELAJ-style action framing."""

    def decide(self, analysis: dict[str, object]) -> dict[str, object]:
        monthly_cash_flow = float(analysis.get("monthly_cash_flow", 0.0) or 0.0)
        downside_cash_flow = float(analysis.get("downside_cash_flow", 0.0) or 0.0)
        cap_rate_pct = float(analysis.get("cap_rate_pct", 0.0) or 0.0)
        cash_on_cash_pct = float(analysis.get("cash_on_cash_pct", 0.0) or 0.0)
        request = dict(analysis.get("request", {}))
        rate_pct = float(request.get("rate_pct", 0.0) or 0.0)

        if monthly_cash_flow > 0 and downside_cash_flow > 0 and cash_on_cash_pct >= 6:
            decision = "Keep"
            why = (
                "The property is producing positive cash flow even under a simple stress case.",
                "The return on cash invested is strong enough to justify keeping capital here for now.",
            )
            risks = (
                "Real estate is still illiquid and operationally messy compared with broad market funds.",
                "Local market weakness or vacancy can change the picture faster than spreadsheet optimism suggests.",
            )
            safer_option = "Keep it, but review refinancing or reserve levels before expanding."
            confidence = "Medium-High"
        elif monthly_cash_flow > 0 and (rate_pct >= 6.0 or cash_on_cash_pct < 5):
            decision = "Refinance"
            why = (
                "The property works, but financing may be eating too much of the return.",
                "Improving the debt structure could make the same asset more productive without selling it.",
            )
            risks = (
                "Refinancing does not help if the property itself has weak economics.",
                "Transaction costs and availability of better terms still matter.",
            )
            safer_option = "Keep the property and improve reserves if refinancing terms are not clearly better."
            confidence = "Medium"
        elif monthly_cash_flow <= 0 and downside_cash_flow < 0:
            decision = "Sell"
            why = (
                "The property is not paying its way in either the base case or the stress case.",
                "Capital trapped in a weak property can block stronger family priorities.",
            )
            risks = (
                "Selling too quickly can realize a temporary weakness instead of a structural problem.",
                "Tax and transaction costs must still be considered before acting.",
            )
            safer_option = "If selling is premature, reduce the drag through rent, cost, or financing improvements."
            confidence = "Medium-High"
        else:
            decision = "Improve"
            why = (
                "The property is not clearly broken, but it is not clearly optimized either.",
                "Operational changes may improve yield more safely than a rushed exit or expansion.",
            )
            risks = (
                "Improvements can consume capital without fixing the core problem.",
                "A weak market can still overpower better operations.",
            )
            safer_option = "Keep exposure stable and demand a clearer margin of safety before adding more capital."
            confidence = "Medium"

        result = RealEstateDecision(
            decision=decision,
            why=why,
            risks=risks,
            safer_option=safer_option,
            confidence=confidence,
        )
        return asdict(result)
