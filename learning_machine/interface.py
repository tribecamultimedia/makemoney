from __future__ import annotations

from datetime import date
from time import time

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from stable_baselines3 import PPO

try:
    from .backtest import run_backtest
    from .data import DataConfig, DataPipeline
    from .env import EnvironmentConfig, TradingEnvironment
    from .features import FeatureFactory
    from .notifications import DiscordNotifier
    from .sentiment import SimulatedNewsFeed
except ImportError:
    from learning_machine.backtest import run_backtest
    from learning_machine.data import DataConfig, DataPipeline
    from learning_machine.env import EnvironmentConfig, TradingEnvironment
    from learning_machine.features import FeatureFactory
    from learning_machine.notifications import DiscordNotifier
    from learning_machine.sentiment import SimulatedNewsFeed


DEFAULT_TICKERS = ("SPY", "QQQ")
DEFAULT_APP_URL = "http://localhost:8502"


def main() -> None:
    st.set_page_config(
        page_title="The Money Guru",
        page_icon="💰",
        layout="wide",
        initial_sidebar_state="collapsed",
    )
    _inject_styles()

    secrets = _require_secrets()
    if secrets is None:
        return

    fred_api_key, discord_webhook, app_url = secrets
    notifier = DiscordNotifier(webhook_url=discord_webhook, app_url=app_url)

    _render_header()

    controls = _render_controls()
    if controls is None:
        return
    selected_tickers, start_date, end_date, practice_mode, initial_cash = controls

    snapshot = load_market_snapshot(
        ticker=selected_tickers[0],
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
        fred_api_key=fred_api_key,
    )
    regime = _classify_market_regime(snapshot)
    _render_pulse(regime)
    _render_insight(regime)

    headless_mode = bool(st.query_params.get("headless", "0") == "1")
    auto_pulse = bool(st.query_params.get("autopulse", "0") == "1")

    if headless_mode:
        _run_headless_cycle(
            regime=regime,
            notifier=notifier,
            tickers=selected_tickers,
        )
        st.success("Headless check completed.")
        return

    if auto_pulse:
        _auto_regime_fragment(regime=regime, notifier=notifier, tickers=selected_tickers)

    run_button = st.button("Run The Guru", type="primary", use_container_width=True)
    if not run_button:
        st.info("Tap `Run The Guru` to refresh the AI view.")
        return

    with st.spinner("The Guru is reading the market and preparing a calm view..."):
        results = {}
        learning_rate, timesteps, slippage_bps = _advanced_settings()
        for ticker in selected_tickers:
            prepared = load_prepared_data(
                ticker=ticker,
                start_date=start_date.isoformat(),
                end_date=end_date.isoformat(),
                fred_api_key=fred_api_key,
            )
            results[ticker] = run_ticker_workflow(
                ticker=ticker,
                prepared=prepared,
                timesteps=timesteps,
                slippage_bps=slippage_bps,
                initial_cash=initial_cash,
                learning_rate=learning_rate,
                notifier=notifier,
            )

    _render_dashboard(
        results=results,
        regime=regime,
        initial_cash=initial_cash,
        practice_mode=practice_mode,
    )


@st.fragment(run_every="60m")
def _auto_regime_fragment(
    *,
    regime: dict[str, object],
    notifier: DiscordNotifier,
    tickers: tuple[str, ...],
) -> None:
    _run_headless_cycle(regime=regime, notifier=notifier, tickers=tickers)


@st.cache_data(show_spinner=False, ttl=3600)
def load_market_snapshot(
    *,
    ticker: str,
    start_date: str,
    end_date: str,
    fred_api_key: str,
) -> pd.Series:
    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(start=start_date, end=end_date, tickers=(ticker,)),
    )
    market = pipeline.build_dataset()[ticker]
    return market.iloc[-1]


