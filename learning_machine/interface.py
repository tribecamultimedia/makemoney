from __future__ import annotations

from datetime import date
from time import time

import pandas as pd
import streamlit as st

try:
    from .data import DataConfig, DataPipeline
    from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker
    from .notifications import DiscordNotifier
    from .signal_worker import latest_state_payload
    from .trade_manager import TradeManager
except ImportError:
    from learning_machine.data import DataConfig, DataPipeline
    from learning_machine.execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker
    from learning_machine.notifications import DiscordNotifier
    from learning_machine.signal_worker import latest_state_payload
    from learning_machine.trade_manager import TradeManager


APP_NAME = "Sovereign AI"
DEFAULT_TICKERS = ("SPY", "QQQ")
DEFAULT_APP_URL = "https://makemoneywithtommy.streamlit.app"


def main() -> None:
    st.set_page_config(
        page_title=APP_NAME,
        page_icon="◉",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    _inject_styles()
    secrets = _require_secrets()
    if secrets is None:
        return

    fred_api_key, discord_webhook, app_url = secrets
    notifier = DiscordNotifier(webhook_url=discord_webhook, username="Sovereign AI", app_url=app_url)
    _init_broker_state()

    st.markdown("<div class='hero-kicker'>SOVEREIGN AI</div>", unsafe_allow_html=True)
    st.markdown("<div class='hero-title'>Institutional Macro Intelligence For Retail Capital</div>", unsafe_allow_html=True)
    st.markdown(
        "<div class='hero-copy'>A BlackRock-style operating view for SPY and QQQ: macro pulse, execution sync, and defensive automation.</div>",
        unsafe_allow_html=True,
    )

    with st.sidebar:
        st.markdown("### Broker Link")
        api_key = st.text_input("Alpaca API Key", type="password")
        secret_key = st.text_input("Alpaca Secret Key", type="password")
        if st.button("Link Broker", use_container_width=True):
            st.session_state.broker_credentials = (
                BrokerCredentials(api_key=api_key, secret_key=secret_key, paper=True)
                if api_key and secret_key
                else None
            )
        st.caption("Keys live only in this browser session and disappear when the tab closes.")

        st.markdown("### Strategy Scope")
        selected_tickers = tuple(
            st.multiselect("Core positions", options=list(DEFAULT_TICKERS), default=list(DEFAULT_TICKERS))
        )
        config = DataConfig()
        start_date = st.date_input("Research start", value=date.fromisoformat(config.start))
        end_date = st.date_input("Research end", value=date.fromisoformat(config.end))
        practice_cash = st.select_slider(
            "Simulated capital",
            options=[1000.0, 5000.0, 10000.0, 25000.0, 100000.0],
            value=10000.0,
            format_func=lambda value: f"${value:,.0f}",
        )
        run_button = st.button("Refresh Sovereign Pulse", type="primary", use_container_width=True)

    if not selected_tickers:
        st.warning("Select at least one core position.")
        return
    if start_date > end_date:
        st.error("Research start must be before research end.")
        return

    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(start=start_date.isoformat(), end=end_date.isoformat(), tickers=selected_tickers),
    )

    regime_snapshot = load_regime_snapshot(
        fred_api_key=fred_api_key,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
        tickers=selected_tickers,
    )
    stress_snapshot = load_market_stress(
        fred_api_key=fred_api_key,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
        tickers=selected_tickers,
    )
    st.session_state.hourly_drawdown = float(stress_snapshot["hourly_drawdown"])
    pulse = _build_pulse(regime_snapshot, stress_snapshot)

    hero_col, vault_col = st.columns([1.4, 1.0])
    with hero_col:
        st.markdown(_render_donut_card(pulse), unsafe_allow_html=True)
    with vault_col:
        _render_vault(st.session_state.broker_credentials, selected_tickers)

    latest_signal = latest_state_payload()
    if latest_signal is not None:
        st.markdown(
            f"""
            <div class="glass-card">
                <div class="card-label">Latest Saved Signal</div>
                <div class="card-copy">{latest_signal['label']}</div>
                <div class="card-meta">{latest_signal['message']}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    insight_cols = st.columns(3)
    _glass_card(
        insight_cols[0],
        "Macro-Regime Narrator",
        regime_snapshot["narrative"],
        f"Yield curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f} | Inflation YoY: {float(regime_snapshot['inflation_yoy']):.2f}%",
    )
    _glass_card(
        insight_cols[1],
        "Global Circuit Breaker",
        "All accounts switch to PROTECT if the market drops 3% in an hour."
        if bool(stress_snapshot["triggered"])
        else "Hourly stress is contained. No emergency protective override is active.",
        f"Worst 1h SPY move: {float(stress_snapshot['hourly_drawdown']) * 100:.2f}%",
    )
    _glass_card(
        insight_cols[2],
        "Smart Rebalancing",
        _rebalance_message(pipeline),
        "Harvest gains from relative winners before concentration risk builds.",
    )

    with st.expander("Execution Intelligence", expanded=False):
        st.markdown(
            """
            - `Capital Preservation Mode`: cash-first defense.
            - `Tactical Accumulation`: scale in slowly.
            - `Risk-On Expansion`: maintain full core positions.
            """
        )

    if run_button:
        with st.spinner("Sovereign AI is recalculating the macro stack..."):
            signal_map = generate_signal_map(selected_tickers, pulse, practice_cash)
            _render_signal_cards(signal_map)
            _render_copy_trade_controls(signal_map, notifier, app_url)
            _render_test_signal(notifier, app_url)
            if stress_snapshot["triggered"]:
                notifier.send_regime_change(
                    tickers=selected_tickers,
                    label="Capital Preservation Mode",
                    message="Global circuit breaker engaged after a 3% hourly market drop.",
                    reason="Sovereign AI is toggling all linked accounts to PROTECT until stress cools.",
                )


@st.cache_data(ttl=3600, show_spinner=False)
def load_regime_snapshot(
    *,
    fred_api_key: str,
    start_date: str,
    end_date: str,
    tickers: tuple[str, ...],
) -> dict[str, float | str]:
    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(start=start_date, end=end_date, tickers=tickers),
    )
    return pipeline.regime_snapshot()


@st.cache_data(ttl=3600, show_spinner=False)
def load_market_stress(
    *,
    fred_api_key: str,
    start_date: str,
    end_date: str,
    tickers: tuple[str, ...],
) -> dict[str, float | bool]:
    pipeline = DataPipeline(
        fred_api_key=fred_api_key,
        config=DataConfig(start=start_date, end=end_date, tickers=tickers),
    )
    return pipeline.market_stress_signal()


def generate_signal_map(
    tickers: tuple[str, ...],
    pulse: dict[str, object],
    capital: float,
) -> dict[str, ExecutionSignal]:
    action = "BUY"
    confidence = float(pulse["score"]) / 100.0
    if pulse["mode"] == "capital_preservation":
        action = "PROTECT"
        confidence = 0.95

    per_ticker = capital / max(len(tickers), 1)
    signals: dict[str, ExecutionSignal] = {}
    for ticker in tickers:
        signals[ticker] = ExecutionSignal(
            symbol=ticker,
            action=action,
            confidence=confidence,
            reason=str(pulse["narrative"]),
            target_notional=per_ticker,
        )
    return signals


def _render_signal_cards(signal_map: dict[str, ExecutionSignal]) -> None:
    cols = st.columns(len(signal_map))
    for col, signal in zip(cols, signal_map.values()):
        action_class = "buy" if signal.action == "BUY" else "protect"
        col.markdown(
            f"""
            <div class="signal-card">
                <div class="card-label">{signal.symbol}</div>
                <div class="signal-action {action_class}">{signal.action}</div>
                <div class="card-copy">{signal.reason}</div>
                <div class="card-meta">Confidence: {signal.confidence * 100:.0f}% | Target notional: ${signal.target_notional:,.0f}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def _render_copy_trade_controls(signal_map: dict[str, ExecutionSignal], notifier: DiscordNotifier, app_url: str) -> None:
    st.markdown("### Broker Sync")
    if st.session_state.broker_credentials is None:
        st.info("Link an Alpaca paper account in the Vault to enable copy-trading.")
        return

    manager = TradeManager(st.session_state.broker_credentials)
    protect_override = bool(st.session_state.global_circuit_breaker.should_protect(float(st.session_state.hourly_drawdown)))
    if protect_override:
        st.error("Global Circuit Breaker is active. Sync is locked to PROTECT mode.")

    if st.button("SYNC WITH GURU", use_container_width=True):
        for signal in signal_map.values():
            live_signal = signal
            if protect_override:
                live_signal = ExecutionSignal(
                    symbol=signal.symbol,
                    action="PROTECT",
                    confidence=1.0,
                    reason="Global circuit breaker forced a defensive posture after a 3% hourly drop.",
                    target_notional=signal.target_notional,
                )
            try:
                result = manager.sync_with_signal(live_signal)
                if result["submitted"]:
                    notifier.send_signal(
                        asset_name=live_signal.symbol,
                        action=live_signal.action,
                        reason=live_signal.reason,
                        price=0.0,
                        timestamp=pd.Timestamp.utcnow(),
                    )
                    st.success(f"{live_signal.symbol}: order submitted.")
                else:
                    st.warning(f"{live_signal.symbol}: {result['reason']}")
            except Exception as exc:
                st.error(f"{live_signal.symbol}: {exc}")
        st.markdown(f"[Open live app]({app_url})")


def _render_test_signal(notifier: DiscordNotifier, app_url: str) -> None:
    st.markdown("### Discord Testing")
    if st.button("Send Test Discord Signal", use_container_width=True):
        success = notifier.send_signal(
            asset_name="SOVEREIGN TEST",
            action="BUY",
            reason="This is a manual test signal from the dashboard to confirm Discord delivery.",
            price=0.0,
            timestamp=pd.Timestamp.utcnow(),
        )
        if success:
            st.success(f"Test signal sent. Review Discord or open the app at {app_url}.")
        else:
            st.error("Test signal failed. Check the Discord webhook secret.")


def _build_pulse(regime_snapshot: dict[str, float | str], stress_snapshot: dict[str, float | bool]) -> dict[str, object]:
    mode = "risk_on_expansion"
    score = 84
    label = "Risk-On Expansion"
    narrative = str(regime_snapshot["narrative"])
    if bool(stress_snapshot["triggered"]) or str(regime_snapshot["state"]) == "capital_preservation":
        mode = "capital_preservation"
        score = 18
        label = "Capital Preservation Mode"
    elif str(regime_snapshot["state"]) == "tactical_accumulation":
        mode = "tactical_accumulation"
        score = 54
        label = "Tactical Accumulation"
    return {
        "mode": mode,
        "score": score,
        "label": label,
        "narrative": narrative,
        "message": _pulse_message(mode),
    }


def _pulse_message(mode: str) -> str:
    if mode == "capital_preservation":
        return "Cash is king while macro stress and market structure stay fragile."
    if mode == "tactical_accumulation":
        return "Scale in slowly while the market builds a stronger foundation."
    return "Core positions can stay fully engaged while macro conditions remain supportive."


def _render_donut_card(pulse: dict[str, object]) -> str:
    score = int(pulse["score"])
    circumference = 2 * 3.1416 * 52
    dash = circumference * (score / 100)
    color = "#19C37D"
    if pulse["mode"] == "capital_preservation":
        color = "#FF5A5F"
    elif pulse["mode"] == "tactical_accumulation":
        color = "#F4B942"
    return f"""
    <div class="hero-card">
        <div class="card-label">Pulse</div>
        <div class="hero-flex">
            <svg viewBox="0 0 140 140" class="donut">
                <circle cx="70" cy="70" r="52" class="donut-track"></circle>
                <circle cx="70" cy="70" r="52" class="donut-ring" stroke="{color}"
                    stroke-dasharray="{dash} {circumference - dash}" transform="rotate(-90 70 70)"></circle>
                <text x="70" y="66" text-anchor="middle" class="donut-score">{score}%</text>
                <text x="70" y="84" text-anchor="middle" class="donut-caption">Pulse</text>
            </svg>
            <div>
                <div class="hero-mode">{pulse['label']}</div>
                <div class="hero-message">{pulse['message']}</div>
            </div>
        </div>
    </div>
    """


def _glass_card(container, title: str, body: str, footer: str) -> None:
    container.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">{title}</div>
            <div class="card-copy">{body}</div>
            <div class="card-meta">{footer}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _rebalance_message(pipeline: DataPipeline) -> str:
    datasets = pipeline.build_dataset()
    spy = datasets["SPY"]["close"].pct_change(20).iloc[-1]
    qqq = datasets["QQQ"]["close"].pct_change(20).iloc[-1]
    if float(spy - qqq) >= 0.05:
        return "SPY has outperformed QQQ by more than 5%. Sovereign AI recommends a profit harvest into lagging growth exposure."
    if float(qqq - spy) >= 0.05:
        return "QQQ has materially outpaced SPY. Sovereign AI suggests trimming technology gains back toward core balance."
    return "Relative performance remains balanced. No tactical harvest is required."


def _render_vault(credentials: BrokerCredentials | None, tickers: tuple[str, ...]) -> None:
    status = "Linked to Alpaca paper trading." if credentials else "No broker connected."
    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">The Vault</div>
            <div class="card-copy">{status}</div>
            <div class="card-meta">Fractional execution is enabled for {", ".join(tickers)}. Credentials live only in session memory.</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


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
        st.error("Missing required secrets: " + ", ".join(missing))
        return None
    return fred_api_key, discord_webhook, app_url


def _init_broker_state() -> None:
    if "broker_credentials" not in st.session_state:
        st.session_state.broker_credentials = None
    if "global_circuit_breaker" not in st.session_state:
        st.session_state.global_circuit_breaker = GlobalCircuitBreaker()
    if "hourly_drawdown" not in st.session_state:
        st.session_state.hourly_drawdown = 0.0


def _inject_styles() -> None:
    st.markdown(
        """
        <style>
            :root {
                --bg: #0B0D10;
                --panel: rgba(21, 26, 33, 0.72);
                --border: rgba(0, 245, 255, 0.18);
                --text: #E9EEF5;
                --muted: #8EA2B8;
                --cyan: #00F5FF;
                --red: #FF5A5F;
                --yellow: #F4B942;
                --green: #19C37D;
            }
            .stApp {
                background: linear-gradient(180deg, #0B0D10 0%, #10141A 100%);
                color: var(--text);
            }
            [data-testid="stHeader"] {
                background: rgba(11, 13, 16, 0.92);
                border-bottom: 1px solid #273140;
            }
            [data-testid="stToolbar"] {
                background: transparent;
            }
            [data-testid="stDecoration"] {
                background: none;
            }
            [data-testid="stStatusWidget"] {
                background: transparent;
                color: var(--text);
            }
            [data-testid="stAppViewContainer"] {
                background: linear-gradient(180deg, #0B0D10 0%, #10141A 100%);
            }
            .block-container {
                max-width: 1180px;
                padding-top: 1.2rem;
                padding-bottom: 4rem;
            }
            .hero-kicker {
                color: var(--cyan);
                letter-spacing: 0.2rem;
                font-size: 0.82rem;
                margin-bottom: 0.5rem;
            }
            .hero-title {
                color: var(--text);
                font-size: 2.8rem;
                font-weight: 700;
                line-height: 1.05;
                margin-bottom: 0.6rem;
                font-family: Inter, ui-sans-serif, system-ui, sans-serif;
            }
            .hero-copy, .card-copy, .card-meta, .hero-message {
                color: var(--muted);
                font-size: 1rem;
                line-height: 1.5;
            }
            .hero-card, .glass-card, .signal-card {
                background: var(--panel);
                backdrop-filter: blur(16px);
                border: 1px solid #273140;
                border-radius: 24px;
                padding: 1.1rem 1.2rem;
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
                margin-bottom: 1rem;
            }
            .hero-flex {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            .card-label {
                color: var(--cyan);
                text-transform: uppercase;
                letter-spacing: 0.12rem;
                font-size: 0.82rem;
                margin-bottom: 0.4rem;
            }
            .hero-mode {
                color: var(--text);
                font-size: 1.65rem;
                font-weight: 700;
                margin-bottom: 0.35rem;
            }
            .donut {
                width: 180px;
                height: 180px;
                flex-shrink: 0;
            }
            .donut-track {
                fill: none;
                stroke: rgba(255,255,255,0.08);
                stroke-width: 12;
            }
            .donut-ring {
                fill: none;
                stroke-width: 12;
                stroke-linecap: round;
            }
            .donut-score {
                fill: var(--text);
                font-size: 22px;
                font-weight: 700;
            }
            .donut-caption {
                fill: var(--muted);
                font-size: 11px;
            }
            .signal-action {
                font-size: 1.45rem;
                font-weight: 700;
                margin-bottom: 0.4rem;
            }
            .signal-action.buy { color: var(--green); }
            .signal-action.protect { color: var(--red); }
            .stButton > button {
                min-height: 48px;
                background: #13232B;
                color: var(--text);
                border: 1px solid rgba(0, 245, 255, 0.35);
                border-radius: 14px;
                font-weight: 700;
            }
            [data-testid="stSidebar"] {
                background: #10141A;
            }
            @media (max-width: 768px) {
                .hero-flex { flex-direction: column; align-items: flex-start; }
                .hero-title { font-size: 2rem; }
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
