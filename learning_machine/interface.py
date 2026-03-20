from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

try:
    from .data import DataConfig, DataPipeline, get_economic_calendar
    from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker, SovereignAgent
    from .ledger import LedgerEntry, append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
    from .notifications import DiscordNotifier
    from .signal_worker import latest_state_payload
    from .storage import shared_storage_enabled
    from .trade_manager import TradeManager
except ImportError:
    from learning_machine.data import DataConfig, DataPipeline, get_economic_calendar
    from learning_machine.execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker, SovereignAgent
    from learning_machine.ledger import LedgerEntry, append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
    from learning_machine.notifications import DiscordNotifier
    from learning_machine.signal_worker import latest_state_payload
    from learning_machine.storage import shared_storage_enabled
    from learning_machine.trade_manager import TradeManager


APP_NAME = "Sovereign AI"
DEFAULT_APP_URL = "https://makemoneywithtommy.streamlit.app"
BUNDLES = {
    "Core Assets": ("SPY", "QQQ"),
    "Defensive": ("GLD", "TLT"),
    "Speculative": ("BITO", "NVDA"),
}


def main() -> None:
    st.set_page_config(page_title=APP_NAME, page_icon="◉", layout="wide", initial_sidebar_state="expanded")
    _inject_styles()
    secrets = _require_secrets()
    if secrets is None:
        return

    fred_api_key, discord_webhook, app_url = secrets
    notifier = DiscordNotifier(webhook_url=discord_webhook, username="Sovereign AI", app_url=app_url)
    _init_broker_state()

    st.markdown("<div class='hero-kicker'>SOVEREIGN AI</div>", unsafe_allow_html=True)
    st.markdown("<div class='hero-title'>The Institutional Control Layer For Retail Capital</div>", unsafe_allow_html=True)
    st.markdown(
        "<div class='hero-copy'>Macro pulse, crowd positioning, economic event timing, and paper-safe broker sync in one obsidian dashboard.</div>",
        unsafe_allow_html=True,
    )
    st.markdown(_render_broker_status_badge(), unsafe_allow_html=True)

    selected_bundle = st.segmented_control(
        "Bundle View",
        options=list(BUNDLES.keys()),
        default="Core Assets",
        selection_mode="single",
    )
    selected_bundle = str(selected_bundle or "Core Assets")
    selected_tickers = BUNDLES[selected_bundle]
    st.markdown(
        f"<div class='bundle-card'>Active Bundle: {selected_bundle} | Assets: {', '.join(selected_tickers)}</div>",
        unsafe_allow_html=True,
    )

    with st.sidebar:
        st.markdown("### Broker Link")
        api_key = st.text_input("Alpaca API Key", type="password")
        secret_key = st.text_input("Alpaca Secret Key", type="password")
        trade_mode = st.radio("Execution Mode", options=["Paper", "Live"], horizontal=True)
        account_size = st.number_input("Account size", min_value=50.0, max_value=100000.0, value=200.0, step=50.0)
        max_position_notional = st.number_input("Max position per trade", min_value=10.0, max_value=10000.0, value=50.0, step=10.0)
        daily_loss_limit_pct = st.slider("Daily max loss %", min_value=1.0, max_value=10.0, value=3.0, step=0.5)
        cooldown_minutes = st.select_slider("Cooldown after protection", options=[15, 30, 60, 120, 240], value=60)
        auto_harvest = st.toggle("🛡️ Auto-Harvest Profits", value=False)
        if trade_mode == "Live":
            st.error("Live mode is advanced. Start with Paper until fills and audit logs behave exactly as expected.")
        if st.button("Link Broker", use_container_width=True):
            st.session_state.broker_credentials = (
                BrokerCredentials(
                    api_key=api_key,
                    secret_key=secret_key,
                    paper=trade_mode == "Paper",
                    account_size=float(account_size),
                    max_position_notional=float(max_position_notional),
                    daily_loss_limit_pct=float(daily_loss_limit_pct / 100.0),
                    cooldown_minutes=int(cooldown_minutes),
                    auto_harvest=auto_harvest,
                )
                if api_key and secret_key
                else None
            )
            if st.session_state.broker_credentials is not None:
                st.success(f"Broker linked in {trade_mode.upper()} mode.")
        st.caption("Keys live only in this browser session and disappear when the tab closes.")
        st.caption("Recommended startup: Paper mode, $200 account size, $50 max position, $50 sync notional.")

        config = DataConfig()
        start_date = st.date_input("Research start", value=date.fromisoformat(config.start))
        end_date = st.date_input("Research end", value=date.fromisoformat(config.end))
        notional = st.select_slider(
            "Sync notional",
            options=[50.0, 250.0, 1000.0, 5000.0, 10000.0],
            value=50.0,
            format_func=lambda value: f"${value:,.0f}",
        )
        run_button = st.button("Refresh Sovereign Pulse", type="primary", use_container_width=True)

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
    sovereign_score = pipeline.generate_sovereign_score(selected_tickers[0])

    pulse_col, sentiment_col = st.columns([1, 1])
    pulse_col.markdown(_render_sovereign_score_card(sovereign_score), unsafe_allow_html=True)
    sentiment_score = _mock_retail_sentiment(selected_bundle)
    sentiment_col.plotly_chart(_build_sentiment_gauge(sentiment_score), use_container_width=True, config={"displayModeBar": False})
    hype_copy = _hype_meter_copy(sentiment_score, pulse)
    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">Hype Meter</div>
            <div class="card-copy">{hype_copy}</div>
            <div class="card-meta">Retail Noise: {sentiment_score}/100 | Macro Pulse: {pulse['label']}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

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

    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">Institutional Narrator</div>
            <div class="card-copy">{_guru_briefing(regime_snapshot, pulse, selected_bundle)}</div>
            <div class="card-meta">Yield Curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f} | Inflation YoY: {float(regime_snapshot['inflation_yoy']):.2f}%</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    _render_machine_feed()
    _render_portfolio_panel()
    _render_ledger_panels()
    _render_shadow_portfolio_ticker(pipeline, selected_tickers)

    calendar = get_economic_calendar()
    event_cols = st.columns([1, 1, 1])
    _glass_card(event_cols[0], "Macro-Regime Narrator", regime_snapshot["narrative"], f"Yield curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f}")
    _glass_card(event_cols[1], "Macro-Watchdog", _calendar_body(calendar), _calendar_footer(calendar))
    _glass_card(event_cols[2], "Smart Harvest", _rebalance_message(pipeline), "Lock gains from relative winners instead of letting concentration drift.")

    with st.expander("Execution Intelligence", expanded=False):
        st.markdown(
            """
            - `Capital Preservation Mode`: cash-first defense.
            - `Tactical Accumulation`: scale in slowly.
            - `Risk-On Expansion`: maintain full core positions.
            - `Auto-Harvest`: trims 25% of a position after a 3% gain, if enabled in Broker Link.
            """
        )

    if run_button:
        signals = generate_signal_map(selected_tickers, pulse, notional)
        _render_signal_cards(signals)
        _render_copy_trade_controls(signals, notifier, app_url)
        _render_test_signal(notifier)
        _render_audit_log()
        _render_last_execution_status()
        if stress_snapshot["triggered"]:
            notifier.send_regime_change(
                tickers=selected_tickers,
                label="Capital Preservation Mode",
                message="Global circuit breaker engaged after a 3% hourly market drop.",
                reason="Sovereign AI is toggling linked accounts to PROTECT until stress normalizes.",
            )


