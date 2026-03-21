# TELAJ Migration Plan

## Strategic Position

Streamlit is the current shell, not the final destination.

The current app is useful because it ships fast and already contains:

- live broker integrations
- shared storage
- market intelligence
- planning tools
- beginner-friendly education

But TELAJ.com is the intended premium product surface.

That means the migration goal is not:

- "replace Streamlit immediately"

It is:

- preserve the current working shell
- extract business logic safely
- expose stable contracts
- move user-facing experiences to TELAJ.com in phases

## Current Reality

Today the app is still organized around `learning_machine/interface.py`, which acts as:

- page composition layer
- state manager
- interaction controller
- chart renderer
- partial business logic host

This is the right reason to migrate gradually. The shell works, but it is too coupled to become the long-term TELAJ frontend.

## Current Streamlit Architecture

The current application is a Streamlit-first product centered on `learning_machine/interface.py`. That file currently owns:

- page composition and layout
- view state in `st.session_state`
- input controls and feature routing
- significant business logic for planning and beginner guidance
- direct orchestration of broker actions
- rendering of charts, cards, and explainers

Supporting logic already lives in `learning_machine/`:

- `data.py`: market and macro data loading, media summaries, investment proxy history
- `intelligence.py`: scoring, event risk, market internals, credit/liquidity, allocation logic
- `trade_manager.py`: broker orchestration for Alpaca and Coinbase
- `signal_worker.py`, `execution_worker.py`, `report_worker.py`: scheduled automation
- `storage.py` / `ledger.py`: shared ledger and signal persistence
- `notifications.py`: Discord delivery

In addition, the repo has started partial extraction into:

- `/services`
- `/domain`

Current extraction status:

- `services/planning_engine.py`
- `services/portfolio_doctor.py`
- `services/market_brain.py`
- `services/briefing_engine.py`
- `services/scenario_engine.py`
- `services/real_estate_lab.py`
- `services/tax_education.py`
- `domain/planning.py`
- `domain/portfolio.py`
- `domain/signals.py`
- `domain/scenarios.py`
- `domain/real_estate.py`
- `domain/user_profiles.py`

The migration has meaningfully started, but the Streamlit shell still orchestrates the product.

## Services That Can Be Extracted First

Lowest-risk extractions:

1. `planning_engine.py`
- already mostly pure logic
- no broker writes
- no side effects beyond transforming data

2. `portfolio_doctor.py`
- can consume portfolio snapshots and board rankings
- mostly rule-based interpretation

3. `briefing_engine.py`
- converts regime/internals/media into plain-English briefings

4. `assistant_context.py`
- packages dashboard state for LLM usage

5. `signal_engine.py`
- wraps current score/allocation/signal composition into a service boundary

6. `scenario_engine.py`
- educational scenario and stress outputs

7. `real_estate_lab.py`
- educational real-estate calculator outputs

8. `tax_education.py`
- reusable educational account and property tax framing

These are reversible and can be feature-flagged while the Streamlit UI remains unchanged.

Recommended extraction order:

1. `planning_engine.py`
2. `portfolio_doctor.py`
3. `briefing_engine.py`
4. `assistant_context.py`
5. `signal_engine.py`
6. `market_brain.py`
7. `scenario_engine.py`
8. `real_estate_lab.py`
9. `tax_education.py`

## UI Logic Tightly Coupled To Streamlit

The following is currently tightly bound to Streamlit and should not be extracted first:

- `st.session_state` broker/session state
- direct `st.chat_input` / chat history handling
- `st.columns`, `st.expander`, `st.metric`, `st.dataframe`, `st.plotly_chart`
- form submission flow for broker sync
- error/success messaging inline with actions

This should migrate later into viewmodels/components, not directly into backend services.

Additional coupling that should be called out explicitly:

- broker credentials stored in `st.session_state`
- in-app copilot conversation state
- inline action gating for broker sync
- direct use of `st.secrets`
- layout-specific transformations inside the page layer

## What Should Become API Endpoints

First API candidates:

- `GET /market/briefing`
- `GET /market/media`
- `GET /signals/board`
- `POST /planning/compare`
- `POST /planning/genie`
- `POST /portfolio/doctor`
- `GET /portfolio/snapshot`
- `GET /ledger/recent`
- `GET /signals/latest`
- `GET /market/board`
- `GET /market/internals`
- `GET /market/liquidity`
- `GET /market/calendar`

Later API candidates:

- `POST /broker/sync`
- `POST /alerts/test`
- `POST /assistant/context`
- `POST /assistant/chat`

