# Data Contracts

## Purpose

These contracts define clean, reusable schemas for the next extraction phase.

They should be usable in:

- Streamlit viewmodels
- future services
- future API schemas
- TELAJ.com frontend contracts

The shape below is implementation-oriented and intentionally simple.

## `RiskProfile`

Represents the user’s risk capacity and emotional tolerance.

```json
{
  "label": "moderate",
  "score": 60,
  "time_horizon": "7+ years",
  "primary_goal": "Build long-term wealth",
  "drawdown_reaction": "I would probably hold",
  "knowledge_level": "intermediate",
  "needs_simple_mode": false,
  "archetype": "Long-Term Compounder"
}
```

Required fields:

- `label`: `very_low | low | moderate | growth | aggressive`
- `score`: integer `0-100`
- `time_horizon`: string label
- `primary_goal`: string
- `drawdown_reaction`: string
- `knowledge_level`: `beginner | beginner_plus | intermediate | intermediate_plus | advanced`
- `needs_simple_mode`: boolean
- `archetype`: string

## `WealthMapState`

Represents the user’s current or proposed high-level allocation map.

```json
{
  "cash_pct": 20.0,
  "stocks_pct": 45.0,
  "bonds_pct": 20.0,
  "crypto_pct": 5.0,
  "real_estate_pct": 10.0,
  "diversification_score": 72,
  "risk_score": 41,
  "status": "balanced",
  "notes": [
    "equity exposure is reasonable",
    "cash buffer is healthy"
  ]
}
```

Required fields:

- `cash_pct`: float
- `stocks_pct`: float
- `bonds_pct`: float
- `crypto_pct`: float
- `real_estate_pct`: float
- `diversification_score`: integer `0-100`
- `risk_score`: integer `0-100`
- `status`: `defensive | balanced | aggressive | concentrated`
- `notes`: array of strings

Validation rule:

- allocation percentages should sum to approximately `100`

## `SignalIdea`

Represents one trade or investment idea produced by the market brain.

```json
{
  "ticker": "SPY",
  "asset_class": "equity",
  "action": "BUY",
  "simple_call": "Good long-term core idea",
  "composite_score": 74.2,
  "confidence": 0.78,
  "target_notional": 50.0,
  "mode": "risk_on_expansion",
  "summary": "SPY is supported by macro and internals.",
  "attribution": "version=ensemble-v2 | regime=risk_on | score=74.2",
  "risks": [
    "event risk within 24 hours"
  ]
}
```

Required fields:

- `ticker`: string
- `asset_class`: `equity | crypto | bond | commodity | real_estate_proxy | cash_proxy`
- `action`: `BUY | HOLD | PROTECT`
- `simple_call`: string
- `composite_score`: float `0-100`
- `confidence`: float `0-1`
- `target_notional`: float
- `mode`: string
- `summary`: string
- `attribution`: string
- `risks`: array of strings

## `PortfolioSnapshot`

Normalized broker portfolio state.

```json
{
  "provider": "alpaca",
  "mode": "paper",
  "equity": 100000.0,
  "cash": 99900.0,
  "buying_power": 199900.0,
  "daily_pnl_pct": -0.02,
  "positions": [
    {
      "symbol": "SPY",
      "qty": 0.5,
      "market_value": 250.0,
      "unrealized_plpc": 0.01
    }
  ],
  "wallet_balances": []
}
```

Required fields:

- `provider`: `alpaca | coinbase`
- `mode`: `paper | live | sandbox`
- `equity`: float
- `cash`: float
- `buying_power`: float
- `daily_pnl_pct`: float
- `positions`: array of normalized position rows
- `wallet_balances`: array of wallet rows, mainly for Coinbase

Position row fields:

- `symbol`: string
- `qty`: float
- `market_value`: float
- `unrealized_plpc`: float

Wallet row fields:

- `currency`: string
- `available_balance`: float
- `hold_balance`: float
- `type`: string
- `uuid`: string

## `PlanScenario`

Represents a planning result for an amount, horizon, and profile.

```json
{
  "amount": 10000.0,
  "horizon_years": 7,
  "risk_profile": "growth",
  "account_type": "Roth IRA",
  "allocation": [
    {"label": "US stocks ETF", "weight": 40},
    {"label": "Treasury bonds", "weight": 15},
    {"label": "Cash / T-Bills", "weight": 5}
  ],
  "summary": "Spread the money instead of betting on one story.",
  "board_note": "Best current board idea: SPY",
  "account_note": "A Roth IRA usually makes sense for long-term tax-free growth if you qualify.",
  "footer": "Risk style: Growth | Time horizon: 7 years"
}
```

Required fields:

- `amount`: float
- `horizon_years`: integer
- `risk_profile`: string
- `account_type`: string
- `allocation`: array of `{label, weight}`
- `summary`: string
- `board_note`: string
- `account_note`: string
- `footer`: string

## `RealEstateScenario`

Represents a real-estate decision model.

```json
{
  "purchase_price": 250000.0,
  "down_payment_pct": 20.0,
  "interest_rate_pct": 4.5,
  "monthly_rent": 1400.0,
  "monthly_costs": 820.0,
  "vacancy_pct": 5.0,
  "cap_rate_pct": 6.2,
  "monthly_cash_flow": 420.0,
  "risk_label": "medium",
  "summary": "Cash flow is positive, but financing cost remains important."
}
```

Required fields:

- `purchase_price`: float
- `down_payment_pct`: float
- `interest_rate_pct`: float
- `monthly_rent`: float
- `monthly_costs`: float
- `vacancy_pct`: float
- `cap_rate_pct`: float
- `monthly_cash_flow`: float
- `risk_label`: `low | medium | high`
- `summary`: string

## `ScenarioShockResult`

Represents the effect of a macro or market shock on a portfolio or wealth map.

```json
{
  "scenario_name": "rate_shock",
  "shock_description": "Rates rise by 1 percent and equities re-rate lower.",
  "portfolio_impact_pct": -8.4,
  "cash_impact_pct": 0.0,
  "stocks_impact_pct": -12.0,
  "bonds_impact_pct": -6.0,
  "crypto_impact_pct": -18.0,
  "real_estate_impact_pct": -4.0,
  "worst_bucket": "crypto",
  "best_bucket": "cash",
  "guidance": [
    "reduce concentration",
    "increase defensive ballast"
  ]
}
```

Required fields:

- `scenario_name`: string
- `shock_description`: string
- `portfolio_impact_pct`: float
- `cash_impact_pct`: float
- `stocks_impact_pct`: float
- `bonds_impact_pct`: float
- `crypto_impact_pct`: float
- `real_estate_impact_pct`: float
- `worst_bucket`: string
- `best_bucket`: string
- `guidance`: array of strings

## Contract Notes

Implementation rules:

1. These contracts should be represented as typed domain models before API exposure.
2. Streamlit should render from these shapes, not invent its own ad hoc payloads.
3. API routes should reuse the same schemas with minimal translation.
4. Broker-specific fields should be normalized before reaching these contracts.