@st.cache_data(ttl=3600, show_spinner=False)
def load_regime_snapshot(*, fred_api_key: str, start_date: str, end_date: str, tickers: tuple[str, ...]) -> dict[str, float | str]:
    pipeline = DataPipeline(fred_api_key=fred_api_key, config=DataConfig(start=start_date, end=end_date, tickers=tickers))
    return pipeline.regime_snapshot()


@st.cache_data(ttl=3600, show_spinner=False)
def load_market_stress(*, fred_api_key: str, start_date: str, end_date: str, tickers: tuple[str, ...]) -> dict[str, float | bool]:
    pipeline = DataPipeline(fred_api_key=fred_api_key, config=DataConfig(start=start_date, end=end_date, tickers=tickers))
    return pipeline.market_stress_signal()


def generate_signal_map(tickers: tuple[str, ...], pulse: dict[str, object], notional: float) -> dict[str, ExecutionSignal]:
    action = "BUY" if pulse["mode"] != "capital_preservation" else "PROTECT"
    confidence = 0.95 if action == "PROTECT" else float(pulse["score"]) / 100.0
    per_ticker = notional / max(len(tickers), 1)
    return {
        ticker: ExecutionSignal(
            symbol=ticker,
            action=action,
            confidence=confidence,
            reason=str(pulse["narrative"]),
            target_notional=per_ticker,
        )
        for ticker in tickers
    }


