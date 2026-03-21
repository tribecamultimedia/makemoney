from __future__ import annotations

from dataclasses import asdict

from domain.scenarios import HouseholdScenarioResult, ScenarioShockResult, WealthMapState


class ScenarioEngine:
    """Educational scenario and stress-test service."""

    version = "v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "scenario_engine",
            "status": "active",
            "purpose": "Educational scenario and shock analysis service.",
        }

    @staticmethod
    def default_wealth_map() -> WealthMapState:
        return WealthMapState(
            cash_pct=15.0,
            stocks_pct=45.0,
            bonds_pct=25.0,
            crypto_pct=5.0,
            real_estate_pct=10.0,
            diversification_score=72,
            risk_score=46,
            status="balanced",
            notes=("using starter balanced assumptions",),
        )

    def wealth_map_from_snapshot(self, snapshot: dict[str, object] | None) -> WealthMapState:
        if not snapshot:
            return self.default_wealth_map()
        equity = float(snapshot.get("equity", 0.0))
        cash = float(snapshot.get("cash", 0.0))
        if equity <= 0:
            return self.default_wealth_map()
        positions = list(snapshot.get("positions", []))
        stocks = 0.0
        bonds = 0.0
        crypto = 0.0
        real_estate = 0.0
        for row in positions:
            symbol = str(row.get("symbol", "")).upper()
            market_value = abs(float(row.get("market_value", 0.0)))
            if symbol in {"TLT", "IEF", "LQD", "HYG", "SGOV"}:
                bonds += market_value
            elif symbol in {"VNQ"}:
                real_estate += market_value
            elif symbol.endswith("-USD") or symbol in {"BTC", "ETH", "SOL"}:
                crypto += market_value
            else:
                stocks += market_value
        cash_pct = (cash / equity) * 100.0
        weights = [stocks, bonds, crypto, real_estate, cash]
        non_zero = len([value for value in weights if value > 0.01])
        concentration = (max(weights) / max(sum(weights), 1e-9)) * 100.0
        diversification_score = max(20, min(100, int(non_zero * 18 + (100 - concentration) * 0.45)))
        risk_score = max(10, min(100, int((stocks + crypto * 1.5) / max(equity, 1e-9) * 100)))
        status = "concentrated" if concentration > 60 else "aggressive" if risk_score > 65 else "balanced" if risk_score > 30 else "defensive"
        return WealthMapState(
            cash_pct=round(cash_pct, 1),
            stocks_pct=round((stocks / equity) * 100.0, 1),
            bonds_pct=round((bonds / equity) * 100.0, 1),
            crypto_pct=round((crypto / equity) * 100.0, 1),
            real_estate_pct=round((real_estate / equity) * 100.0, 1),
            diversification_score=diversification_score,
            risk_score=risk_score,
            status=status,
            notes=("derived from current portfolio snapshot",),
        )

    def run_scenario(self, *, scenario_name: str, wealth_map: WealthMapState) -> dict[str, object]:
        shocks = {
            "rates_up": {
                "description": "Rates rise again and long-duration assets struggle.",
                "cash": 0.0,
                "stocks": -6.0,
                "bonds": -8.0,
                "crypto": -10.0,
                "real_estate": -5.0,
            },
            "recession": {
                "description": "Growth slows, earnings compress, and defensiveness matters.",
                "cash": 0.0,
                "stocks": -18.0,
                "bonds": 3.0,
                "crypto": -25.0,
                "real_estate": -9.0,
            },
            "inflation_spike": {
                "description": "Inflation re-accelerates and real purchasing power comes under pressure.",
                "cash": -2.0,
                "stocks": -8.0,
                "bonds": -10.0,
                "crypto": -12.0,
                "real_estate": -4.0,
            },
            "crypto_crash": {
                "description": "Crypto sells off hard and contagion hits risk appetite.",
                "cash": 0.0,
                "stocks": -4.0,
                "bonds": 1.0,
                "crypto": -45.0,
                "real_estate": -2.0,
            },
            "tech_selloff": {
                "description": "High-growth equities de-rate and momentum reverses sharply.",
                "cash": 0.0,
                "stocks": -12.0,
                "bonds": 2.0,
                "crypto": -18.0,
                "real_estate": -3.0,
            },
            "rental_vacancy": {
                "description": "Rental income weakens and property cash flow is stressed.",
                "cash": 0.0,
                "stocks": -1.0,
                "bonds": 0.0,
                "crypto": -3.0,
                "real_estate": -15.0,
            },
        }
        shock = shocks[scenario_name]
        portfolio_impact = (
            wealth_map.cash_pct * shock["cash"]
            + wealth_map.stocks_pct * shock["stocks"]
            + wealth_map.bonds_pct * shock["bonds"]
            + wealth_map.crypto_pct * shock["crypto"]
            + wealth_map.real_estate_pct * shock["real_estate"]
        ) / 100.0
        bucket_map = {
            "cash": shock["cash"],
            "stocks": shock["stocks"],
            "bonds": shock["bonds"],
            "crypto": shock["crypto"],
            "real_estate": shock["real_estate"],
        }
        worst_bucket = min(bucket_map, key=bucket_map.get)
        best_bucket = max(bucket_map, key=bucket_map.get)
        guidance = []
        if wealth_map.crypto_pct > 10 and shock["crypto"] < -20:
            guidance.append("crypto exposure is large enough that a crash would dominate the emotional experience")
        if wealth_map.cash_pct < 10:
            guidance.append("a slightly larger cash buffer would make this scenario easier to survive")
        if wealth_map.bonds_pct < 10 and scenario_name in {"recession", "tech_selloff"}:
            guidance.append("more defensive ballast could soften drawdowns")
        if not guidance:
            guidance.append("the current mix is not reckless, but the stress case shows where it would still hurt")
        narrative = (
            f"In plain English: this {scenario_name.replace('_', ' ')} scenario would likely move the portfolio by about "
            f"{portfolio_impact:.1f}%. The biggest drag would come from {worst_bucket.replace('_', ' ')}, while {best_bucket.replace('_', ' ')} "
            "would likely hold up best."
        )
        result = ScenarioShockResult(
            scenario_name=scenario_name,
            shock_description=shock["description"],
            portfolio_impact_pct=round(portfolio_impact, 1),
            cash_impact_pct=shock["cash"],
            stocks_impact_pct=shock["stocks"],
            bonds_impact_pct=shock["bonds"],
            crypto_impact_pct=shock["crypto"],
            real_estate_impact_pct=shock["real_estate"],
            worst_bucket=worst_bucket,
            best_bucket=best_bucket,
            guidance=tuple(guidance),
            narrative=narrative,
        )
        payload = asdict(result)
        payload["wealth_map"] = asdict(wealth_map)
        return payload

    def run_household_scenario(
        self,
        *,
        scenario_name: str,
        profile: dict[str, str],
        balance_sheet_inputs: dict[str, object],
    ) -> dict[str, object]:
        liquid_assets = float(balance_sheet_inputs.get("liquid_assets", 0.0) or 0.0)
        investments = float(balance_sheet_inputs.get("investments", 0.0) or 0.0)
        real_estate = float(balance_sheet_inputs.get("real_estate", 0.0) or 0.0)
        business_assets = float(balance_sheet_inputs.get("business_assets", 0.0) or 0.0)
        liabilities = float(balance_sheet_inputs.get("liabilities", 0.0) or 0.0)
        monthly_income = float(balance_sheet_inputs.get("monthly_household_income", 0.0) or 0.0)
        monthly_expenses = float(balance_sheet_inputs.get("monthly_household_expenses", 0.0) or 0.0)
        monthly_liability_payment = float(balance_sheet_inputs.get("monthly_liability_payment", 0.0) or 0.0)

        scenarios = {
            "income_drop": {
                "description": "Household income softens and monthly flexibility gets tighter.",
                "income_pct": -15.0,
                "expense_pct": 0.0,
                "liability_pct": 0.0,
                "asset_pct": 0.0,
            },
            "job_loss": {
                "description": "One income source disappears for a period and reserves become the operating engine.",
                "income_pct": -45.0,
                "expense_pct": -10.0,
                "liability_pct": 0.0,
                "asset_pct": -3.0,
            },
            "rate_spike": {
                "description": "Borrowing costs rise and debt becomes a heavier drag on the household.",
                "income_pct": 0.0,
                "expense_pct": 0.0,
                "liability_pct": 12.0,
                "asset_pct": -4.0,
            },
            "property_vacancy": {
                "description": "Property income weakens and the real-estate bucket stops helping the plan.",
                "income_pct": -12.0 if real_estate > 0 else -2.0,
                "expense_pct": 6.0,
                "liability_pct": 0.0,
                "asset_pct": -6.0 if real_estate > 0 else -1.0,
            },
            "market_drawdown": {
                "description": "Risk assets fall and the family must lean on liquidity and discipline.",
                "income_pct": 0.0,
                "expense_pct": 0.0,
                "liability_pct": 0.0,
                "asset_pct": -10.0,
            },
            "business_slowdown": {
                "description": "Private or business-related capital slows down and spillover hits family cash planning.",
                "income_pct": -20.0 if business_assets > 0 else -5.0,
                "expense_pct": 3.0,
                "liability_pct": 0.0,
                "asset_pct": -8.0 if business_assets > 0 else -2.0,
            },
        }
        shock = scenarios[scenario_name]

        monthly_income_change = monthly_income * (shock["income_pct"] / 100.0)
        monthly_expense_change = monthly_expenses * (shock["expense_pct"] / 100.0)
        monthly_liability_change = monthly_liability_payment * (shock["liability_pct"] / 100.0)

        total_assets = liquid_assets + investments + real_estate + business_assets
        net_worth = total_assets - liabilities
        net_worth_impact_pct = shock["asset_pct"]
        shocked_assets = total_assets * (1 + shock["asset_pct"] / 100.0)
        shocked_net_worth = shocked_assets - liabilities
        reserve_gap_months = 0.0
        shocked_free_cash_flow = (
            (monthly_income + monthly_income_change)
            - (monthly_expenses + monthly_expense_change)
            - (monthly_liability_payment + monthly_liability_change)
        )
        if shocked_free_cash_flow < 0:
            reserve_gap_months = abs(shocked_free_cash_flow)
            reserve_gap_months = reserve_gap_months / max(liquid_assets / 12.0, 1.0)

        pressure_points: list[str] = []
        if monthly_income + monthly_income_change < monthly_expenses + monthly_expense_change + monthly_liability_payment + monthly_liability_change:
            pressure_points.append("monthly cash flow turns negative")
        if liquid_assets < max(monthly_expenses + monthly_liability_payment, 1.0) * 3:
            pressure_points.append("liquid reserves look thin relative to household obligations")
        if real_estate > total_assets * 0.4 and scenario_name == "property_vacancy":
            pressure_points.append("property concentration makes vacancy unusually painful")
        if business_assets > total_assets * 0.35 and scenario_name == "business_slowdown":
            pressure_points.append("business concentration spills into family stability")
        if not pressure_points:
            pressure_points.append("the household remains functional, but the scenario still exposes what matters most")

        if scenario_name in {"job_loss", "income_drop"}:
            safer_move = "Increase liquid reserves and reduce fixed obligations before taking additional market risk."
        elif scenario_name == "rate_spike":
            safer_move = "Review debt structure and prioritize liabilities that reprice or carry the highest drag."
        elif scenario_name == "property_vacancy":
            safer_move = "Do not let property assumptions carry the whole family plan without reserve protection."
        elif scenario_name == "business_slowdown":
            safer_move = "Separate family operating reserves from business optimism."
        else:
            safer_move = "Balance long-term investing with a reserve level that lets the family stay disciplined."

        narrative = (
            f"In plain English: this {scenario_name.replace('_', ' ')} scenario would move monthly family flexibility by "
            f"${monthly_income_change - monthly_expense_change - monthly_liability_change:,.0f} and shift net worth by about {net_worth_impact_pct:.1f}%."
        )
        result = HouseholdScenarioResult(
            scenario_name=scenario_name,
            shock_description=shock["description"],
            monthly_income_change=round(monthly_income_change, 2),
            monthly_expense_change=round(monthly_expense_change, 2),
            monthly_liability_change=round(monthly_liability_change, 2),
            net_worth_impact_pct=round(((shocked_net_worth / max(net_worth, 1.0)) - 1.0) * 100.0 if net_worth != 0 else net_worth_impact_pct, 1),
            reserve_gap_months=round(reserve_gap_months, 1),
            pressure_points=tuple(pressure_points),
            safer_move=safer_move,
            narrative=narrative,
        )
        payload = asdict(result)
        payload["profile"] = dict(profile)
        payload["balance_sheet_inputs"] = dict(balance_sheet_inputs)
        return payload