@st.cache_data(show_spinner=False, ttl=3600)
def load_prepared_data(
    *,
    ticker: str,
    start_date: str,
    end_date: str,
    fred_api_key: str,
) -> dict[str, pd.DataFrame | list[str]]:
    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(start=start_date, end=end_date, tickers=(ticker,)),
    )
    market = pipeline.build_dataset()[ticker]
    sentiment = SimulatedNewsFeed().generate(market.index, ticker)
    features = FeatureFactory().transform(market, sentiment=sentiment)
    feature_columns = [column for column in features.columns if column != "close"]
    return {
        "market": market,
        "features": features,
        "feature_columns": feature_columns,
    }


def run_ticker_workflow(
    *,
    ticker: str,
    prepared: dict[str, pd.DataFrame | list[str]],
    timesteps: int,
    slippage_bps: float,
    initial_cash: float,
    learning_rate: float,
    notifier: DiscordNotifier,
) -> dict[str, object]:
    features = prepared["features"]
    feature_columns = prepared["feature_columns"]
    market = prepared["market"]
    assert isinstance(features, pd.DataFrame)
    assert isinstance(feature_columns, list)
    assert isinstance(market, pd.DataFrame)

    env = TradingEnvironment(
        data=features,
        feature_columns=feature_columns,
        config=EnvironmentConfig(
            initial_cash=initial_cash,
            execution_slippage_bps=slippage_bps,
        ),
    )
    model = PPO("MlpPolicy", env, verbose=0, seed=42, learning_rate=learning_rate)
    model.learn(total_timesteps=timesteps)

    def policy(row: pd.Series, context: dict[str, float]) -> int:
        observation = np.concatenate(
            [
                row[feature_columns].to_numpy(dtype=np.float32),
                np.array(
                    [context["position"], context["cash_ratio"], context["equity_ratio"]],
                    dtype=np.float32,
                ),
            ]
        )
        action, _ = model.predict(observation, deterministic=True)
        return int(action)

    def guru_reason(row: pd.Series, signal: int, context: dict[str, float]) -> str:
        return _signal_reason(
            row=row,
            action="BUY" if signal == 1 else "PROTECT",
            already_in_position=bool(context["position"]),
        )

    backtest = run_backtest(
        features,
        signal_fn=policy,
        initial_cash=initial_cash,
        slippage_bps=slippage_bps,
        asset_name=ticker,
        notifier=notifier,
        reason_fn=guru_reason,
    )

    return {
        "market": market,
        "features": features,
        "backtest": backtest,
        "summary": _summarize_backtest(backtest, initial_cash),
        "trade_log": _build_trade_log(backtest),
    }


def _render_header() -> None:
    st.markdown("<div class='hero-eyebrow'>THE MONEY GURU</div>", unsafe_allow_html=True)
    st.markdown("<div class='hero-title'>Calm AI Guidance For Beginner Traders</div>", unsafe_allow_html=True)
    st.markdown(
        "<div class='hero-copy'>One clear market pulse, one plain-English explanation, and one clean action path.</div>",
        unsafe_allow_html=True,
    )


def _render_controls() -> tuple[tuple[str, ...], date, date, bool, float] | None:
    config = DataConfig()

    with st.container():
        col1, col2 = st.columns([1.2, 1.0])
        with col1:
            selected_tickers = tuple(
                st.segmented_control(
                    "Assets to watch",
                    options=list(DEFAULT_TICKERS),
                    default=list(DEFAULT_TICKERS),
                    selection_mode="multi",
                )
                or list(DEFAULT_TICKERS)
            )
        with col2:
            practice_mode = st.toggle("Practice Mode", value=True, help="Simulate a starter account.")

    with st.container():
        col1, col2 = st.columns(2)
        with col1:
            start_date = st.date_input("Start date", value=date.fromisoformat(config.start))
        with col2:
            end_date = st.date_input("End date", value=date.fromisoformat(config.end))

    initial_cash = float(
        st.select_slider(
            "Starting account size",
            options=[1000.0, 5000.0, 10000.0, 25000.0, 100000.0],
            value=1000.0 if practice_mode else 100000.0,
            format_func=lambda value: f"${value:,.0f}",
        )
    )

    if not selected_tickers:
        st.warning("Pick at least one asset.")
        return None
    if start_date > end_date:
        st.error("The start date must be before the end date.")
        return None
    return selected_tickers, start_date, end_date, practice_mode, initial_cash


