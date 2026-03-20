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
