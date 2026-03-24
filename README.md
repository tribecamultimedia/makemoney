# TELAJ Wealth Adventure

This repository now contains two layers:

- a **live Streamlit wealth product shell** with broker connectivity, planning, market intelligence, and educational labs
- a **legacy research stack** for RL/backtesting experimentation

The current end-user product is not the old research CLI. It is the Streamlit-based TELAJ prep application centered on [learning_machine/interface.py](/Users/tonysoprano/Documents/New%20project/learning_machine/interface.py).

## Product Position

Current role:

- Streamlit shell for a premium wealth product in transition
- live home for:
  - planning
  - signals
  - portfolio diagnostics
  - market context
  - scenario stress tests
  - educational real-estate analysis

Target role:

- TELAJ.com becomes the primary frontend
- Streamlit becomes the transitional shell and later the operator/research console

## Current Feature Inventory

### Core product shell

- onboarding gate behind `FEATURE_ONBOARDING_GATE`
- TELAJ-style section shell behind `FEATURE_WEALTH_MAP` or `FEATURE_TELAJ_PREP`
- sections:
  - `Plan`
  - `Signals`
  - `Portfolio`
  - `Market`
  - `Real Estate`
  - `Scenario Lab`
  - `Account`

### Intelligence

- `Guru's Superbrain` score and board
- current AI stance
- today's briefing
- what the media says
- hype meter
- everyday guide

### Planning and diagnostics

- amount-based comparison planner
- `Money Genie`
- `Portfolio Doctor`
- scenario stress testing
- educational real-estate calculator

### Broker and automation

- Alpaca paper/live support
- Coinbase live crypto support
- Discord alerts
- scheduled workers via GitHub Actions
- shared ledger/equity/latest signal via Supabase

## Current Architecture

Primary files:

- [learning_machine/interface.py](/Users/tonysoprano/Documents/New%20project/learning_machine/interface.py)
  - current Streamlit shell
- [learning_machine/data.py](/Users/tonysoprano/Documents/New%20project/learning_machine/data.py)
  - market, macro, media, proxy history
- [learning_machine/intelligence.py](/Users/tonysoprano/Documents/New%20project/learning_machine/intelligence.py)
  - scoring, internals, credit/liquidity, event risk, allocation
- [learning_machine/trade_manager.py](/Users/tonysoprano/Documents/New%20project/learning_machine/trade_manager.py)
  - broker execution and snapshots
- [learning_machine/storage.py](/Users/tonysoprano/Documents/New%20project/learning_machine/storage.py)
  - Supabase/local storage
- [learning_machine/signal_worker.py](/Users/tonysoprano/Documents/New%20project/learning_machine/signal_worker.py)
- [learning_machine/execution_worker.py](/Users/tonysoprano/Documents/New%20project/learning_machine/execution_worker.py)
- [learning_machine/report_worker.py](/Users/tonysoprano/Documents/New%20project/learning_machine/report_worker.py)

Extracted service layer so far:

- [services/planning_engine.py](/Users/tonysoprano/Documents/New%20project/services/planning_engine.py)
- [services/portfolio_doctor.py](/Users/tonysoprano/Documents/New%20project/services/portfolio_doctor.py)
- [services/market_brain.py](/Users/tonysoprano/Documents/New%20project/services/market_brain.py)
- [services/briefing_engine.py](/Users/tonysoprano/Documents/New%20project/services/briefing_engine.py)
- [services/scenario_engine.py](/Users/tonysoprano/Documents/New%20project/services/scenario_engine.py)
- [services/real_estate_lab.py](/Users/tonysoprano/Documents/New%20project/services/real_estate_lab.py)
- [services/tax_education.py](/Users/tonysoprano/Documents/New%20project/services/tax_education.py)

Typed domain models so far:

- [domain/planning.py](/Users/tonysoprano/Documents/New%20project/domain/planning.py)
- [domain/portfolio.py](/Users/tonysoprano/Documents/New%20project/domain/portfolio.py)
- [domain/signals.py](/Users/tonysoprano/Documents/New%20project/domain/signals.py)
- [domain/scenarios.py](/Users/tonysoprano/Documents/New%20project/domain/scenarios.py)
- [domain/real_estate.py](/Users/tonysoprano/Documents/New%20project/domain/real_estate.py)
- [domain/user_profiles.py](/Users/tonysoprano/Documents/New%20project/domain/user_profiles.py)

