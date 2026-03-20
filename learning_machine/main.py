from __future__ import annotations

import os

from stable_baselines3 import PPO

from .backtest import run_backtest
from .data import DataPipeline
from .env import EnvironmentConfig, TradingEnvironment
from .features import FeatureFactory
from .sentiment import SimulatedNewsFeed


def main() -> None:
    pipeline = DataPipeline(fred_api_key=os.getenv("FRED_API_KEY"))
    datasets = pipeline.build_dataset()
    feature_factory = FeatureFactory()
    sentiment_feed = SimulatedNewsFeed()

    for ticker, frame in datasets.items():
        sentiment = sentiment_feed.generate(frame.index, ticker)
        features = feature_factory.transform(frame, sentiment=sentiment)
        feature_columns = [
            column
            for column in features.columns
            if column not in {"close"}
        ]
        env = TradingEnvironment(
            data=features,
            feature_columns=feature_columns,
            config=EnvironmentConfig(execution_slippage_bps=10.0),
        )
        model = PPO("MlpPolicy", env, verbose=0)
        model.learn(total_timesteps=5_000)

        def policy(row, context):
            observation = row[feature_columns].to_numpy(dtype="float32")
            observation = observation.tolist() + [
                context["position"],
                context["cash_ratio"],
                context["equity_ratio"],
            ]
            action, _ = model.predict(observation, deterministic=True)
            return int(action)

        backtest = run_backtest(
            features,
            signal_fn=policy,
            slippage_bps=10.0,
        )
        print(
            ticker,
            {
                "final_equity": round(float(backtest["equity"].iloc[-1]), 2),
                "max_drawdown": round(float(backtest["drawdown"].max()), 4),
            },
        )


if __name__ == "__main__":
    main()
