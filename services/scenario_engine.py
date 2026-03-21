from __future__ import annotations

from dataclasses import asdict

from domain.scenarios import ScenarioShockResult, WealthMapState


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
