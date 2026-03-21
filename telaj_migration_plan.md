# TELAJ Migration Plan

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

These are reversible and can be feature-flagged while the Streamlit UI remains unchanged.

## UI Logic Tightly Coupled To Streamlit

The following is currently tightly bound to Streamlit and should not be extracted first:

- `st.session_state` broker/session state
- direct `st.chat_input` / chat history handling
- `st.columns`, `st.expander`, `st.metric`, `st.dataframe`, `st.plotly_chart`
- form submission flow for broker sync
- error/success messaging inline with actions

This should migrate later into viewmodels/components, not directly into backend services.

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

Later API candidates:

- `POST /broker/sync`
- `POST /alerts/test`
- `POST /assistant/context`
- `POST /assistant/chat`

Broker execution should only become an API after auth and permission boundaries are clear.

## How To Support TELAJ.com Embedding In Phases

### Phase 1
- keep Streamlit app live
- extract pure services into `/services`
- introduce feature flags
- keep all UI behavior in Streamlit

### Phase 2
- add `/api_future/routes` and `/api_future/schemas`
- expose read-only planning, briefing, board, and doctor endpoints
- let TELAJ.com embed these via server-side or client-side fetches

### Phase 3
- move new frontend experiences to TELAJ.com
- Streamlit remains as admin/research console
- shared data layer stays in Supabase

### Phase 4
- isolate broker actions behind authenticated APIs
- TELAJ.com becomes the primary user-facing frontend
- Streamlit becomes internal operator tooling

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

## Recommended Frontend Migration Path

### Near-term
- keep Streamlit for shipping speed
- introduce `/ui_streamlit/components` and `/ui_streamlit/viewmodels` gradually

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

## Current Recommendation

The lowest-risk path is:

- keep Streamlit as the working shell
- extract one business domain at a time
- start with planning, then diagnostics, then briefings
- treat broker execution as the last major migration, not the first

## Progress Snapshot

Completed low-risk extractions:

- planning engine
- portfolio doctor service

Current feature flags:

- `FEATURE_PLANNING_SERVICE`
- `FEATURE_PORTFOLIO_DOCTOR_SERVICE`
