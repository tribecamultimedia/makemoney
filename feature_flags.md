# Feature Flags

## Purpose

Feature flags should be used to:

- preserve the current live app while new product flows are introduced
- support reversible refactors
- allow TELAJ-specific preparation without breaking Streamlit
- separate beginner flows from operator or research flows

Flags should be readable from:

- environment variables
- Streamlit secrets

Recommended normalization:

- truthy: `1`, `true`, `yes`, `on`
- falsy: `0`, `false`, `no`, `off`

## Current Flags

### `FEATURE_PLANNING_SERVICE`

Purpose:
- route planner logic through `services/planning_engine.py`

Default:
- `true`

Fallback behavior:
- use legacy in-file planner logic in `learning_machine/interface.py`

### `FEATURE_PORTFOLIO_DOCTOR_SERVICE`

Purpose:
- route portfolio diagnostics through `services/portfolio_doctor.py`

Default:
- `true`

Fallback behavior:
- use legacy in-file portfolio doctor logic in `learning_machine/interface.py`

## Proposed Flags

### `FEATURE_ONBOARDING_GATE`

Purpose:
- show a startup interview before dropping users into the main experience
- build an initial risk/archetype profile

Default:
- `false`

When enabled:
- first-time users complete the 5-question interview
- derived profile is stored in session and later in a user profile record

### `FEATURE_WEALTH_MAP`

Purpose:
- expose a simplified wealth allocation map instead of only a market dashboard

Default:
- `false`

When enabled:
- show asset buckets like:
  - stocks
  - bonds
  - cash
  - crypto
  - real estate
- support beginner-first allocation visualization

### `FEATURE_SIMPLE_MODE`

Purpose:
- show the beginner-first product surface

Default:
- `true`

When enabled:
- emphasize:
  - plain-English explanations
  - simple calls
  - next steps
  - guided planning

### `FEATURE_PRO_MODE`

Purpose:
- expose the denser operator or advanced-user diagnostics

Default:
- `false`

When enabled:
- show:
  - factor diagnostics
  - attribution detail
  - execution diagnostics
  - experiment tracking

Note:
- `FEATURE_SIMPLE_MODE` and `FEATURE_PRO_MODE` can coexist, but should map to different layouts

### `FEATURE_REAL_ESTATE_LAB`

Purpose:
- enable real-estate scenario tools and calculator-style modules

Default:
- `false`

When enabled:
- show real-estate inputs for:
  - purchase price
  - down payment
  - rent
  - taxes
  - expenses
  - financing assumptions

### `FEATURE_SCENARIO_SIM`

Purpose:
- enable cross-asset scenario and shock simulation

Default:
- `false`

When enabled:
- support:
  - recession shock
  - inflation shock
  - rate shock
  - crypto drawdown shock
  - housing slowdown shock

### `FEATURE_TELAJ_PREP`

Purpose:
- enable contracts and UI paths intended to align with the future TELAJ architecture

Default:
- `false`

When enabled:
- prefer service-backed flows
- log UI paths that should later move to APIs
- keep business logic out of direct page functions wherever possible

### `FEATURE_NEW_THEME`

Purpose:
- control rollout of the new TELAJ visual system

Default:
- `true`

When enabled:
- use the new neo-brutalist theme

When disabled:
- use the older baseline theme if retained

## Recommended Future Flags

These are not required immediately, but they fit the roadmap:

- `FEATURE_ASSISTANT_GEMINI`
- `FEATURE_SIGNAL_ENGINE_SERVICE`
- `FEATURE_BRIEFING_ENGINE`
- `FEATURE_ASSISTANT_CONTEXT_SERVICE`
- `FEATURE_API_READ_ONLY_MODE`
- `FEATURE_BROKER_EXECUTION_API`

## Rollout Rules

1. New business logic should launch behind a flag if it changes user-visible behavior.
2. Read-only services should default to `true` only after Streamlit parity is confirmed.
3. Execution-related changes should default to `false` first in production.
4. TELAJ-prep flags should not disable the current Streamlit shell.
5. Feature flags should be documented in code and in release notes when behavior changes.