def _render_portfolio_panel() -> None:
    st.markdown("### Portfolio Command")
    credentials = st.session_state.broker_credentials
    if credentials is None:
        st.info("Link a broker to view live or paper portfolio metrics.")
        return

    manager = TradeManager(credentials)
    try:
        snapshot = manager.portfolio_snapshot()
    except Exception as exc:
        st.warning(f"Portfolio snapshot unavailable: {exc}")
        return

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Equity", f"${snapshot['equity']:,.2f}")
    col2.metric("Cash", f"${snapshot['cash']:,.2f}")
    col3.metric("Buying Power", f"${snapshot['buying_power']:,.2f}")
    col4.metric("Daily PnL", f"{snapshot['daily_pnl_pct'] * 100:.2f}%")

    positions = snapshot["positions"]
    if positions:
        position_rows = [
            {
                "symbol": row.get("symbol"),
                "qty": row.get("qty"),
                "market_value": row.get("market_value"),
                "unrealized_plpc": row.get("unrealized_plpc"),
            }
            for row in positions
        ]
        with st.expander("Open Positions", expanded=False):
            st.dataframe(pd.DataFrame(position_rows), use_container_width=True)


def _render_machine_feed() -> None:
    st.markdown("### Machine Feed")
    left, middle, right, storage_col = st.columns([1.0, 1.0, 1.2, 0.9])
    _glass_card(
        left,
        "Next Signal Run",
        _format_run_body("Macro pulse refresh", _next_top_of_hour()),
        "Triggers Discord only when the market regime changes.",
    )
    _glass_card(
        middle,
        "Next Execution Run",
        _format_run_body("Paper/live execution", _next_execution_run()),
        "Checks every 15 minutes on weekdays during market hours.",
    )
    _glass_card(
        right,
        "Trade Trigger Logic",
        _trigger_logic_body(),
        "BUY when the pulse is supportive. PROTECT when macro regime or stress says cash-first.",
    )
    _glass_card(
        storage_col,
        "Storage Mode",
        "Shared cloud ledger" if shared_storage_enabled() else "Local app ledger",
        "Add Supabase secrets to unify Streamlit and GitHub worker history." if not shared_storage_enabled() else "App and workers now read the same ledger, equity curve, and latest signal.",
    )

    ledger = read_ledger()
    if ledger.empty:
        st.info("No machine events yet. After the first sync or worker run, this feed will show timestamps, actions, status, and reasons.")
        return

    feed = ledger.copy().sort_values("timestamp", ascending=False).head(20)
    feed["timestamp"] = pd.to_datetime(feed["timestamp"]).dt.strftime("%Y-%m-%d %H:%M:%S UTC")
    columns = ["timestamp", "symbol", "mode", "action", "status", "reason", "notional"]
    st.dataframe(feed[columns], use_container_width=True)


def _render_ledger_panels() -> None:
    st.markdown("### Algo Test Track Record")
    equity = read_equity_curve()
    ledger = read_ledger()
    left, right = st.columns([1.2, 1.0])
    with left:
        if equity.empty:
            st.info("No equity history yet. Sync trades from this app to create a local track record. GitHub worker history does not automatically appear inside Streamlit Cloud because it runs in a separate environment.")
        else:
            st.plotly_chart(_build_equity_curve_chart(equity), use_container_width=True, config={"displayModeBar": False})
    with right:
        if ledger.empty:
            st.info("No ledger entries yet.")
        else:
            recent = ledger.sort_values("timestamp", ascending=False).head(10)
            st.dataframe(recent, use_container_width=True)


def _next_top_of_hour(now: datetime | None = None) -> datetime:
    now = now or datetime.now(timezone.utc)
    next_hour = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    return next_hour


