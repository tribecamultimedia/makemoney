# Learning Machine

Modular reinforcement-learning research stack for trading `SPY` and `QQQ` with:

- `yfinance` OHLCV ingestion
- FRED macro data joins
- Custom `FeatureFactory`
- PPO-compatible `gymnasium` environment
- Session-level drawdown circuit breaker
- Slippage-aware backtest loop

## Architecture

1. `learning_machine.data.DataPipeline`
   - Pulls OHLCV from Yahoo Finance.
   - Pulls macro series from FRED and forward-fills them to market dates.
2. `learning_machine.features.FeatureFactory`
   - Computes fractional differentiation, volatility-scaled RSI, Bollinger width, realized vol, and return features.
3. `learning_machine.sentiment.SimulatedNewsFeed`
   - Seeds a synthetic daily sentiment signal from a current macro/news snapshot.
4. `learning_machine.risk.CircuitBreaker`
   - Stops trading for the session if drawdown breaches 5%.
5. `learning_machine.env.TradingEnvironment`
   - Discrete-action PPO environment with portfolio accounting and risk hooks.
6. `learning_machine.backtest.run_backtest`
   - Replays the environment policy with 10 bps slippage.

## Quick start

```bash
uv sync
uv run python -m learning_machine.main
```

## Sovereign AI Cloud Stack

The repo now includes a cloud-ready paper-trading control loop:

- `learning_machine.signal_worker`
  - Runs on a schedule, computes the macro pulse, and pushes Discord alerts only when the regime changes.
- `learning_machine.execution_worker`
  - Runs during market hours, reads the latest macro state, checks broker risk limits, and places paper trades for the core assets.
- `learning_machine.report_worker`
  - Publishes a daily Discord summary from the saved ledger and equity curve.
- `learning_machine.ledger`
  - Persists trade events and portfolio equity snapshots under `.state/`.
- `learning_machine.interface`
  - Streamlit dashboard showing pulse, broker state, equity curve, and recent paper-trade history.

## Streamlit Secrets

Set these in Streamlit Community Cloud or in `.streamlit/secrets.toml` for local testing:

```toml
FRED_API_KEY = "your_fred_key"
DISCORD_WEBHOOK_URL = "your_discord_webhook"
APP_URL = "https://your-app-url.streamlit.app"
```

## GitHub Actions Secrets

Set these in `Settings -> Secrets and variables -> Actions` so the scheduled workers can run:

```text
FRED_API_KEY
DISCORD_WEBHOOK_URL
APP_URL
ALPACA_API_KEY
ALPACA_SECRET_KEY
ALPACA_MODE
ACCOUNT_SIZE
MAX_POSITION_NOTIONAL
DAILY_LOSS_LIMIT_PCT
COOLDOWN_MINUTES
AUTO_HARVEST
```

## Shared Storage

Local `.state` files still work, but the app and GitHub workers live on different machines. If you want one unified live feed and one shared track record, enable Supabase-backed storage.

1. Create a Supabase project.
2. Run [supabase/schema.sql](/Users/tonysoprano/Documents/New%20project/supabase/schema.sql) in the SQL editor.
3. Add these secrets to both Streamlit Cloud and GitHub Actions:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Once those secrets exist, the app and the workers will share:

- trade ledger
- equity curve
- latest saved signal

If those secrets are missing, the code falls back to local `.state` files.

Recommended small-account defaults:

```text
ALPACA_MODE=paper
ACCOUNT_SIZE=200
MAX_POSITION_NOTIONAL=50
DAILY_LOSS_LIMIT_PCT=0.03
COOLDOWN_MINUTES=60
AUTO_HARVEST=false
```

## Worker Schedule

The default workflow is in `.github/workflows/heartbeat.yml`:

- Every hour: macro pulse and Discord regime alert worker
- Every 15 minutes on weekdays: execution worker for paper/live broker sync
- 21:05 UTC on weekdays: daily report worker

The execution worker maintains target notional per symbol, so repeated `BUY` signals will not keep stacking the same position every cycle once the target allocation is already in place.