def _advanced_settings() -> tuple[float, int, float]:
    with st.expander("⚙️ Advanced AI Calibration (Experts Only)", expanded=False):
        timesteps = st.slider("PPO Timesteps", min_value=1_000, max_value=30_000, value=5_000, step=1_000)
        learning_rate = st.select_slider(
            "Learning Rate",
            options=[0.0001, 0.0003, 0.0005, 0.001],
            value=0.0003,
            format_func=lambda value: f"{value:.4f}",
        )
        slippage_bps = st.slider("Trading Friction (bps)", min_value=0.0, max_value=50.0, value=10.0, step=0.5)
    return float(learning_rate), int(timesteps), float(slippage_bps)


def _render_pulse(regime: dict[str, object]) -> None:
    pulse_col, text_col = st.columns([1.0, 1.2])
    with pulse_col:
        st.plotly_chart(_build_pulse_gauge(regime), use_container_width=True, config={"displayModeBar": False})
    with text_col:
        st.markdown("<div class='insight-label'>The Guru's Market Pulse</div>", unsafe_allow_html=True)
        st.markdown(f"<div class='pulse-headline'>{regime['label']}</div>", unsafe_allow_html=True)
        st.markdown(f"<div class='pulse-copy'>{regime['message']}</div>", unsafe_allow_html=True)