## Feature Flags

Current flags:

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

See:

- [feature_flags.md](/Users/tonysoprano/Documents/New%20project/feature_flags.md)

## Local Run

```bash
uv sync
uv run streamlit run learning_machine/interface.py
```

Legacy research entrypoint still exists:

```bash
uv run python -m learning_machine.main
```

## Streamlit Secrets

Set these in Streamlit Community Cloud or `.streamlit/secrets.toml`:

```toml
FRED_API_KEY = "your_fred_key"
DISCORD_WEBHOOK_URL = "your_discord_webhook"
APP_URL = "https://your-app-url.streamlit.app"
X_API_KEY = "your_x_api_key"
X_API_SECRET = "your_x_api_secret"
X_ACCESS_TOKEN = "your_x_access_token"
X_ACCESS_TOKEN_SECRET = "your_x_access_token_secret"

SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "your_service_role_key"

OPENAI_API_KEY = "your_openai_key"
OPENAI_MODEL = "gpt-5-mini"
```

Optional broker credentials can still be entered in the UI. Scheduled workers use GitHub secrets instead.

## GitHub Actions Secrets

Required for automation:

```text
FRED_API_KEY
DISCORD_WEBHOOK_URL
APP_URL
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
BROKER_PROVIDER
ALPACA_API_KEY
ALPACA_SECRET_KEY
ALPACA_MODE
COINBASE_API_KEY
COINBASE_API_SECRET
COINBASE_MODE
EXECUTION_TICKERS
ACCOUNT_SIZE
MAX_POSITION_NOTIONAL
DAILY_LOSS_LIMIT_PCT
COOLDOWN_MINUTES
AUTO_HARVEST
```

## Deployments

Current deployment model:

- Streamlit Cloud
- GitHub Actions
- Supabase
- Discord webhook
- optional X posting
- optional LinkedIn page posting

Current workflow:

- hourly signal worker
- every 15 minutes execution worker
- weekday report worker
- daily LinkedIn worker

Defined in:

- [.github/workflows/heartbeat.yml](/Users/tonysoprano/Documents/New%20project/.github/workflows/heartbeat.yml)

X publishing notes:

- The signal worker can post a TELAJ market-pulse thread to X when all four X credentials are configured.
- It uses app-owned credentials with OAuth 1.0a:
  - `X_API_KEY`
  - `X_API_SECRET`
  - `X_ACCESS_TOKEN`
  - `X_ACCESS_TOKEN_SECRET`
- Discord and X can run together, or the worker can publish to X without Discord.

LinkedIn publishing notes:

- The LinkedIn worker posts one TELAJ update per day using the LinkedIn Posts API.
- Required env vars:
  - `LINKEDIN_ACCESS_TOKEN`
  - `LINKEDIN_ORGANIZATION_URN`
- Optional env vars:
  - `LINKEDIN_VERSION` default `202601`
  - `LINKEDIN_POST_TIMEZONE` default `Europe/Rome`
  - `LINKEDIN_DRY_RUN` set to `true` to validate formatting without publishing
- The worker keeps a small local `.state` guard so the scheduled job does not publish more than once per local day unless forced manually.

## Known Constraints

- `learning_machine/interface.py` is still the main coupling point
- broker credentials are still session-oriented in Streamlit
- Coinbase sandbox is not fully wired in the official SDK path
- experiment tracking is still more local than ledger/signal storage
- README naming historically lags behind the newer TELAJ/Guru product direction

## Migration Docs

- [architecture.md](/Users/tonysoprano/Documents/New%20project/architecture.md)
- [telaj_migration_plan.md](/Users/tonysoprano/Documents/New%20project/telaj_migration_plan.md)
- [data_contracts.md](/Users/tonysoprano/Documents/New%20project/data_contracts.md)
- [onboarding_flow.md](/Users/tonysoprano/Documents/New%20project/onboarding_flow.md)
- [feature_flags.md](/Users/tonysoprano/Documents/New%20project/feature_flags.md)

## Recommended Next Steps

1. Commit the extracted `domain/` and `services/` files as the new baseline.
2. Add read-only API routes for planning, board, briefing, media, and scenarios.
3. Move more read-only logic out of `interface.py`.
4. Keep broker execution behind Streamlit/workers until auth and user isolation are ready.