def _next_execution_run(now: datetime | None = None) -> datetime:
    now = now or datetime.now(timezone.utc)
    candidate = now.replace(second=0, microsecond=0)
    next_minute = ((candidate.minute // 15) + 1) * 15
    if next_minute >= 60:
        candidate = candidate.replace(minute=0) + timedelta(hours=1)
    else:
        candidate = candidate.replace(minute=next_minute)

    while candidate.weekday() > 4 or not (14 <= candidate.hour <= 21):
        candidate += timedelta(minutes=15)
        candidate = candidate.replace(second=0, microsecond=0)
    return candidate


def _format_run_body(label: str, run_at: datetime) -> str:
    delta = run_at - datetime.now(timezone.utc)
    minutes = max(int(delta.total_seconds() // 60), 0)
    return f"{label}<br><span class='run-time'>{run_at.strftime('%Y-%m-%d %H:%M UTC')}</span><br><span class='run-countdown'>in about {minutes} minutes</span>"


def _trigger_logic_body() -> str:
    return (
        "1. Pull FRED + market stress.<br>"
        "2. If 1-hour drawdown <= -3%, force PROTECT.<br>"
        "3. If yield curve is inverted, stay defensive.<br>"
        "4. Otherwise hold or add target core positions.<br>"
        "5. If daily loss breaches the cap, block new BUY orders."
    )


def _render_broker_status_badge() -> str:
    credentials = st.session_state.broker_credentials
    if credentials is None:
        return """
        <div class="status-badge disconnected">
            Broker Status: Not Connected | Safe Mode: Signals only
        </div>
        """
    mode = "Paper" if credentials.paper else "Live"
    return f"""
    <div class="status-badge connected">
        Broker Status: Connected | Mode: {mode} | Max Position: ${credentials.max_position_notional:,.0f}
    </div>
    """


def _append_audit_log(entry: dict[str, object]) -> None:
    st.session_state.trade_audit_log.insert(0, entry)
    st.session_state.trade_audit_log = st.session_state.trade_audit_log[:100]
    st.session_state.last_execution_status = entry


def _cooldown_active() -> tuple[bool, str]:
    until = st.session_state.trade_cooldown_until
    if until is None:
        return False, ""
    remaining = until - datetime.now(timezone.utc)
    if remaining.total_seconds() <= 0:
        st.session_state.trade_cooldown_until = None
        return False, ""
    minutes = int(remaining.total_seconds() // 60)
    return True, f"Cooldown active for {minutes} more minutes."


def _build_pulse(regime_snapshot: dict[str, float | str], stress_snapshot: dict[str, float | bool]) -> dict[str, object]:
    mode = "risk_on_expansion"
    score = 84
    label = "Risk-On Expansion"
    if bool(stress_snapshot["triggered"]) or str(regime_snapshot["state"]) == "capital_preservation":
        mode = "capital_preservation"
        score = 18
        label = "Capital Preservation Mode"
    elif str(regime_snapshot["state"]) == "tactical_accumulation":
        mode = "tactical_accumulation"
        score = 52
        label = "Tactical Accumulation"
    return {
        "mode": mode,
        "score": score,
        "label": label,
        "narrative": str(regime_snapshot["narrative"]),
        "message": _pulse_message(mode),
    }


def _pulse_message(mode: str) -> str:
    if mode == "capital_preservation":
        return "This market is acting like a toddler with leverage. Cash first."
    if mode == "tactical_accumulation":
        return "There is a trade here, not a romance. Scale in and keep your dignity."
    return "The tape is finally acting rational enough to fund optimism."


def _render_sovereign_score_card(score_payload: dict[str, float | str]) -> str:
    score = int(float(score_payload["score"]))
    circumference = 2 * 3.1416 * 52
    dash = circumference * (score / 100)
    color = "#19C37D" if score >= 70 else "#F4B942" if score >= 45 else "#FF5A5F"
    return f"""
    <div class="hero-card">
        <div class="card-label">Sovereign Pulse | {score_payload['ticker']}</div>
        <div class="hero-flex">
            <svg viewBox="0 0 140 140" class="donut">
                <circle cx="70" cy="70" r="52" class="donut-track"></circle>
                <circle cx="70" cy="70" r="52" class="donut-ring" stroke="{color}" stroke-dasharray="{dash} {circumference - dash}" transform="rotate(-90 70 70)"></circle>
                <text x="70" y="66" text-anchor="middle" class="donut-score">{score}%</text>
                <text x="70" y="84" text-anchor="middle" class="donut-caption">Score</text>
            </svg>
            <div>
                <div class="hero-mode">{score_payload['label']}</div>
                <div class="hero-message">{score_payload['copy']}</div>
            </div>
        </div>
    </div>
    """


def _build_sentiment_gauge(score: int) -> go.Figure:
    fig = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=score,
            title={"text": "Crowd vs. Code", "font": {"color": "#E9EEF5", "size": 20}},
            number={"suffix": "/100", "font": {"color": "#E9EEF5"}},
            gauge={
                "axis": {"range": [0, 100], "tickcolor": "#4B5563"},
                "bar": {"color": "#00F5FF"},
                "bgcolor": "#151A21",
                "steps": [
                    {"range": [0, 33], "color": "#2A3140"},
                    {"range": [33, 66], "color": "#1D3A44"},
                    {"range": [66, 100], "color": "#143E3B"},
                ],
            },
        )
    )
    fig.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)", margin=dict(l=10, r=10, t=50, b=10), height=250)
    return fig


def _mock_retail_sentiment(bundle: str) -> int:
    return {
        "Core Assets": 58,
        "Defensive": 34,
        "Speculative": 84,
    }.get(bundle, 50)


def _hype_meter_copy(sentiment_score: int, pulse: dict[str, object]) -> str:
    if sentiment_score >= 75 and pulse["mode"] == "capital_preservation":
        return "The internet is screaming 'To the Moon.' The Guru is looking at the actual interest rates. One of them is lying. Hint: It's the one with the rocket emoji."
    if sentiment_score >= 75:
        return "The crowd finally found a pulse. Fine. Just remember volume is not wisdom."
    if sentiment_score <= 35 and pulse["mode"] == "risk_on_expansion":
        return "Retail is sulking while the macro tape improves. That usually means the market is already leaving without them."
    return "Noise is moderate. Which is perfect, because serious money prefers rooms without chanting."


def _guru_briefing(regime_snapshot: dict[str, float | str], pulse: dict[str, object], bundle: str) -> str:
    curve = float(regime_snapshot["yield_curve_10y_2y"])
    if pulse["mode"] == "risk_on_expansion":
        return (
            f"Good morning. The Yield Curve is at {curve:.2f}, which is the financial equivalent of a clear sky. "
            f"I've expanded your {bundle} core. If you were looking for a sign from the universe, this is it, only with better math."
        )
    if pulse["mode"] == "tactical_accumulation":
        return (
            f"Good morning. The Yield Curve is at {curve:.2f}. The weather is decent, not perfect. "
            "The Guru is accumulating with discipline instead of pretending every green candle is destiny."
        )
    return (
        f"Good morning. The Yield Curve is at {curve:.2f}, and the market is being dramatic again. "
        "I've moved the posture toward defense because preserving capital beats giving speeches about conviction."
    )


def _render_shadow_portfolio_ticker(pipeline: DataPipeline, tickers: tuple[str, ...]) -> None:
    tracker = _build_shadow_tracker(pipeline, tickers)
    st.markdown(
        f"""
        <div class="shadow-ticker">
            <span class="shadow-label">Unrealized Sophistication:</span>
            <span class="shadow-value">{tracker['display_gain']}</span>
            <span class="shadow-copy">{tracker['copy']}</span>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _build_shadow_tracker(pipeline: DataPipeline, tickers: tuple[str, ...]) -> dict[str, str]:
    datasets = pipeline.build_dataset()
    initial_capital = 1_000_000.0
    growth_factor = 0.0
    usable = 0
    for ticker in tickers:
        frame = datasets.get(ticker)
        if frame is None or frame.empty:
            continue
        close = frame["close"].astype(float)
        growth_factor += float(close.iloc[-1] / close.iloc[0])
        usable += 1
    if usable == 0:
        unrealized = 0.0
    else:
        unrealized = initial_capital * ((growth_factor / usable) - 1.0)
    display_gain = f"{unrealized:+,.0f}"
    copy = (
        f"While you were busy 'thinking about it,' this virtual million grew by ${abs(unrealized):,.0f}. "
        "I'm not saying you're slow, but the calendar is moving. Connect your broker before the opportunity becomes a memory."
        if unrealized >= 0
        else f"While you were wisely hesitating, the virtual million bled ${abs(unrealized):,.0f}. "
        "The point is not speed. The point is having a process before the next regime change shows up."
    )
    return {"display_gain": display_gain, "copy": copy}


def _calendar_body(events: list[dict[str, object]]) -> str:
    lines = []
    for event in events[:3]:
        ts = datetime.fromisoformat(str(event["timestamp"]))
        lines.append(f"{event['event']} | {ts.strftime('%b %d %H:%M UTC')}")
    return "<br>".join(lines)


def _calendar_footer(events: list[dict[str, object]]) -> str:
    next_event = datetime.fromisoformat(str(events[0]["timestamp"]))
    hours_left = int((next_event - datetime.now(timezone.utc)).total_seconds() // 3600)
    if hours_left <= 24:
        return f"Volatility Warning: next event in {max(hours_left, 0)} hours."
    return f"Next event in {hours_left} hours."


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
    if "SPY" not in datasets or "QQQ" not in datasets:
        return "Bundle mix does not include both SPY and QQQ, so no relative harvest is needed."
    spy = datasets["SPY"]["close"].pct_change(20).iloc[-1]
    qqq = datasets["QQQ"]["close"].pct_change(20).iloc[-1]
    if float(spy - qqq) >= 0.05:
        return "SPY has outperformed QQQ by 5%+. Consider harvesting some gains into growth."
    if float(qqq - spy) >= 0.05:
        return "QQQ has outperformed SPY by 5%+. Consider taking some technology profits."
    return "Relative performance is balanced. No smart harvest trigger yet."


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
                <div class="card-meta">Confidence: {signal.confidence * 100:.0f}% | Target: ${signal.target_notional:,.0f}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def _render_copy_trade_controls(signal_map: dict[str, ExecutionSignal], notifier: DiscordNotifier, app_url: str) -> None:
    st.markdown("### Broker Sync")
    if st.session_state.broker_credentials is None:
        st.info("Step 1: Link an Alpaca paper account in Broker Link. Step 2: Refresh the pulse. Step 3: Confirm and sync.")
        return

    credentials = st.session_state.broker_credentials
    manager = TradeManager(credentials)
    sovereign_agent = SovereignAgent()
    protect_override = bool(sovereign_agent.should_kill_trade(float(st.session_state.hourly_drawdown)))
    cooldown_on, cooldown_message = _cooldown_active()
    if cooldown_on:
        st.warning(cooldown_message)

    try:
        snapshot = manager.portfolio_snapshot()
        daily_loss_hit = float(snapshot["daily_pnl_pct"]) <= -credentials.daily_loss_limit_pct
    except Exception:
        snapshot = None
        daily_loss_hit = False

    if daily_loss_hit:
        st.error("Daily loss limit reached. New BUY orders are blocked for the rest of the session.")
    with st.form("sync_with_guru_form", clear_on_submit=False):
        confirm_sync = st.checkbox(
            f"Confirm all {credentials.paper and 'paper' or 'live'} orders before submission",
            key="confirm_sync_orders",
        )
        st.caption(
            "Execution flow: review signal -> confirm order submission -> sync -> verify the audit log and Discord alert."
        )
        submit_sync = st.form_submit_button("SYNC WITH GURU", use_container_width=True)

    if submit_sync:
        submission_time = pd.Timestamp.utcnow()
        mode_label = credentials.paper and "PAPER" or "LIVE"
        if not confirm_sync:
            st.warning("You must confirm order submission before syncing.")
            return
        if snapshot is not None:
            append_equity_snapshot(
                timestamp=submission_time.isoformat(),
                equity=float(snapshot["equity"]),
                cash=float(snapshot["cash"]),
                mode=mode_label,
            )
        for signal in signal_map.values():
            live_signal = signal
            if protect_override:
                live_signal = sovereign_agent.override_signal(signal, float(st.session_state.hourly_drawdown))
                st.error(SovereignAgent.shield_copy())
            elif daily_loss_hit and signal.action == "BUY":
                _append_audit_log(
                    {
                        "timestamp": submission_time.isoformat(),
                        "symbol": signal.symbol,
                        "mode": "BLOCKED",
                        "action": "BUY",
                        "reason": "Daily loss limit reached.",
                        "status": "blocked",
                    }
                )
                append_ledger(
                    LedgerEntry(
                        timestamp=submission_time.isoformat(),
                        symbol=signal.symbol,
                        mode=mode_label,
                        action="BUY",
                        status="blocked",
                        reason="Daily loss limit reached.",
                        notional=signal.target_notional,
                        equity=None if snapshot is None else float(snapshot["equity"]),
                        cash=None if snapshot is None else float(snapshot["cash"]),
                    )
                )
                st.warning(f"{signal.symbol}: blocked by daily loss limit.")
                continue
            elif cooldown_on and signal.action == "BUY":
                _append_audit_log(
                    {
                        "timestamp": submission_time.isoformat(),
                        "symbol": signal.symbol,
                        "mode": "BLOCKED",
                        "action": "BUY",
                        "reason": cooldown_message,
                        "status": "blocked",
                    }
                )
                append_ledger(
                    LedgerEntry(
                        timestamp=submission_time.isoformat(),
                        symbol=signal.symbol,
                        mode=mode_label,
                        action="BUY",
                        status="blocked",
                        reason=cooldown_message,
                        notional=signal.target_notional,
                        equity=None if snapshot is None else float(snapshot["equity"]),
                        cash=None if snapshot is None else float(snapshot["cash"]),
                    )
                )
                st.warning(f"{signal.symbol}: {cooldown_message}")
                continue
            try:
                result = manager.sync_with_signal(live_signal)
                if result["submitted"]:
                    notifier.send_signal(asset_name=live_signal.symbol, action=live_signal.action, reason=live_signal.reason, price=0.0, timestamp=pd.Timestamp.utcnow())
                    _append_audit_log(
                        {
                            "timestamp": submission_time.isoformat(),
                            "symbol": live_signal.symbol,
                            "mode": mode_label,
                            "action": live_signal.action,
                            "reason": live_signal.reason,
                            "status": "submitted",
                            "notional": result.get("notional", live_signal.target_notional),
                        }
                    )
                    latest_snapshot = manager.portfolio_snapshot()
                    append_ledger(
                        LedgerEntry(
                            timestamp=submission_time.isoformat(),
                            symbol=live_signal.symbol,
                            mode=mode_label,
                            action=live_signal.action,
                            status="submitted",
                            reason=live_signal.reason,
                            notional=float(result.get("notional", live_signal.target_notional)),
                            equity=float(latest_snapshot["equity"]),
                            cash=float(latest_snapshot["cash"]),
                        )
                    )
                    append_equity_snapshot(
                        timestamp=pd.Timestamp.utcnow().isoformat(),
                        equity=float(latest_snapshot["equity"]),
                        cash=float(latest_snapshot["cash"]),
                        mode=mode_label,
                    )
                    st.success(f"{live_signal.symbol}: sync submitted.")
                    if live_signal.action == "PROTECT":
                        st.session_state.trade_cooldown_until = datetime.now(timezone.utc) + timedelta(minutes=credentials.cooldown_minutes)
                else:
                    _append_audit_log(
                        {
                            "timestamp": submission_time.isoformat(),
                            "symbol": live_signal.symbol,
                            "mode": mode_label,
                            "action": live_signal.action,
                            "reason": result["reason"],
                            "status": "rejected",
                        }
                    )
                    append_ledger(
                        LedgerEntry(
                            timestamp=submission_time.isoformat(),
                            symbol=live_signal.symbol,
                            mode=mode_label,
                            action=live_signal.action,
                            status="rejected",
                            reason=result["reason"],
                            notional=live_signal.target_notional,
                            equity=None if snapshot is None else float(snapshot["equity"]),
                            cash=None if snapshot is None else float(snapshot["cash"]),
                        )
                    )
                    st.warning(f"{live_signal.symbol}: {result['reason']}")
            except Exception as exc:
                _append_audit_log(
                    {
                        "timestamp": submission_time.isoformat(),
                        "symbol": live_signal.symbol,
                        "mode": mode_label,
                        "action": live_signal.action,
                        "reason": str(exc),
                        "status": "error",
                    }
                )
                append_ledger(
                    LedgerEntry(
                        timestamp=submission_time.isoformat(),
                        symbol=live_signal.symbol,
                        mode=mode_label,
                        action=live_signal.action,
                        status="error",
                        reason=str(exc),
                        notional=live_signal.target_notional,
                        equity=None if snapshot is None else float(snapshot["equity"]),
                        cash=None if snapshot is None else float(snapshot["cash"]),
                    )
                )
                st.error(f"{live_signal.symbol}: {exc}")
        st.markdown(f"[Open live app]({app_url})")


def _render_test_signal(notifier: DiscordNotifier) -> None:
    st.markdown("### Discord Testing")
    if st.button("Send Test Discord Signal", use_container_width=True):
        ok = notifier.send_signal(
            asset_name="SOVEREIGN TEST",
            action="BUY",
            reason="Manual connectivity test from the Sovereign AI dashboard.",
            price=0.0,
            timestamp=pd.Timestamp.utcnow(),
        )
        st.success("Test signal sent.") if ok else st.error("Discord test failed.")


def _render_audit_log() -> None:
    st.markdown("### Execution Audit Log")
    entries = st.session_state.trade_audit_log
    if not entries:
        st.info("No trade actions recorded yet.")
        return
    st.dataframe(pd.DataFrame(entries), use_container_width=True)


def _render_last_execution_status() -> None:
    status = st.session_state.last_execution_status
    if not status:
        return
    symbol = status.get("symbol", "N/A")
    action = status.get("action", "N/A")
    state = status.get("status", "unknown")
    reason = status.get("reason", "")
    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">Last Execution Status</div>
            <div class="card-copy">{symbol} | {action} | {state.upper()}</div>
            <div class="card-meta">{reason}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _build_equity_curve_chart(equity: pd.DataFrame) -> go.Figure:
    figure = go.Figure()
    figure.add_trace(
        go.Scatter(
            x=equity["timestamp"],
            y=equity["equity"],
            mode="lines",
            line=dict(color="#00F5FF", width=3),
            name="Equity",
        )
    )
    figure.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#151A21",
        title="Paper Portfolio Equity Curve",
        margin=dict(l=10, r=10, t=40, b=10),
        height=280,
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=False),
    )
    return figure


def _render_vault(credentials: BrokerCredentials | None, tickers: tuple[str, ...]) -> None:
    status = "Linked to Alpaca paper trading." if credentials else "No broker connected."
    harvest = "Auto-Harvest On" if credentials and credentials.auto_harvest else "Auto-Harvest Off"
    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">The Vault</div>
            <div class="card-copy">{status}</div>
            <div class="card-meta">{harvest} | Fractional execution enabled for {", ".join(tickers)}.</div>
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
    if "trade_audit_log" not in st.session_state:
        st.session_state.trade_audit_log = []
    if "trade_cooldown_until" not in st.session_state:
        st.session_state.trade_cooldown_until = None
    if "last_execution_status" not in st.session_state:
        st.session_state.last_execution_status = None


def _inject_styles() -> None:
    st.markdown(
        """
        <style>
            :root {
                --bg: #0B0D10;
                --panel: rgba(21, 26, 33, 0.84);
                --border: rgba(0, 245, 255, 0.18);
                --text: #E9EEF5;
                --muted: #92A3B8;
                --cyan: #00F5FF;
                --red: #FF5A5F;
                --yellow: #F4B942;
                --green: #19C37D;
            }
            .stApp { background: linear-gradient(180deg, #0B0D10 0%, #10141A 100%); color: var(--text); }
            [data-testid="stHeader"] { background: rgba(11, 13, 16, 0.92); border-bottom: 1px solid #273140; }
            [data-testid="stToolbar"], [data-testid="stDecoration"] { background: transparent; }
            [data-testid="stAppViewContainer"] { background: linear-gradient(180deg, #0B0D10 0%, #10141A 100%); }
            .block-container { max-width: 1180px; padding-top: 1.2rem; padding-bottom: 4rem; }
            .hero-kicker, .card-label { color: var(--cyan); text-transform: uppercase; letter-spacing: 0.12rem; font-size: 0.82rem; margin-bottom: 0.4rem; }
            .hero-title { color: var(--text); font-size: 2.6rem; font-weight: 700; line-height: 1.05; margin-bottom: 0.5rem; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
            .hero-copy, .card-copy, .card-meta, .hero-message { color: var(--muted); font-size: 1rem; line-height: 1.5; }
            .hero-card, .glass-card, .signal-card, .bundle-card {
                background: #151A21;
                backdrop-filter: blur(12px);
                border: 1px solid #273140;
                border-radius: 22px;
                padding: 1rem 1.1rem;
                margin-bottom: 1rem;
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
            }
            .status-badge {
                display: inline-block;
                padding: 0.55rem 0.85rem;
                border-radius: 999px;
                border: 1px solid #273140;
                margin-bottom: 1rem;
                font-size: 0.92rem;
                font-weight: 600;
            }
            .status-badge.connected {
                background: rgba(25, 195, 125, 0.12);
                color: #B8FFD9;
            }
            .status-badge.disconnected {
                background: rgba(255, 90, 95, 0.12);
                color: #FFD4D6;
            }
            .hero-flex { display: flex; gap: 1rem; align-items: center; }
            .hero-mode { color: var(--text); font-size: 1.65rem; font-weight: 700; margin-bottom: 0.35rem; }
            .donut { width: 180px; height: 180px; flex-shrink: 0; }
            .donut-track { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 12; }
            .donut-ring { fill: none; stroke-width: 12; stroke-linecap: round; }
            .donut-score { fill: var(--text); font-size: 22px; font-weight: 700; }
            .donut-caption { fill: var(--muted); font-size: 11px; }
            .signal-action { font-size: 1.45rem; font-weight: 700; margin-bottom: 0.4rem; }
            .signal-action.buy { color: var(--green); }
            .signal-action.protect { color: #FF6A3D; }
            .stButton > button { min-height: 48px; background: #13232B; color: var(--text); border: 1px solid rgba(0, 245, 255, 0.35); border-radius: 14px; font-weight: 700; }
            [data-testid="stSidebar"] { background: #10141A; }
            @media (max-width: 768px) { .hero-flex { flex-direction: column; align-items: flex-start; } .hero-title { font-size: 2rem; } }
        </style>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
