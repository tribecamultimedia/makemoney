# Architecture

## Current Architecture

The current product is a Streamlit-first application with scheduled workers and direct third-party integrations.

Primary runtime surfaces:

- `learning_machine/interface.py`
  - current user-facing shell
  - owns layout, routing, broker connection flow, chat, charts, and part of the business logic
- `learning_machine/signal_worker.py`
  - scheduled market state and signal snapshot worker
- `learning_machine/execution_worker.py`
  - scheduled trade execution worker
- `learning_machine/report_worker.py`
  - scheduled reporting worker

Supporting modules:

- `learning_machine/data.py`
  - FRED, yFinance, media RSS, investment proxy history
- `learning_machine/intelligence.py`
  - market internals, event-risk filter, credit/liquidity factor, ensemble decision engine, allocator
- `learning_machine/execution.py`
  - broker credentials, execution signal, drawdown shield
- `learning_machine/trade_manager.py`
  - broker orchestration for Alpaca and Coinbase
- `learning_machine/storage.py`
  - shared storage abstraction with Supabase fallback to local `.state`
- `learning_machine/ledger.py`
  - ledger/equity append and read helpers
- `learning_machine/notifications.py`
  - Discord delivery
- `learning_machine/experiment_tracker.py`
  - local experiment logging

Partial extractions already started:

- `services/portfolio_doctor.py`
- `services/planning_engine.py`
- `services/market_brain.py`
- `services/briefing_engine.py`
- `services/scenario_engine.py`
- `services/real_estate_lab.py`
- `services/tax_education.py`
- `domain/portfolio.py`
- `domain/planning.py`
- `domain/signals.py`
- `domain/scenarios.py`
- `domain/real_estate.py`
- `domain/user_profiles.py`

These are the first visible steps toward service extraction, but the Streamlit shell still orchestrates most behavior.

## Current Modules

### Product and UI

- `learning_machine/interface.py`
  - single-page app shell
  - onboarding gate
  - TELAJ product shell
  - section routing:
    - `Plan`
    - `Signals`
    - `Portfolio`
    - `Market`
    - `Real Estate`
    - `Scenario Lab`
    - `Account`
  - broker linking
  - AI/copilot
  - machine feed
  - portfolio panels
  - audit and ledger panels

### Data and market intelligence

- `learning_machine/data.py`
  - OHLCV and macro joins
  - sovereign score inputs
  - economic calendar
  - media sentiment summary
  - investment comparison history
- `learning_machine/intelligence.py`
  - `MarketInternalsFactory`
  - `EventRiskFilter`
  - `CreditLiquidityFactor`
  - `PositionSizer`
  - `PortfolioAllocator`
  - `EnsembleDecisionEngine`
- `services/market_brain.py`
  - pulse summaries
  - signal ideas
  - board construction
  - machine stance normalization
- `services/briefing_engine.py`
  - briefings
  - media tone normalization
  - hype copy
  - everyday guide summaries

### Execution and brokers

- `learning_machine/execution.py`
  - execution-side domain objects
- `learning_machine/trade_manager.py`
  - Alpaca account/positions/orders
  - Coinbase account/positions/orders

### Persistence and notifications

- `learning_machine/storage.py`
  - Supabase REST access
  - local file fallback
- `learning_machine/ledger.py`
  - trade and equity history
- `learning_machine/notifications.py`
  - Discord notifications
- `learning_machine/experiment_tracker.py`
  - local experiment runs

### Planning, scenarios, and educational labs

- `services/planning_engine.py`
  - comparison planner
  - money genie plans
- `services/scenario_engine.py`
  - educational scenario stress tests
- `services/real_estate_lab.py`
  - educational property calculator
- `services/tax_education.py`
  - educational tax framing

### Automation

- `learning_machine/signal_worker.py`
- `learning_machine/execution_worker.py`
- `learning_machine/report_worker.py`
- `.github/workflows/heartbeat.yml`

### Legacy research stack

These modules still exist and are useful for experimentation, but they are not the main TELAJ product path:

- `learning_machine/main.py`
- `learning_machine/env.py`
- `learning_machine/features.py`
- `learning_machine/backtest.py`
- `learning_machine/risk.py`
- `learning_machine/sentiment.py`

## Current Dependencies

Core runtime dependencies in `pyproject.toml`:

- `streamlit`
- `plotly`
- `pandas`
- `numpy`
- `requests`
- `yfinance`
- `fredapi`
- `coinbase-advanced-py`
- `cryptography`
- `PyJWT`

Research dependencies still present:

- `gymnasium`
- `stable-baselines3`
- `torch`
- `ta`
- `scikit-learn`

Infrastructure expectations:

- Streamlit Cloud for current app hosting
- GitHub Actions for scheduled automation
- Supabase for shared ledger, equity, and latest signal
- Discord webhook for alerts

## Current UI Coupling

The UI is tightly coupled to Streamlit in these ways:

- `st.session_state` stores broker credentials, cooldowns, audit log, chat history, and execution status
- `st.secrets` is used directly inside UI and helper functions
- business decisions are triggered directly from Streamlit callbacks
- layout primitives are mixed with business logic:
  - `st.columns`
  - `st.expander`
  - `st.form`
  - `st.chat_input`
  - `st.dataframe`
  - `st.plotly_chart`
- the broker sync flow is implemented directly in the page layer
- planner and diagnostics still have fallback logic embedded in the UI shell
- section navigation and layout composition still live in `interface.py`
- onboarding is still Streamlit session-state driven
- product-shell routing is still Streamlit controlled
- broker sidebars are still UI-owned rather than viewmodel-owned

This means the current Streamlit app is both:

- the presentation layer
- the orchestration layer
- part of the domain layer

That is acceptable for the current stage, but it blocks clean reuse for TELAJ.com.

## Desired Modular Architecture

Target structure:

```text
/services
  market_brain.py
  signal_engine.py
  planning_engine.py
  portfolio_doctor.py
  scenario_engine.py
  real_estate_lab.py
  tax_education.py
  briefing_engine.py
  assistant_context.py

/domain
  signals.py
  portfolio.py
  planning.py
  scenarios.py
  real_estate.py
  user_profiles.py

/integrations
  alpaca_client.py
  coinbase_client.py
  fred_client.py
  yfinance_client.py
  supabase_client.py
  discord_client.py

/ui_streamlit
  pages/
  components/
  viewmodels/

/api_future
  routes/
  schemas/
```

Separation goals:

- `domain`
  - typed business objects
  - provider-agnostic and UI-agnostic
- `services`
  - reusable business logic
  - no direct Streamlit rendering
  - minimal side effects
- `integrations`
  - direct third-party API calls only
  - request/response normalization
- `ui_streamlit`
  - current operator and transitional shell
- `api_future`
  - TELAJ-facing contract layer

## Desired Responsibility Split

### Streamlit shell

- collect user inputs
- manage transitional session state
- render charts and cards
- call services
- avoid embedding core rules

### Services

- build board and signal ideas
- build planner outputs
- build portfolio diagnostics
- build briefings and media summaries
- assemble assistant context
- build scenario outputs
- build real-estate outputs
- build onboarding-derived profile outputs

### Integrations

- fetch market data
- fetch macro data
- fetch broker account snapshots
- submit broker orders
- persist ledger/signal/equity state
- send Discord alerts

### API layer

- expose read-only contracts first
- later expose authenticated execution operations

## What Is Now Modular

Already reasonably reusable:

- planning engine
- portfolio doctor
- market brain summaries
- daily/media/everyday briefing logic
- scenario simulation
- real-estate calculator
- typed domain contracts for planning, signals, scenarios, real estate, and onboarding state

These modules can now be reused by:

- Streamlit
- future TELAJ APIs
- future TELAJ frontend consumers

## What Remains Tightly Coupled To Streamlit

Still tightly coupled:

- broker connection widgets
- sidebar configuration and form handling
- section routing and page composition
- chart rendering and dataframe formatting
- copilot chat state
- audit log rendering
- execution confirmation flow
- some remaining fallback business logic inside `interface.py`

## API Routes To Build First

Recommended first read-only routes:

- `GET /market/pulse`
- `GET /market/stance`
- `GET /market/board`
- `GET /market/briefing`
- `GET /market/media`
- `GET /market/guide`
- `POST /planning/compare`
- `POST /planning/genie`
- `POST /portfolio/doctor`
- `POST /scenarios/run`
- `POST /real-estate/analyze`

Later routes:

- `GET /portfolio/snapshot`
- `GET /ledger/recent`
- `POST /assistant/context`
- `POST /assistant/chat`
- `POST /broker/sync`

## Recommended Frontend Migration Path

1. Keep Streamlit as the transitional shell.
2. Move read-only experiences to TELAJ.com first:
   - onboarding
   - planning
   - market summaries
   - scenarios
   - real-estate education
3. Keep broker execution in Streamlit/workers until auth, audit, and user isolation are ready.
4. Retain Streamlit long-term as:
   - operator console
   - debugging surface
   - research shell
   - internal execution console

## Deployment Considerations

Current deployment assumptions:

- Streamlit Cloud hosts the app shell
- GitHub Actions runs workers
- Supabase stores shared ledger/signal/equity state
- Discord handles notifications

Migration implications:

- TELAJ.com should not directly hold broker or service-role secrets
- read-only APIs should be introduced before execution APIs
- feature flags should remain the main rollout guardrail during the migration

## Rollback Considerations

Safe rollback levers:

- disable new UI layers through feature flags
- keep Streamlit fallbacks for service-backed features until parity is proven
- avoid moving broker execution until the TELAJ stack is operationally validated

## Immediate Architectural Priorities

1. Keep Streamlit functional as the current shell.
2. Continue extracting read-only logic into `/services`.
3. Move provider-specific calls into `/integrations`.
4. Normalize domain objects for TELAJ API reuse.
5. Treat broker execution as the last major migration, not the first.
