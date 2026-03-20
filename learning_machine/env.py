from __future__ import annotations

from dataclasses import dataclass

import gymnasium as gym
import numpy as np
import pandas as pd
from gymnasium import spaces

from .risk import CircuitBreaker


@dataclass(slots=True)
class EnvironmentConfig:
    initial_cash: float = 100_000.0
    trading_fee_bps: float = 10.0
    execution_slippage_bps: float = 0.0
    reward_scale: float = 1.0


class TradingEnvironment(gym.Env[np.ndarray, int]):
    """
    PPO-friendly single-asset environment.

    Actions:
    - 0: flat
    - 1: long
    """

    metadata = {"render_modes": ["human"]}

    def __init__(
        self,
        data: pd.DataFrame,
        feature_columns: list[str],
        circuit_breaker: CircuitBreaker | None = None,
        config: EnvironmentConfig | None = None,
    ) -> None:
        super().__init__()
        self.data = data.reset_index(drop=False)
        self.data = self.data.rename(columns={self.data.columns[0]: "date"})
        self.feature_columns = feature_columns
        self.circuit_breaker = circuit_breaker or CircuitBreaker()
        self.config = config or EnvironmentConfig()

        self.action_space = spaces.Discrete(2)
        self.observation_space = spaces.Box(
            low=-np.inf,
            high=np.inf,
            shape=(len(self.feature_columns) + 3,),
            dtype=np.float32,
        )
        self.reset()

    def reset(self, *, seed: int | None = None, options: dict | None = None):
        super().reset(seed=seed)
        self.current_step = 1
        self.cash = self.config.initial_cash
        self.position = 0
        self.shares = 0.0
        self.equity = self.config.initial_cash
        self.previous_equity = self.config.initial_cash
        self.circuit_breaker.reset()
        observation = self._get_observation()
        return observation, {}

    def step(self, action: int):
        if self.circuit_breaker.halted:
            observation = self._get_observation()
            return observation, 0.0, True, True, {"halted": True}

        prev_close = float(self.data.loc[self.current_step - 1, "close"])
        current_close = float(self.data.loc[self.current_step, "close"])

        target_position = int(action)
        trade_cost = 0.0
        if target_position != self.position:
            if self.position == 1:
                execution_price = self._apply_slippage(current_close, side="sell")
                gross_value = self.shares * execution_price
                trade_cost = gross_value * (self.config.trading_fee_bps / 10_000.0)
                self.cash += gross_value - trade_cost
                self.shares = 0.0
            elif target_position == 1:
                execution_price = self._apply_slippage(current_close, side="buy")
                trade_cost = self.cash * (self.config.trading_fee_bps / 10_000.0)
                deployable_cash = max(self.cash - trade_cost, 0.0)
                self.shares = deployable_cash / execution_price if execution_price else 0.0
                self.cash -= deployable_cash + trade_cost
            self.position = target_position

        if self.position == 1 and self.shares == 0.0:
            self.shares = self.cash / current_close if current_close else 0.0
            self.cash = 0.0

        self.equity = self.cash + self.shares * current_close
        halted = self.circuit_breaker.update(self.equity / self.config.initial_cash)
        reward = ((self.equity - self.previous_equity) - trade_cost) / self.config.initial_cash
        reward *= self.config.reward_scale
        self.previous_equity = self.equity

        self.current_step += 1
        terminated = self.current_step >= len(self.data) - 1
        truncated = halted
        observation = self._get_observation()
        info = {
            "date": self.data.loc[self.current_step - 1, "date"],
            "equity": self.equity,
            "position": self.position,
            "daily_return": 0.0 if prev_close == 0 else (current_close / prev_close) - 1.0,
            "halted": halted,
        }
        return observation, float(reward), terminated, truncated, info

    def render(self):
        return {
            "step": self.current_step,
            "equity": self.equity,
            "position": self.position,
        }

    def _get_observation(self) -> np.ndarray:
        row = self.data.loc[self.current_step, self.feature_columns]
        position_state = np.array(
            [
                float(self.position),
                self.cash / self.config.initial_cash,
                self.equity / self.config.initial_cash,
            ]
        )
        return np.concatenate([row.to_numpy(dtype=np.float32), position_state]).astype(np.float32)

    def _apply_slippage(self, execution_price: float, side: str) -> float:
        slippage = self.config.execution_slippage_bps / 10_000.0
        if side == "buy":
            return execution_price * (1.0 + slippage)
        return execution_price * (1.0 - slippage)