def _render_insight(regime: dict[str, object]) -> None:
    st.markdown(
        f"""
        <div class='insight-card'>
            <div class='insight-title'>Why is the Guru saying this?</div>
            <div class='insight-copy'>{regime['why']}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _render_dashboard(
    *,
    results: dict[str, dict[str, object]],
    regime: dict[str, object],
    initial_cash: float,
    practice_mode: bool,
) -> None:
    if len(results) > 1:
        st.plotly_chart(_build_comparison_chart(results, initial_cash), use_container_width=True)

    for ticker, result in results.items():
        _render_ticker_section(ticker, result, initial_cash, practice_mode, regime)


def _render_ticker_section(
    ticker: str,
    result: dict[str, object],
    initial_cash: float,
    practice_mode: bool,
    regime: dict[str, object],
) -> None:
    backtest = result["backtest"]
    summary = result["summary"]
    features = result["features"]
    trade_log = result["trade_log"]
    assert isinstance(backtest, pd.DataFrame)
    assert isinstance(summary, dict)
    assert isinstance(features, pd.DataFrame)
    assert isinstance(trade_log, pd.DataFrame)

    st.markdown(f"<div class='ticker-chip'>{ticker}</div>", unsafe_allow_html=True)
    kpi1, kpi2, kpi3 = st.columns(3)
    kpi1.metric("Latest value", f"${summary['final_equity']:,.2f}")
    kpi2.metric("Return", f"{summary['total_return']:.2f}%")
    kpi3.metric("Signals", f"{summary['trade_count']}")

    if practice_mode:
        practice_balance = 1000.0 * (summary["final_equity"] / initial_cash)
        st.markdown(
            f"""
            <div class='practice-card'>
                <div class='practice-label'>Practice Mode Balance</div>
                <div class='practice-value'>${practice_balance:,.2f}</div>
                <div class='practice-copy'>This simulates what a beginner would have seen with a virtual $1,000 account.</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.plotly_chart(_build_sparkline_chart(features, backtest, ticker), use_container_width=True)

    latest_action = "BUY" if int(backtest["signal"].iloc[-1]) == 1 else "PROTECT"
    latest_reason = _signal_reason(backtest.iloc[-1], latest_action, already_in_position=latest_action == "PROTECT")
    st.markdown(
        f"""
        <div class='signal-card'>
            <div class='signal-title'>Current Guidance</div>
            <div class='signal-action'>{latest_action}</div>
            <div class='signal-copy'>{latest_reason}</div>
            <div class='signal-note'>{regime['note']}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    with st.expander(f"{ticker} signal history"):
        st.dataframe(trade_log, use_container_width=True)


def _classify_market_regime(snapshot: pd.Series) -> dict[str, object]:
    yield_curve = float(snapshot.get("yield_curve_10y_2y", 0.0))
    inflation = float(snapshot.get("inflation_yoy", 0.0))

    if yield_curve < 0:
        return {
            "state": "red",
            "score": 20,
            "label": "High Risk",
            "message": "The Guru says conditions are defensive right now. Staying in cash is safer.",
            "why": "The economy is cooling down, which historically makes it safer to protect cash before chasing growth.",
            "note": "When the curve inverts, patience usually beats forcing trades.",
        }
    if inflation > 3.5:
        return {
            "state": "yellow",
            "score": 52,
            "label": "Cautious",
            "message": "The Guru says the market may still move higher, but swings could be rough.",
            "why": "Prices in the economy are still running hot, which can make stock moves less stable in the short term.",
            "note": "A cautious tone means smaller exposure and more patience.",
        }
    return {
        "state": "green",
        "score": 82,
        "label": "Safe / Growing",
        "message": "The Guru says the market backdrop looks supportive for growth.",
        "why": "The economy looks steady enough that stocks have room to grow without heavy stress from macro signals.",
        "note": "A healthy pulse means the model can lean into upside instead of pure defense.",
    }


def _build_pulse_gauge(regime: dict[str, object]) -> go.Figure:
    colors = {"green": "#22C55E", "yellow": "#F59E0B", "red": "#EF4444"}
    fig = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=float(regime["score"]),
            number={"suffix": "/100", "font": {"color": "#F8E7A1", "size": 28}},
            title={"text": "The Guru's Market Pulse", "font": {"color": "#F8F1C8", "size": 20}},
            gauge={
                "axis": {"range": [0, 100], "tickcolor": "#8A7A44"},
                "bar": {"color": colors[str(regime["state"])]},
                "bgcolor": "#101010",
                "steps": [
                    {"range": [0, 33], "color": "#301010"},
                    {"range": [33, 66], "color": "#3B2B12"},
                    {"range": [66, 100], "color": "#102416"},
                ],
            },
        )
    )
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=10, r=10, t=50, b=10),
        height=260,
    )
    return fig


def _build_sparkline_chart(features: pd.DataFrame, backtest: pd.DataFrame, ticker: str) -> go.Figure:
    signal = backtest["signal"].astype(float)
    signal_delta = signal.diff().fillna(signal)
    entries = backtest[(signal == 1) & (signal_delta > 0)]
    exits = backtest[(signal == 0) & (signal_delta < 0)]

    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=features.index,
            y=features["close"],
            mode="lines",
            line=dict(color="#D4AF37", width=3),
            name=ticker,
        )
    )
    if not entries.empty:
        fig.add_trace(
            go.Scatter(
                x=entries.index,
                y=entries["close"],
                mode="markers+text",
                text=["Buy"] * len(entries),
                textposition="top center",
                marker=dict(symbol="diamond", size=12, color="#22C55E"),
                name="Buy",
            )
        )
    if not exits.empty:
        fig.add_trace(
            go.Scatter(
                x=exits.index,
                y=exits["close"],
                mode="markers+text",
                text=["Protect"] * len(exits),
                textposition="bottom center",
                marker=dict(symbol="diamond", size=12, color="#EF4444"),
                name="Protect",
            )
        )

    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#0B0B0F",
        title=f"{ticker} Trend",
        height=260,
        margin=dict(l=10, r=10, t=40, b=10),
        xaxis=dict(showgrid=False, showticklabels=False, zeroline=False),
        yaxis=dict(showgrid=False, zeroline=False),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="left", x=0),
    )
    return fig


def _build_comparison_chart(results: dict[str, dict[str, object]], initial_cash: float) -> go.Figure:
    palette = {"SPY": "#D4AF37", "QQQ": "#60A5FA"}
    fig = go.Figure()
    for ticker, result in results.items():
        backtest = result["backtest"]
        assert isinstance(backtest, pd.DataFrame)
        fig.add_trace(
            go.Scatter(
                x=backtest.index,
                y=backtest["equity"] / initial_cash,
                mode="lines",
                line=dict(width=3, color=palette.get(ticker, "#F8F1C8")),
                name=ticker,
            )
        )
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#0B0B0F",
        title="Practice Growth",
        height=240,
        margin=dict(l=10, r=10, t=40, b=10),
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=False, title="Growth"),
    )
    return fig


def _build_trade_log(backtest: pd.DataFrame) -> pd.DataFrame:
    signal = backtest["signal"].astype(float)
    changes = signal.diff().fillna(signal) != 0
    trade_log = backtest.loc[changes, ["close", "signal", "equity"]].copy()
    trade_log["action"] = np.where(trade_log["signal"] == 1, "BUY", "PROTECT")
    trade_log["guru_reason"] = [
        _signal_reason(backtest.loc[index], action, already_in_position=action == "PROTECT")
        for index, action in zip(trade_log.index, trade_log["action"])
    ]
    trade_log = trade_log.rename(columns={"close": "price"})
    return trade_log[["action", "price", "equity", "guru_reason"]]


def _signal_reason(row: pd.Series, action: str, already_in_position: bool) -> str:
    sentiment = float(row.get("sentiment_score", 0.0))
    yield_curve = float(row.get("yield_curve_10y_2y", 0.0))
    inflation = float(row.get("inflation_yoy", 0.0))

    if action == "BUY":
        if sentiment > 0 and yield_curve >= 0:
            return "The Guru sees supportive market tone and a steadier economy, so buying makes sense for beginners."
        return "The Guru sees enough upside momentum to try a careful entry."
    if already_in_position and (yield_curve < 0 or inflation > 3.5):
        return "The Guru is protecting your account because macro risk is rising."
    return "The Guru is moving to protection mode while the trend cools down."


def _summarize_backtest(backtest: pd.DataFrame, initial_cash: float) -> dict[str, float | int]:
    final_equity = float(backtest["equity"].iloc[-1])
    total_return = (final_equity / initial_cash - 1.0) * 100.0
    max_drawdown = float(backtest["drawdown"].max() * 100.0)
    signal_delta = backtest["signal"].diff().fillna(backtest["signal"])
    trade_count = int((signal_delta != 0).sum())
    return {
        "final_equity": final_equity,
        "total_return": total_return,
        "max_drawdown": max_drawdown,
        "trade_count": trade_count,
    }


def _require_secrets() -> tuple[str, str, str] | None:
    missing: list[str] = []
    try:
        fred_api_key = str(st.secrets["FRED_API_KEY"])
    except Exception:
        fred_api_key = ""
        missing.append("FRED_API_KEY")
    try:
        discord_webhook = str(st.secrets["DISCORD_WEBHOOK_URL"])
    except Exception:
        discord_webhook = ""
        missing.append("DISCORD_WEBHOOK_URL")
    app_url = str(st.secrets.get("APP_URL", DEFAULT_APP_URL))

    if missing:
        st.error(
            "The app is missing required secrets: "
            + ", ".join(missing)
            + ". Add them to `.streamlit/secrets.toml` or Streamlit Cloud."
        )
        return None
    return fred_api_key, discord_webhook, app_url


@st.cache_resource
def _regime_memory() -> dict[str, object]:
    return {"label": None, "ts": 0.0}


def _run_headless_cycle(
    *,
    regime: dict[str, object],
    notifier: DiscordNotifier,
    tickers: tuple[str, ...],
) -> None:
    memory = _regime_memory()
    current_label = str(regime["label"])
    previous_label = memory.get("label")
    last_ts = float(memory.get("ts", 0.0))
    now = time()

    if current_label != previous_label and now - last_ts >= 3600:
        notifier.send_regime_change(
            tickers=tickers,
            label=current_label,
            message=str(regime["message"]),
            reason=str(regime["why"]),
        )
        memory["label"] = current_label
        memory["ts"] = now


def _inject_styles() -> None:
    st.markdown(
        """
        <style>
            :root {
                --bg: #05060a;
                --panel: #0f1117;
                --panel-2: #151823;
                --gold: #d4af37;
                --gold-soft: #f5deb3;
                --text: #f8f1c8;
                --muted: #bcae79;
                --border: rgba(212, 175, 55, 0.22);
            }
            .stApp {
                background:
                    radial-gradient(circle at top right, rgba(212, 175, 55, 0.12), transparent 28%),
                    linear-gradient(180deg, #06070c 0%, #0b0d14 100%);
                color: var(--text);
            }
            .block-container {
                max-width: 1100px;
                padding-top: 1.2rem;
                padding-bottom: 4rem;
            }
            .hero-eyebrow {
                color: var(--gold);
                font-size: 0.85rem;
                letter-spacing: 0.24rem;
                text-transform: uppercase;
                margin-bottom: 0.5rem;
            }
            .hero-title {
                color: var(--text);
                font-size: 2.7rem;
                font-weight: 700;
                line-height: 1.05;
                margin-bottom: 0.45rem;
            }
            .hero-copy {
                color: var(--muted);
                font-size: 1.05rem;
                margin-bottom: 1.2rem;
                max-width: 720px;
            }
            .insight-label {
                color: var(--gold);
                font-size: 0.82rem;
                letter-spacing: 0.18rem;
                text-transform: uppercase;
                margin-bottom: 0.5rem;
            }
            .pulse-headline {
                color: var(--text);
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 0.45rem;
            }
            .pulse-copy {
                color: var(--muted);
                font-size: 1rem;
            }
            .insight-card, .practice-card, .signal-card {
                background: linear-gradient(180deg, rgba(21,24,35,0.95), rgba(15,17,23,0.98));
                border: 1px solid var(--border);
                border-radius: 22px;
                padding: 1rem 1.1rem;
                margin: 0.8rem 0 1rem;
                box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28);
            }
            .insight-title, .signal-title {
                color: var(--gold);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.12rem;
                margin-bottom: 0.45rem;
            }
            .insight-copy, .signal-copy {
                color: var(--text);
                font-size: 1.15rem;
                line-height: 1.45;
            }
            .practice-label {
                color: var(--gold);
                text-transform: uppercase;
                letter-spacing: 0.12rem;
                font-size: 0.84rem;
                margin-bottom: 0.4rem;
            }
            .practice-value {
                color: var(--text);
                font-size: 2rem;
                font-weight: 700;
            }
            .practice-copy, .signal-note {
                color: var(--muted);
                margin-top: 0.35rem;
            }
            .signal-action {
                color: var(--gold-soft);
                font-size: 1.6rem;
                font-weight: 700;
                margin-bottom: 0.35rem;
            }
            .ticker-chip {
                display: inline-block;
                border-radius: 999px;
                padding: 0.45rem 0.9rem;
                background: rgba(212, 175, 55, 0.12);
                border: 1px solid var(--border);
                color: var(--text);
                font-weight: 700;
                margin-top: 1.1rem;
                margin-bottom: 0.75rem;
            }
            .stButton > button {
                min-height: 48px;
                border-radius: 14px;
                font-weight: 700;
                border: 1px solid rgba(212, 175, 55, 0.32);
            }
            [data-testid="stMetric"] {
                background: rgba(255,255,255,0.02);
                border: 1px solid var(--border);
                border-radius: 18px;
                padding: 0.8rem 1rem;
            }
            [data-testid="stMetricLabel"] {
                color: var(--muted);
            }
            [data-testid="stSidebar"] {
                background: #090b10;
            }
            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2.1rem;
                }
                .block-container {
                    padding-left: 0.9rem;
                    padding-right: 0.9rem;
                }
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