Broker execution should only become an API after auth and permission boundaries are clear.

Business logic that should become API-friendly first:

- board building
- current AI stance
- planning comparison
- money genie planning
- portfolio doctor
- media summary
- daily briefing
- scenario stress outputs
- real-estate analysis outputs
- assistant context packaging

## How To Support TELAJ.com Embedding In Phases

### Phase 1
- keep Streamlit app live
- extract pure services into `/services`
- introduce feature flags
- keep all UI behavior in Streamlit
- define reusable data contracts

### Phase 2
- add `/api_future/routes` and `/api_future/schemas`
- expose read-only planning, briefing, board, and doctor endpoints
- let TELAJ.com embed these via server-side or client-side fetches
- keep broker writes inside Streamlit and workers only

### Phase 3
- move new frontend experiences to TELAJ.com
- Streamlit remains as admin/research console
- shared data layer stays in Supabase
- TELAJ.com becomes the main onboarding and planning surface

### Phase 4
- isolate broker actions behind authenticated APIs
- TELAJ.com becomes the primary user-facing frontend
- Streamlit becomes internal operator tooling
- support per-user broker linkage and profile storage

## Environment And Secret Handling

Current environments:

- Streamlit secrets
- GitHub Actions secrets
- local `.streamlit/secrets.toml`

Recommended future handling:

- keep broker keys out of frontend persistence where possible
- move backend service secrets to server-side env vars
- split secrets by domain:
  - data providers
  - LLM providers
  - broker providers
  - notification providers
  - storage

Suggested categories:

- `FRED_API_KEY`
- `OPENAI_API_KEY` / `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DISCORD_WEBHOOK_URL`
- broker-specific server secrets only on backend workers

Future rule:

- TELAJ frontend should never need direct access to service-role or broker secrets

## Auth Considerations

Current app is mostly session-based and not multi-user safe for production SaaS.

Before TELAJ embedding:

- add user identity and session model
- separate personal settings from global app secrets
- never share one broker account across multiple end users
- introduce role separation:
  - public viewer
  - authenticated user
  - operator/admin

Recommended future auth path:

- TELAJ.com primary auth
- signed backend session for API access
- per-user broker connection records
- no direct browser exposure of backend service-role keys

Minimum TELAJ auth milestone before broker API exposure:

- signed user session
- user-scoped profile record
- per-user broker ownership mapping
- action audit trail

## Broker Integration Isolation

Broker logic should move behind isolated integration clients:

- `/integrations/alpaca_client.py`
- `/integrations/coinbase_client.py`

Then expose business-safe operations through services:

- account snapshot
- positions
- quote/spread
- validate trade
- submit trade

UI should not know provider-specific request shapes.

Migration target:

- `integrations/alpaca_client.py`
- `integrations/coinbase_client.py`
- `integrations/fred_client.py`
- `integrations/yfinance_client.py`
- `integrations/supabase_client.py`
- `integrations/discord_client.py`

## Recommended Frontend Migration Path

### Near-term
- keep Streamlit for shipping speed
- introduce `/ui_streamlit/components` and `/ui_streamlit/viewmodels` gradually
- reduce business logic inside `interface.py`

### Mid-term
- build TELAJ.com frontend for:
  - landing pages
  - onboarding
  - planning flows
  - portfolio dashboards

### Long-term
- retain Streamlit for:
  - operator tools
  - research
  - internal debugging
  - experiment control

TELAJ.com should own:

- onboarding
- simple mode
- planning
- wealth map
- scenarios
- premium portfolio views

## Rollout Sequence With Low-Risk Milestones

1. Extract planning logic into `/services/planning_engine.py` and `/domain/planning.py`
- feature-flagged
- keep Streamlit fallback

2. Extract portfolio doctor rules
- read-only
- no execution risk
- feature-flagged
- keep Streamlit fallback

3. Extract briefing and media summarization
- read-only
- API-friendly

4. Extract assistant context builder
- no UI dependency beyond input/output payloads

5. Add read-only API routes for TELAJ embedding
- board
- planning
- doctor
- briefing

6. Migrate TELAJ.com planning page first
- lowest regulatory and operational risk

7. Migrate portfolio dashboard
- still read-only first

8. Only later migrate broker sync and execution
- after auth, permissions, audit trails, and user separation are production-ready

9. Add TELAJ onboarding gate and profile contracts
- read-only first
- no broker writes

10. Add wealth map and scenario APIs
- planning and education first
- execution still stays outside TELAJ

## Risks

Primary migration risks:

- `learning_machine/interface.py` remains a high-coupling file
- business logic may drift if fallback logic and extracted services both evolve
- current repo still contains both product code and legacy research code
- shared storage is only partially normalized
- experiment tracking is still local-file oriented
- broker execution is not yet isolated behind clean provider clients
- current app is not multi-user safe for SaaS broker usage
- naming is still mixed across `Learning Machine`, `Sovereign AI`, `Guru's Superbrain`, and `TELAJ`
- docs have historically lagged behind the live app architecture

Operational risks during rollout:

- mixed deploys can create import mismatches in Streamlit
- feature flags can hide drift if parity is not verified
- TELAJ frontend can diverge from Streamlit if contracts are not defined early

Risk control strategy:

- keep read-only extractions first
- add data contracts before frontend migration
- use feature flags for all behavior changes
- preserve Streamlit fallbacks until parity is proven

## Current Recommendation

The lowest-risk path is:

- keep Streamlit as the working shell
- extract one business domain at a time
- start with planning, then diagnostics, then briefings
- treat broker execution as the last major migration, not the first
- use TELAJ.com first for onboarding and read-only experiences, not broker actions

## Progress Snapshot

Completed low-risk extractions:

- planning engine
- portfolio doctor service
- market brain summaries
- briefing engine
- scenario engine
- real-estate lab
- tax education service
- typed domain contracts for signals, scenarios, real estate, and onboarding

Current feature flags:

- `FEATURE_PLANNING_SERVICE`
- `FEATURE_PORTFOLIO_DOCTOR_SERVICE`
- `FEATURE_ONBOARDING_GATE`
- `FEATURE_WEALTH_MAP`
- `FEATURE_SIMPLE_MODE`
- `FEATURE_PRO_MODE`
- `FEATURE_REAL_ESTATE_LAB`
- `FEATURE_SCENARIO_SIM`
- `FEATURE_TELAJ_PREP`
- `FEATURE_NEW_THEME`

## Final Feature Inventory

Current product inventory:

- onboarding gate
- TELAJ-style section shell
- market pulse and stance
- Superbrain board
- media tone and hype layer
- everyday guide
- amount-based planning and Money Genie
- portfolio doctor
- machine feed
- broker account views
- ledger/equity reporting
- scenario lab
- real-estate lab
- in-app copilot
- Discord notifications
- scheduled workers

## Final Migration Blockers

The most important blockers still standing are:

1. `learning_machine/interface.py` is still the orchestration center
2. broker execution is not isolated behind a dedicated integration layer
3. no read-only API layer exists yet
4. no TELAJ auth/session model exists
5. no per-user broker ownership model exists
6. experiment tracking is not normalized like ledger/signal storage
7. some fallbacks still duplicate logic
8. research stack and product stack still live side by side without a cleaner boundary
9. docs and package naming are still historically mixed
10. Streamlit remains both product shell and operator shell

## Next 10 Highest-Impact Refactors

1. Create `/integrations/alpaca_client.py` and move provider-specific logic out of `trade_manager.py`
2. Create `/integrations/coinbase_client.py` and finish provider isolation
3. Extract assistant context into `services/assistant_context.py`
4. Create `services/signal_engine.py` as the main board/idea orchestration boundary
5. Add read-only `/api_future` routes for planning, board, briefing, media, scenarios, and real estate
6. Move experiment tracking onto the same shared storage strategy as ledger and signal state
7. Split `learning_machine/interface.py` into UI components/viewmodels
8. Define a TELAJ auth/session contract and profile storage model
9. Separate the legacy research stack into a clearly marked `research` path or docs boundary
10. Standardize naming conventions across code, docs, notifications, and deployment surfaces

## Next-Phase Roadmap

Phase A:

- finalize service/domain extraction baseline
- commit docs and extracted modules
- keep Streamlit as the product shell

Phase B:

- add read-only APIs
- move TELAJ onboarding and planning to TELAJ.com first

Phase C:

- migrate market and portfolio views
- keep execution in Streamlit/workers

Phase D:

- isolate broker execution APIs
- add auth, audit, and user ownership

## Rollback Considerations

- feature flags remain the primary rollback path
- keep read-only service fallbacks during the transition
- do not migrate broker writes until the TELAJ stack has strong operational parity

## Deployment Considerations

- Streamlit Cloud remains the fastest shell for current shipping
- GitHub Actions remains the easiest automation runner for now
- Supabase should stay the shared state source during migration
- TELAJ frontend should consume read-only APIs first
- broker and service-role secrets must stay server-side
