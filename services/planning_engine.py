from __future__ import annotations

from dataclasses import asdict

import pandas as pd

from domain.planning import AllocationItem, MoneyGeniePlan, PlannerComparisonRow, PlanningRequest


class PlanningEngine:
    """Business logic for beginner-friendly planning flows.

    Streamlit should call this service rather than embedding rules directly in the UI.
    """

    def build_investment_comparison(self, history: pd.DataFrame, amount: float) -> pd.DataFrame:
        trailing = history.dropna().tail(252)
        if trailing.empty:
            return pd.DataFrame(columns=["Asset", "Value Today", "Return %"])

        rows: list[PlannerComparisonRow] = []
        for label in trailing.columns:
            start = float(trailing[label].iloc[0])
            end = float(trailing[label].iloc[-1])
            value_today = 0.0 if start <= 0 else amount * (end / start)
            rows.append(
                PlannerComparisonRow(
                    asset=label,
                    value_today=round(value_today, 2),
                    return_pct=round(((value_today / amount) - 1.0) * 100.0 if amount > 0 else 0.0, 1),
                )
            )

        frame = pd.DataFrame(
            [
                {
                    "Asset": row.asset,
                    "Value Today": row.value_today,
                    "Return %": row.return_pct,
                }
                for row in rows
            ]
        )
        return frame.sort_values("Value Today", ascending=False).reset_index(drop=True)

    @staticmethod
    def normalize_risk_profile(raw: str) -> str:
        value = str(raw).strip().lower()
        if value in {"very low", "low", "safe", "conservative"}:
            return "Safe"
        if value in {"growth", "aggressive", "high"}:
            return "Aggressive"
        return "Balanced"

    def build_money_genie_plan(
        self,
        *,
        amount: float,
        horizon_years: int,
        risk_profile: str,
        account_type: str,
        board: pd.DataFrame,
    ) -> dict[str, object]:
        request = PlanningRequest(
            amount=amount,
            horizon_years=horizon_years,
            risk_profile=self.normalize_risk_profile(risk_profile),
            account_type=account_type,
        )
        top_buy = board[board["action"] == "BUY"].iloc[0]["ticker"] if not board.empty and (board["action"] == "BUY").any() else None

        if request.risk_profile == "Safe":
            plan_name = "Safe Starter Mix"
            allocation = [
                AllocationItem("Treasury bonds", 40),
                AllocationItem("Cash / T-Bills", 25),
                AllocationItem("US stocks ETF", 20),
                AllocationItem("Real estate ETF", 10),
                AllocationItem("Gold", 5),
            ]
            reasons = (
                "This mix protects flexibility by keeping a larger share in bonds and cash-like assets.",
                "It still keeps some equity exposure so the money has a chance to grow instead of sitting completely idle.",
            )
            key_risks = (
                "Growth may feel slow if markets rally hard.",
                "Too much caution can hurt long-term compounding if the money is not needed soon.",
            )
        elif request.risk_profile == "Aggressive":
            plan_name = "Aggressive Growth Mix"
            allocation = [
                AllocationItem("US stocks ETF", 40),
                AllocationItem("Tech stocks ETF", 20),
                AllocationItem("Real estate ETF", 10),
                AllocationItem("Treasury bonds", 15),
                AllocationItem("Cash / T-Bills", 5),
                AllocationItem("Bitcoin", 10),
            ]
            reasons = (
                "This mix leans harder into growth assets because you are accepting more volatility.",
                "It keeps a small ballast in bonds and cash so every drawdown does not become a forced decision.",
            )
            key_risks = (
                "This mix can swing sharply in bad markets.",
                "Crypto and tech concentration can create emotionally difficult drawdowns.",
            )
        else:
            plan_name = "Balanced Core Mix"
            allocation = [
                AllocationItem("US stocks ETF", 35),
                AllocationItem("Treasury bonds", 25),
                AllocationItem("Tech stocks ETF", 10),
                AllocationItem("Real estate ETF", 10),
                AllocationItem("Cash / T-Bills", 15),
                AllocationItem("Gold", 5),
            ]
            reasons = (
                "This mix tries to grow while still giving the portfolio defensive ballast.",
                "It is usually the best first stop for someone who wants progress without maximum stress.",
            )
            key_risks = (
                "Balanced portfolios still lose money during broad market drawdowns.",
                "A moderate mix can feel too slow in strong bull markets and too risky in sharp selloffs.",
            )

        if request.horizon_years <= 3:
            adjusted: list[AllocationItem] = []
            for item in allocation:
                if item.label in {"Treasury bonds", "Cash / T-Bills"}:
                    adjusted.append(AllocationItem(item.label, item.weight + 5))
                elif item.label in {"Tech stocks ETF", "Bitcoin"}:
                    adjusted.append(AllocationItem(item.label, max(item.weight - 5, 0)))
                else:
                    adjusted.append(item)
            allocation = adjusted

        summary = (
            f"With about ${request.amount:,.0f}, the safest smart move is to spread your money instead of betting it all on one story. "
            f"{'Right now the board likes ' + str(top_buy) + ', but only as part of a mix.' if top_buy else 'Right now the board is not screaming for a big risk-on move.'}"
        )
        board_note = f"Best current board idea: {top_buy}" if top_buy else "The board is mostly cautious today."
        account_note = (
            "A Roth IRA usually makes sense for long-term tax-free growth if you qualify."
            if request.account_type == "Roth IRA"
            else "A 401(k) is often strongest when employer matching is available."
            if request.account_type == "401(k)"
            else "A normal taxable account gives flexibility, but taxes matter more."
            if request.account_type == "Taxable account"
            else "If you are not sure, start with the mix first and decide the account wrapper second."
        )
        suitable_time_horizon = (
            "Best for money needed within roughly 1 to 3 years."
            if request.risk_profile == "Safe"
            else "Best for money you can leave invested for at least 3 to 7 years."
            if request.risk_profile == "Balanced"
            else "Best for money you can leave invested for 7+ years and emotionally tolerate larger swings."
        )
        safer_alternative = (
            "If this still feels stressful, move more into Treasury bonds and Cash / T-Bills."
            if request.risk_profile == "Safe"
            else "If this feels too exposed, use the Safe Starter Mix instead."
            if request.risk_profile == "Balanced"
            else "If this feels too aggressive, step down to the Balanced Core Mix."
        )
        footer = f"Risk style: {request.risk_profile} | Time horizon: {request.horizon_years} years"
        plan = MoneyGeniePlan(
            plan_name=plan_name,
            allocation=tuple(allocation),
            summary=summary,
            reasons=reasons,
            key_risks=key_risks,
            suitable_time_horizon=suitable_time_horizon,
            safer_alternative=safer_alternative,
            footer=footer,
            account_note=account_note,
            board_note=board_note,
        )
        return {
            "request": asdict(request),
            "plan_name": plan.plan_name,
            "allocation": [asdict(item) for item in plan.allocation],
            "summary": plan.summary,
            "reasons": list(plan.reasons),
            "key_risks": list(plan.key_risks),
            "suitable_time_horizon": plan.suitable_time_horizon,
            "safer_alternative": plan.safer_alternative,
            "footer": plan.footer,
            "account_note": plan.account_note,
            "board_note": plan.board_note,
        }
