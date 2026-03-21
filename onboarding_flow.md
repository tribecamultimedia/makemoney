# Onboarding Flow

## Goal

The onboarding flow should turn a confusing finance product into a guided setup interview.

The target is:

- understandable for first-time investors
- quick enough to complete in under 2 minutes
- useful enough to drive product personalization
- structured enough to produce clean profile data

This flow should be gated by:

- `FEATURE_ONBOARDING_GATE`

## Startup Interview

The first version should ask 5 questions.

### Question 1: What are you trying to do with your money?

Field:
- `primary_goal`

Answer options:

- `Grow it steadily`
- `Protect what I already have`
- `Build long-term wealth`
- `Generate extra income`
- `I am not sure yet`

Why it matters:
- drives framing of recommendations
- shifts emphasis between growth, defense, and planning

### Question 2: When do you think you may need this money?

Field:
- `time_horizon`

Answer options:

- `Less than 1 year`
- `1 to 3 years`
- `3 to 7 years`
- `7+ years`
- `I do not know`

Why it matters:
- major driver of risk capacity
- affects cash, bond, and equity weighting

### Question 3: How would you react if your money dropped 20%?

Field:
- `drawdown_reaction`

Answer options:

- `I would panic and sell`
- `I would feel bad but wait`
- `I would probably hold`
- `I would buy more`
- `I honestly do not know`

Why it matters:
- strongest simple proxy for emotional risk tolerance

### Question 4: How comfortable are you with these products?

Field:
- `product_familiarity`

Answer options:

- `Only cash and savings`
- `I know ETFs a little`
- `I know stocks and ETFs`
- `I also understand crypto`
- `I am experienced with investing`

Why it matters:
- controls UI simplification and educational depth

### Question 5: What accounts do you already use?

Field:
- `account_context`

Answer options:

- `Bank account only`
- `Brokerage account`
- `Retirement account like 401(k) or IRA`
- `Crypto exchange account`
- `A mix of these`

Why it matters:
- affects product recommendations
- informs whether to emphasize retirement wrappers, taxable accounts, or crypto warnings

## Derived Archetypes

After the 5 answers, assign a first-pass archetype.

### `Cautious Starter`

Typical traits:

- short horizon
- panic-oriented drawdown answer
- low familiarity
- bank account only

Product behavior:

- simple mode only
- focus on cash, bonds, diversification basics
- avoid speculative prompts

### `Careful Builder`

Typical traits:

- medium to long horizon
- mild discomfort with losses
- some ETF familiarity

Product behavior:

- emphasize diversified core allocation
- explain buy/hold/protect in plain English
- keep risk summaries prominent

### `Long-Term Compounder`

Typical traits:

- long horizon
- hold through volatility
- interested in wealth building

Product behavior:

- emphasize core equity allocation, retirement wrappers, long-term planning

### `Tactical Explorer`

Typical traits:

- interested in trading or short-term growth
- higher tolerance for volatility
- more familiarity with products

Product behavior:

- show trade setup tools
- keep risk controls visible
- preserve planning guidance

### `Income Seeker`

Typical traits:

- income goal
- lower drawdown tolerance
- interest in bonds, cash flow, defensive allocation

Product behavior:

- emphasize bonds, cash equivalents, REITs, and yield-aware planning

## Derived Profile Fields

The interview should populate a normalized user profile payload.

Suggested fields:

- `primary_goal`
- `time_horizon_years_min`
- `time_horizon_years_max`
- `risk_tolerance_label`
- `risk_tolerance_score`
- `knowledge_level`
- `account_context`
- `wants_income`
- `crypto_eligible`
- `needs_simple_mode`
- `recommended_archetype`

## Example Field Derivation

### Risk tolerance score

Suggested 0-100 mapping:

- `I would panic and sell` → `15`
- `I would feel bad but wait` → `35`
- `I would probably hold` → `60`
- `I would buy more` → `80`
- `I honestly do not know` → `30`

### Knowledge level

Suggested mapping:

- `Only cash and savings` → `beginner`
- `I know ETFs a little` → `beginner_plus`
- `I know stocks and ETFs` → `intermediate`
- `I also understand crypto` → `intermediate_plus`
- `I am experienced with investing` → `advanced`

### Simple mode derivation

Set `needs_simple_mode = true` when any of these are true:

- `product_familiarity` is beginner-level
- `drawdown_reaction` is panic-oriented
- `account_context` is bank only
- `primary_goal` is unclear

## Output Contract

Suggested onboarding result:

```json
{
  "primary_goal": "Build long-term wealth",
  "time_horizon": "7+ years",
  "drawdown_reaction": "I would probably hold",
  "product_familiarity": "I know stocks and ETFs",
  "account_context": "A mix of these",
  "risk_tolerance_score": 60,
  "risk_tolerance_label": "moderate",
  "knowledge_level": "intermediate",
  "needs_simple_mode": false,
  "recommended_archetype": "Long-Term Compounder"
}
```

## Product Use Of The Interview

The onboarding result should drive:

- default mode:
  - simple vs pro
- default planning mix
- risk copy tone
- starter recommendations
- onboarding-specific guardrails
- future TELAJ profile storage

## Implementation Notes

Phase 1:

- run only in Streamlit session state
- no auth dependency
- no persistence required

Phase 2:

- persist profile to backend
- make profile available to planning, scenarios, and assistant context

Phase 3:

- reuse the same schema in TELAJ.com onboarding and API requests
