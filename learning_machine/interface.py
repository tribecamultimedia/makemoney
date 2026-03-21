from __future__ import annotations

import json
from datetime import date, datetime, timedelta, timezone

import pandas as pd
import plotly.graph_objects as go
import requests
import streamlit as st

try:
    from .data import DataConfig, DataPipeline, get_economic_calendar
    from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker, SovereignAgent
    from .experiment_tracker import read_experiment_runs
    from .intelligence import CreditLiquidityFactor, EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory, PortfolioAllocator
    from .ledger import LedgerEntry, append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
    from .notifications import DiscordNotifier
    from .signal_worker import latest_state_payload
    from .storage import shared_storage_enabled
    from .trade_manager import TradeManager
except ImportError:
    from learning_machine.data import DataConfig, DataPipeline, get_economic_calendar
    from learning_machine.execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker, SovereignAgent
    from learning_machine.experiment_tracker import read_experiment_runs
    from learning_machine.intelligence import CreditLiquidityFactor, EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory, PortfolioAllocator
    from learning_machine.ledger import LedgerEntry, append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
    from learning_machine.notifications import DiscordNotifier
    from learning_machine.signal_worker import latest_state_payload
    from learning_machine.storage import shared_storage_enabled
    from learning_machine.trade_manager import TradeManager


APP_NAME = "Guru's Superbrain"
DEFAULT_APP_URL = "https://makemoneywithtommy.streamlit.app"
DEFAULT_OPENAI_MODEL = "gpt-5-mini"
BUNDLES = {
    "Core Assets": ("SPY", "QQQ"),
    "Defensive": ("GLD", "TLT"),
    "Speculative": ("BITO", "NVDA"),
    "Crypto": ("BTC-USD", "ETH-USD", "SOL-USD"),
}


def _render_quick_start() -> None:
    st.markdown(
        """
        <div class="glass-card">
            <div class="card-label">Start Here</div>
            <div class="card-copy">1. Connect your paper broker. 2. Click <strong>Refresh AI view</strong>. 3. Review the suggested trade plan before syncing.</div>
            <div class="card-meta">If the AI looks cautious, that is still a decision. Waiting is part of the product.</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _render_intent_hub() -> str:
    st.markdown("### What do you want to do today?")
    st.markdown(
        """
        <div class="intent-grid">
            <div class="intent-card">
                <div class="card-label">Trade</div>
                <div class="card-copy">Find the best short-term setup, see the suggested trade plan, and decide whether to sync.</div>
                <div class="card-meta">Best for: swing trades and tactical entries</div>
            </div>
            <div class="intent-card">
                <div class="card-label">Invest</div>
                <div class="card-copy">See whether the machine thinks this is a hold, add, or protect moment for core positions.</div>
                <div class="card-meta">Best for: building and protecting a longer-term core</div>
            </div>
            <div class="intent-card">
                <div class="card-label">Read the Market</div>
                <div class="card-copy">Understand what the AI sees in macro, liquidity, sentiment, and event risk without needing to trade today.</div>
                <div class="card-meta">Best for: market context and risk awareness</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    selected = st.segmented_control(
        "Choose a path",
        options=["Trade", "Invest", "Read the Market"],
        default="Trade",
        selection_mode="single",
    )
    return str(selected or "Trade")


def main() -> None:
    st.set_page_config(page_title=APP_NAME, page_icon="◉", layout="wide", initial_sidebar_state="expanded")
    _inject_styles()
    secrets = _require_secrets()
    if secrets is None:
        return

    fred_api_key, discord_webhook, app_url = secrets
    notifier = DiscordNotifier(webhook_url=discord_webhook, username="Sovereign AI", app_url=app_url)
    _init_broker_state()

    st.markdown("<div class='hero-kicker'>GURU'S SUPERBRAIN</div>", unsafe_allow_html=True)
    st.markdown("<div class='hero-title'>Your AI market brain, trade desk, and portfolio doctor</div>", unsafe_allow_html=True)
    st.markdown(
        "<div class='hero-copy'>See what Guru's Superbrain wants to buy, what it wants to avoid, and how it diagnoses your account before you press sync.</div>",
        unsafe_allow_html=True,
    )
    st.markdown(_render_broker_status_badge(), unsafe_allow_html=True)
    _render_quick_start()
    user_path = _render_intent_hub()

    selected_bundle = st.segmented_control(
        "Choose what to follow",
        options=list(BUNDLES.keys()),
        default="Core Assets",
        selection_mode="single",
    )
    selected_bundle = str(selected_bundle or "Core Assets")
    selected_tickers = BUNDLES[selected_bundle]
    st.markdown(
        f"<div class='bundle-card'>Current view: {selected_bundle} | Assets: {', '.join(selected_tickers)}</div>",
        unsafe_allow_html=True,
    )

    with st.sidebar:
        st.markdown("### Connect Broker")
        broker_provider = st.selectbox("Broker", options=["Alpaca", "Coinbase"], index=0)
        provider_key = broker_provider.lower()
        if provider_key == "coinbase":
            api_key = st.text_input("Coinbase API Key Name", type="password")
            secret_key = st.text_area("Coinbase API Secret", height=140, placeholder="Paste the full Coinbase secret, including BEGIN/END lines.")
            trade_mode = st.radio("Mode", options=["Live", "Sandbox"], horizontal=True)
            st.caption("Coinbase uses Advanced Trade API keys. Preserve newlines in the secret key. The current SDK path is tuned for Live first.")
        else:
            api_key = st.text_input("Alpaca API Key", type="password")
            secret_key = st.text_input("Alpaca Secret Key", type="password")
            trade_mode = st.radio("Mode", options=["Paper", "Live"], horizontal=True)
        account_size = st.number_input("Account size", min_value=50.0, max_value=100000.0, value=200.0, step=50.0)
        max_position_notional = st.number_input("Max trade size", min_value=10.0, max_value=10000.0, value=50.0, step=10.0)
        daily_loss_limit_pct = st.slider("Daily stop-loss %", min_value=1.0, max_value=10.0, value=3.0, step=0.5)
        cooldown_minutes = st.select_slider("Pause after protect", options=[15, 30, 60, 120, 240], value=60)
        auto_harvest = st.toggle("Auto-take partial profits", value=False)
        if provider_key == "coinbase":
            if trade_mode == "Sandbox":
                st.warning("Coinbase sandbox is not fully wired in the official SDK path yet. Use Live for now if you want the dashboard to connect.")
            else:
                st.warning("Coinbase mode uses your real crypto account. Keep sizing small and treat this as a controlled test.")
        elif trade_mode == "Live":
            st.error("Live mode is advanced. Start with Paper until fills and audit logs behave exactly as expected.")
        if st.button("Link Broker", use_container_width=True):
            st.session_state.broker_credentials = (
                BrokerCredentials(
                    api_key=api_key,
                    secret_key=secret_key,
                    provider=provider_key,
                    paper=trade_mode in {"Paper", "Sandbox"},
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
                st.success(f"{broker_provider} linked in {trade_mode.upper()} mode.")
        st.caption("Keys live only in this browser session and disappear when the tab closes.")
        st.caption("Recommended startup: small size, strict stop-loss, and one broker only until the audit log looks clean.")

        config = DataConfig()
        start_date = st.date_input("History start", value=date.fromisoformat(config.start))
        end_date = st.date_input("History end", value=date.fromisoformat(config.end))
        notional = st.select_slider(
            "Trade budget",
            options=[50.0, 250.0, 1000.0, 5000.0, 10000.0],
            value=50.0,
            format_func=lambda value: f"${value:,.0f}",
        )
        run_button = st.button("Refresh AI view", type="primary", use_container_width=True)

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
    superbrain_board = _build_superbrain_board(pipeline, selected_tickers)
    internals = MarketInternalsFactory().build()
    credit = CreditLiquidityFactor().build()
    event_risk = EventRiskFilter().evaluate(get_economic_calendar())

    pulse_col, sentiment_col = st.columns([1, 1])
    pulse_col.markdown(_render_superbrain_score_card(sovereign_score), unsafe_allow_html=True)
    sentiment_score = _mock_retail_sentiment(selected_bundle)
    sentiment_col.plotly_chart(
        _build_sentiment_gauge(sentiment_score),
        use_container_width=True,
        config={"displayModeBar": False},
        key="hero_sentiment_gauge",
    )
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
                <div class="card-label">Guru's Superbrain Stance</div>
                <div class="card-copy">{latest_signal['label']}</div>
                <div class="card-meta">{latest_signal['message']}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">Today's Briefing</div>
            <div class="card-copy">{_guru_briefing(regime_snapshot, pulse, selected_bundle)}</div>
            <div class="card-meta">Yield Curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f} | Inflation YoY: {float(regime_snapshot['inflation_yoy']):.2f}%</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if user_path == "Trade":
        _render_trade_view(
            pipeline=pipeline,
            pulse=pulse,
            sovereign_score=sovereign_score,
            sentiment_score=sentiment_score,
            regime_snapshot=regime_snapshot,
            selected_bundle=selected_bundle,
            app_latest_signal=latest_signal,
        )
    elif user_path == "Invest":
        _render_invest_view(
            pulse=pulse,
            sovereign_score=sovereign_score,
            regime_snapshot=regime_snapshot,
            selected_bundle=selected_bundle,
            latest_signal=latest_signal,
        )
    else:
        _render_market_view(
            pulse=pulse,
            sentiment_score=sentiment_score,
            regime_snapshot=regime_snapshot,
            internals=internals,
            credit=credit,
            event_risk=event_risk,
            latest_signal=latest_signal,
        )

    _render_superbrain_board(superbrain_board)
    _render_portfolio_doctor(superbrain_board)
    _render_copilot(
        pulse=pulse,
        sovereign_score=sovereign_score,
        regime_snapshot=regime_snapshot,
        internals=internals,
        credit=credit,
        event_risk=event_risk,
        latest_signal=latest_signal,
    )
    _render_machine_feed()
    _render_portfolio_panel()
    _render_ledger_panels()
    _render_shadow_portfolio_ticker(pipeline, selected_tickers)

    calendar = get_economic_calendar()
    event_cols = st.columns([1, 1, 1])
    _glass_card(event_cols[0], "Macro Backdrop", regime_snapshot["narrative"], f"Yield curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f}")
    _glass_card(event_cols[1], "Important Events", _calendar_body(calendar), _calendar_footer(calendar))
    _glass_card(event_cols[2], "Positioning Note", _rebalance_message(pipeline), "A quick read on whether leadership is balanced or lopsided.")

    with st.expander("Why the AI feels cautious or confident", expanded=False):
        intelligence_cols = st.columns([1, 1])
        _glass_card(
            intelligence_cols[0],
            "Market Internals",
            internals.summary,
            f"VIX {internals.vix_level:.1f} | TLT 20D {internals.tlt_return_20d:.1f}% | SOXX above 50DMA: {'Yes' if internals.soxx_above_50dma else 'No'}",
        )
        _glass_card(
            intelligence_cols[1],
            "Event Risk",
            event_risk.summary,
            f"Next event: {event_risk.next_event} | Hours: {event_risk.hours_to_event:.1f} | Size multiplier: {event_risk.size_multiplier:.2f}",
        )
        factor_cols = st.columns([1, 1])
        _glass_card(
            factor_cols[0],
            "Credit & Liquidity",
            credit.summary,
            f"HYG 20D {credit.hyg_return_20d:.1f}% | LQD 20D {credit.lqd_return_20d:.1f}% | IWM vs SPY {credit.iwm_vs_spy_momentum:+.1f}%",
        )
        _render_experiment_panel()

    with st.expander("How the AI manages risk", expanded=False):
        st.markdown(
            """
            - `Capital Preservation Mode`: cash-first defense.
            - `Tactical Accumulation`: scale in slowly.
            - `Risk-On Expansion`: maintain full core positions.
            - `Auto-Harvest`: trims 25% of a position after a 3% gain, if enabled in Broker Link.
            """
        )

    if run_button:
        signals = generate_signal_map(
            tickers=selected_tickers,
            pulse=pulse,
            notional=notional,
            pipeline=pipeline,
            regime_snapshot=regime_snapshot,
            stress_snapshot=stress_snapshot,
            internals=internals,
            event_risk=event_risk,
            credit=credit,
        )
        _render_signal_cards(signals)
        _render_allocation_diagnostics(signals, notional)
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


def _render_trade_view(
    *,
    pipeline: DataPipeline,
    pulse: dict[str, object],
    sovereign_score: dict[str, float | str],
    sentiment_score: int,
    regime_snapshot: dict[str, float | str],
    selected_bundle: str,
    app_latest_signal: dict[str, object] | None,
) -> None:
    st.markdown("### Trading Setup")
    left, right = st.columns([1, 1])
    left.markdown(_render_superbrain_score_card(sovereign_score), unsafe_allow_html=True)
    right.plotly_chart(
        _build_sentiment_gauge(sentiment_score),
        use_container_width=True,
        config={"displayModeBar": False},
        key="trade_sentiment_gauge",
    )
    _glass_card(
        st,
        "Best short-term read",
        _trade_blurb(pulse, sovereign_score),
        f"Bundle: {selected_bundle} | Current pulse: {pulse['label']}",
    )
    if app_latest_signal is not None:
        _glass_card(
            st,
            "Machine's latest move",
            str(app_latest_signal["message"]),
            str(app_latest_signal["label"]),
        )
    _glass_card(
        st,
        "Entry mindset",
        _entry_mindset(regime_snapshot, sovereign_score),
        "This is the short version of what the machine thinks about pressing risk right now.",
    )


def _render_invest_view(
    *,
    pulse: dict[str, object],
    sovereign_score: dict[str, float | str],
    regime_snapshot: dict[str, float | str],
    selected_bundle: str,
    latest_signal: dict[str, object] | None,
) -> None:
    st.markdown("### Investment View")
    summary_cols = st.columns([1, 1, 1])
    rating = _superbrain_rating(float(sovereign_score["score"]))
    _glass_card(summary_cols[0], "Guru's Superbrain rating", rating["label"], f"Bundle: {selected_bundle} | Action: {rating['action']}")
    _glass_card(summary_cols[1], "Macro backdrop", str(regime_snapshot["narrative"]), f"Yield curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f}")
    _glass_card(
        summary_cols[2],
        "Machine stance",
        "Add carefully" if pulse["mode"] == "tactical_accumulation" else "Hold and protect" if pulse["mode"] == "capital_preservation" else "Stay invested",
        str(latest_signal["message"]) if latest_signal is not None else "No saved signal yet.",
    )


def _render_market_view(
    *,
    pulse: dict[str, object],
    sentiment_score: int,
    regime_snapshot: dict[str, float | str],
    internals,
    credit,
    event_risk,
    latest_signal: dict[str, object] | None,
) -> None:
    st.markdown("### Market Read")
    market_cols = st.columns([1, 1, 1])
    _glass_card(market_cols[0], "Market pulse", str(pulse["message"]), str(pulse["label"]))
    _glass_card(market_cols[1], "Crowd mood", _hype_meter_copy(sentiment_score, pulse), f"Retail sentiment: {sentiment_score}/100")
    _glass_card(
        market_cols[2],
        "Current regime",
        str(regime_snapshot["narrative"]),
        str(latest_signal["message"]) if latest_signal is not None else "No saved signal yet.",
    )
    lower_cols = st.columns([1, 1, 1])
    _glass_card(lower_cols[0], "Internals", internals.summary, f"VIX {internals.vix_level:.1f} | Cross-asset {internals.cross_asset_confirmation:+.2f}")
    _glass_card(lower_cols[1], "Credit", credit.summary, f"Liquidity score {credit.liquidity_score:+.2f}")
    _glass_card(lower_cols[2], "Event risk", event_risk.summary, f"Next event in {event_risk.hours_to_event:.1f} hours")


def _render_copilot(
    *,
    pulse: dict[str, object],
    sovereign_score: dict[str, float | str],
    regime_snapshot: dict[str, float | str],
    internals,
    credit,
    event_risk,
    latest_signal: dict[str, object] | None,
) -> None:
    st.markdown("### Guru's Superbrain Assistant")
    api_key, model = _resolve_openai_settings()
    left, right = st.columns([1.35, 0.9])
    with left:
        _glass_card(
            st,
            "Ask Guru's Superbrain",
            "Ask why it traded, why it stayed cautious, what the biggest risk is today, or whether the current stance makes sense in plain English.",
            "This copilot is grounded in the current dashboard context instead of acting like a generic finance chatbot.",
        )
        starter_cols = st.columns(3)
        prompts = [
            "Why didn't the AI trade yet?",
            "What is the biggest risk today?",
            "Explain the current stance in plain English.",
        ]
        for idx, prompt in enumerate(prompts):
            if starter_cols[idx].button(prompt, use_container_width=True, key=f"copilot_prompt_{idx}"):
                st.session_state.copilot_pending_prompt = prompt

        if not api_key:
            st.info("Add `OPENAI_API_KEY` to Streamlit secrets to enable the in-app copilot.")
            return

        for message in st.session_state.copilot_messages:
            with st.chat_message(message["role"]):
                st.markdown(str(message["content"]))

        pending_prompt = st.session_state.pop("copilot_pending_prompt", None)
        user_prompt = pending_prompt or st.chat_input("Ask Guru's Superbrain")
        if user_prompt:
            st.session_state.copilot_messages.append({"role": "user", "content": user_prompt})
            with st.chat_message("user"):
                st.markdown(user_prompt)
            with st.chat_message("assistant"):
                with st.spinner("Guru's Superbrain is thinking..."):
                    reply = _ask_copilot(
                        api_key=api_key,
                        model=model,
                        user_prompt=user_prompt,
                        context=_build_copilot_context(
                            pulse=pulse,
                            sovereign_score=sovereign_score,
                            regime_snapshot=regime_snapshot,
                            internals=internals,
                            credit=credit,
                            event_risk=event_risk,
                            latest_signal=latest_signal,
                        ),
                    )
                st.markdown(reply)
            st.session_state.copilot_messages.append({"role": "assistant", "content": reply})

    with right:
        _glass_card(
            st,
            "Superbrain context",
            _copilot_context_summary(pulse, sovereign_score, internals, credit, event_risk),
            f"Model: {model} | Mode: {'Enabled' if api_key else 'Disabled'}",
        )


def _resolve_openai_settings() -> tuple[str, str]:
    try:
        api_key = str(st.secrets.get("OPENAI_API_KEY", "")).strip()
    except Exception:
        api_key = ""
    try:
        model = str(st.secrets.get("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)).strip() or DEFAULT_OPENAI_MODEL
    except Exception:
        model = DEFAULT_OPENAI_MODEL
    return api_key, model


def _build_copilot_context(
    *,
    pulse: dict[str, object],
    sovereign_score: dict[str, float | str],
    regime_snapshot: dict[str, float | str],
    internals,
    credit,
    event_risk,
    latest_signal: dict[str, object] | None,
) -> dict[str, object]:
    credentials = st.session_state.broker_credentials
    account_context: dict[str, object] = {"connected": False}
    if credentials is not None:
        account_context = {
            "connected": True,
            "mode": "paper" if credentials.paper else "live",
            "account_size": credentials.account_size,
            "max_position_notional": credentials.max_position_notional,
            "daily_loss_limit_pct": credentials.daily_loss_limit_pct,
            "cooldown_minutes": credentials.cooldown_minutes,
            "auto_harvest": credentials.auto_harvest,
        }
        try:
            snapshot = TradeManager(credentials).portfolio_snapshot()
            account_context["portfolio"] = {
                "equity": snapshot["equity"],
                "cash": snapshot["cash"],
                "buying_power": snapshot["buying_power"],
                "daily_pnl_pct": snapshot["daily_pnl_pct"],
                "open_positions": [
                    {
                        "symbol": row.get("symbol"),
                        "qty": row.get("qty"),
                        "market_value": row.get("market_value"),
                        "unrealized_plpc": row.get("unrealized_plpc"),
                    }
                    for row in snapshot["positions"]
                ],
            }
        except Exception as exc:
            account_context["portfolio_error"] = str(exc)

    return {
        "pulse": pulse,
        "sovereign_score": sovereign_score,
        "regime_snapshot": {
            "state": regime_snapshot.get("state"),
            "narrative": regime_snapshot.get("narrative"),
            "yield_curve_10y_2y": regime_snapshot.get("yield_curve_10y_2y"),
            "inflation_yoy": regime_snapshot.get("inflation_yoy"),
        },
        "latest_signal": latest_signal,
        "market_internals": {
            "summary": internals.summary,
            "vix_level": internals.vix_level,
            "cross_asset_confirmation": internals.cross_asset_confirmation,
            "tlt_return_20d": internals.tlt_return_20d,
            "gld_return_20d": internals.gld_return_20d,
            "xlf_above_50dma": internals.xlf_above_50dma,
            "soxx_above_50dma": internals.soxx_above_50dma,
        },
        "credit_liquidity": {
            "summary": credit.summary,
            "liquidity_score": credit.liquidity_score,
            "hyg_return_20d": credit.hyg_return_20d,
            "lqd_return_20d": credit.lqd_return_20d,
            "iwm_vs_spy_momentum": credit.iwm_vs_spy_momentum,
        },
        "event_risk": {
            "summary": event_risk.summary,
            "next_event": event_risk.next_event,
            "hours_to_event": event_risk.hours_to_event,
            "size_multiplier": event_risk.size_multiplier,
        },
        "portfolio": account_context,
        "recent_ledger": read_ledger().sort_values("timestamp", ascending=False).head(8).to_dict(orient="records"),
    }


def _copilot_context_summary(
    pulse: dict[str, object],
    sovereign_score: dict[str, float | str],
    internals,
    credit,
    event_risk,
) -> str:
    return (
        f"Pulse: {pulse['label']} | Score: {int(float(sovereign_score['score']))}%<br>"
        f"Internals: {internals.cross_asset_confirmation:+.2f} cross-asset confirmation, VIX {internals.vix_level:.1f}<br>"
        f"Credit: {credit.liquidity_score:+.2f} liquidity score<br>"
        f"Event risk: {event_risk.size_multiplier:.2f} size multiplier with {event_risk.hours_to_event:.1f}h to next event"
    )


def _ask_copilot(*, api_key: str, model: str, user_prompt: str, context: dict[str, object]) -> str:
    system_prompt = (
        "You are Guru's Superbrain, the in-app assistant for a cautious trading dashboard. "
        "Answer only using the supplied context. Be concise, plain-English, and practical. "
        "Do not invent prices, trades, or market data not present in context. "
        "If context is insufficient, say so directly. "
        "Focus on explaining the machine's current stance, risks, and next action in a way a retail trader can understand."
    )
    payload = {
        "model": model,
        "input": [
            {"role": "system", "content": [{"type": "input_text", "text": system_prompt}]},
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Dashboard context:\n" + json.dumps(context, default=str, ensure_ascii=True),
                    },
                    {"type": "input_text", "text": "User question:\n" + user_prompt},
                ],
            },
        ],
    }
    try:
        response = requests.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=45,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        return f"Copilot request failed: {exc}"

    output_text = data.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    for item in data.get("output", []):
        for content in item.get("content", []):
            text = content.get("text")
            if isinstance(text, str) and text.strip():
                return text.strip()

    return "Copilot did not return a usable answer."


@st.cache_data(ttl=3600, show_spinner=False)
def load_regime_snapshot(*, fred_api_key: str, start_date: str, end_date: str, tickers: tuple[str, ...]) -> dict[str, float | str]:
    pipeline = DataPipeline(fred_api_key=fred_api_key, config=DataConfig(start=start_date, end=end_date, tickers=tickers))
    return pipeline.regime_snapshot()


@st.cache_data(ttl=3600, show_spinner=False)
def load_market_stress(*, fred_api_key: str, start_date: str, end_date: str, tickers: tuple[str, ...]) -> dict[str, float | bool]:
    pipeline = DataPipeline(fred_api_key=fred_api_key, config=DataConfig(start=start_date, end=end_date, tickers=tickers))
    return pipeline.market_stress_signal()


def generate_signal_map(
    *,
    tickers: tuple[str, ...],
    pulse: dict[str, object],
    notional: float,
    pipeline: DataPipeline,
    regime_snapshot: dict[str, float | str],
    stress_snapshot: dict[str, float | bool],
    internals,
    event_risk,
    credit,
) -> dict[str, ExecutionSignal]:
    del pulse
    per_ticker = notional / max(len(tickers), 1)
    engine = EnsembleDecisionEngine()
    allocator = PortfolioAllocator()
    decisions = {}
    for ticker in tickers:
        sovereign_score = pipeline.generate_sovereign_score(ticker)
        decisions[ticker] = engine.decide(
            ticker=ticker,
            regime_snapshot=regime_snapshot,
            stress_snapshot=stress_snapshot,
            sovereign_score=sovereign_score,
            internals=internals,
            event_risk=event_risk,
            credit=credit,
            base_notional=per_ticker,
        )
    allocation = allocator.allocate(decisions=decisions, total_notional=notional)
    signals: dict[str, ExecutionSignal] = {}
    for ticker, decision in decisions.items():
        signals[ticker] = ExecutionSignal(
            symbol=ticker,
            action=decision.action,
            confidence=decision.confidence,
            reason=f"{decision.summary} | {decision.attribution}",
            target_notional=allocation.notionals.get(ticker, decision.target_notional),
        )
    return signals


def _render_portfolio_panel() -> None:
    st.markdown("### Your Broker Account")
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
    elif credentials.provider == "coinbase":
        wallet_rows = snapshot.get("wallet_balances", [])
        if wallet_rows:
            with st.expander("Wallet Balances", expanded=False):
                st.dataframe(pd.DataFrame(wallet_rows), use_container_width=True)
        else:
            st.info("Coinbase connected, but no wallet balances were detected from the Advanced Trade account response.")


def _render_machine_feed() -> None:
    st.markdown("### What Happens Next")
    left, middle, right, storage_col = st.columns([1.0, 1.0, 1.2, 0.9])
    _glass_card(
        left,
        "Next Market Check",
        _format_run_body("Macro pulse refresh", _next_top_of_hour()),
        "Triggers Discord only when the market regime changes.",
    )
    _glass_card(
        middle,
        "Next Trade Window",
        _format_run_body("Paper/live execution", _next_execution_run()),
        "Checks every 15 minutes on weekdays during market hours.",
    )
    _glass_card(
        right,
        "Simple Trigger Rules",
        _trigger_logic_body(),
        "BUY when the pulse is supportive. PROTECT when macro regime or stress says cash-first.",
    )
    _glass_card(
        storage_col,
        "Data Sync",
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


def _render_experiment_panel() -> None:
    runs = read_experiment_runs(limit=5)
    if runs.empty:
        st.info("No experiment versions logged yet.")
        return
    latest = runs.iloc[0]
    st.markdown(
        f"""
            <div class="glass-card">
            <div class="card-label">Decision Engine</div>
            <div class="card-copy">Engine version: {latest['engine_version']}</div>
            <div class="card-meta">Latest mode: {latest['mode']} | {latest['summary']}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _render_allocation_diagnostics(signal_map: dict[str, ExecutionSignal], total_notional: float) -> None:
    st.markdown("### Suggested Trade Plan")
    rows = []
    assigned = 0.0
    for signal in signal_map.values():
        assigned += float(signal.target_notional)
        rows.append(
            {
                "symbol": signal.symbol,
                "action": signal.action,
                "confidence_pct": round(signal.confidence * 100.0, 1),
                "target_notional": float(signal.target_notional),
                "reason": signal.reason,
            }
        )
    st.dataframe(pd.DataFrame(rows), use_container_width=True)
    st.caption(f"Requested notional: ${total_notional:,.2f} | Assigned notional: ${assigned:,.2f}")


def _render_ledger_panels() -> None:
    st.markdown("### Results So Far")
    equity = read_equity_curve()
    ledger = read_ledger()
    _render_performance_dashboard(equity, ledger)
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


def _render_performance_dashboard(equity: pd.DataFrame, ledger: pd.DataFrame) -> None:
    stats = _build_performance_stats(equity, ledger)
    st.markdown("#### Performance Summary")
    metric_cols = st.columns(5)
    metric_cols[0].metric("Total Return", f"{stats['return_pct']:.2f}%")
    metric_cols[1].metric("Max Drawdown", f"{stats['max_drawdown_pct']:.2f}%")
    metric_cols[2].metric("Win Rate", f"{stats['win_rate_pct']:.1f}%")
    metric_cols[3].metric("Submitted Trades", str(stats["submitted_trades"]))
    metric_cols[4].metric("Protect Actions", str(stats["protect_count"]))
    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">Daily Report Card</div>
            <div class="card-copy">{stats['summary_copy']}</div>
            <div class="card-meta">Signals Logged: {stats['total_events']} | Errors: {stats['error_count']} | Latest Equity: ${stats['latest_equity']:,.2f}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _build_performance_stats(equity: pd.DataFrame, ledger: pd.DataFrame) -> dict[str, float | int | str]:
    if equity.empty:
        return {
            "return_pct": 0.0,
            "max_drawdown_pct": 0.0,
            "win_rate_pct": 0.0,
            "submitted_trades": 0,
            "protect_count": 0,
            "total_events": int(len(ledger)),
            "error_count": int((ledger["status"] == "error").sum()) if not ledger.empty and "status" in ledger else 0,
            "latest_equity": 0.0,
            "summary_copy": "The machine has not logged enough history to judge it yet. Give it time or give it trades.",
        }

    equity_frame = equity.copy().sort_values("timestamp").reset_index(drop=True)
    equity_frame["equity"] = equity_frame["equity"].astype(float)
    start_equity = float(equity_frame["equity"].iloc[0])
    latest_equity = float(equity_frame["equity"].iloc[-1])
    return_pct = 0.0 if start_equity == 0 else ((latest_equity / start_equity) - 1.0) * 100.0
    running_peak = equity_frame["equity"].cummax()
    drawdown = (equity_frame["equity"] / running_peak) - 1.0
    max_drawdown_pct = abs(float(drawdown.min()) * 100.0)

    submitted_trades = 0
    protect_count = 0
    error_count = 0
    win_rate_pct = 0.0
    if not ledger.empty:
        ledger_frame = ledger.copy()
        ledger_frame["timestamp"] = pd.to_datetime(ledger_frame["timestamp"])
        submitted = ledger_frame[ledger_frame["status"] == "submitted"].sort_values("timestamp")
        submitted_trades = int(len(submitted))
        protect_count = int(((ledger_frame["status"] == "submitted") & (ledger_frame["action"] == "PROTECT")).sum())
        error_count = int((ledger_frame["status"] == "error").sum())
        wins = 0
        evaluated = 0
        for row in submitted.itertuples():
            before = equity_frame[equity_frame["timestamp"] <= row.timestamp]
            after = equity_frame[equity_frame["timestamp"] > row.timestamp]
            if before.empty or after.empty:
                continue
            before_equity = float(before.iloc[-1]["equity"])
            after_equity = float(after.iloc[0]["equity"])
            evaluated += 1
            if row.action == "BUY" and after_equity >= before_equity:
                wins += 1
            elif row.action == "PROTECT" and after_equity <= before_equity:
                wins += 1
        win_rate_pct = 0.0 if evaluated == 0 else (wins / evaluated) * 100.0

    if return_pct > 0 and max_drawdown_pct < 3:
        summary_copy = "The machine is compounding without embarrassing itself. That is rarer than financial Twitter would have you believe."
    elif return_pct > 0:
        summary_copy = "The machine is making money, but it is not exactly doing it quietly. Watch the drawdown."
    elif submitted_trades == 0:
        summary_copy = "The engine is awake, but it has not seen enough clean setups to earn an opinion."
    else:
        summary_copy = "The machine is learning expensive lessons. Good. That is what paper capital is for."

    return {
        "return_pct": return_pct,
        "max_drawdown_pct": max_drawdown_pct,
        "win_rate_pct": win_rate_pct,
        "submitted_trades": submitted_trades,
        "protect_count": protect_count,
        "total_events": int(len(ledger)),
        "error_count": error_count,
        "latest_equity": latest_equity,
        "summary_copy": summary_copy,
    }


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
    provider = credentials.provider.title()
    if credentials.provider == "coinbase":
        mode = "Sandbox" if credentials.paper else "Live"
    else:
        mode = "Paper" if credentials.paper else "Live"
    return f"""
    <div class="status-badge connected">
        Broker Status: Connected | Broker: {provider} | Mode: {mode} | Max Position: ${credentials.max_position_notional:,.0f}
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


def _trade_blurb(pulse: dict[str, object], sovereign_score: dict[str, float | str]) -> str:
    score = float(sovereign_score["score"])
    if pulse["mode"] == "capital_preservation":
        return "The machine sees more downside drama than upside clarity. For now, missing a messy trade is the point."
    if score >= 70:
        return "This is one of the cleaner setups on the board. Not perfect, but finally respectable."
    if score >= 50:
        return "There is a tradable idea here, but it deserves smaller size and less storytelling."
    return "The AI sees motion, not conviction. That matters."


def _entry_mindset(regime_snapshot: dict[str, float | str], sovereign_score: dict[str, float | str]) -> str:
    score = float(sovereign_score["score"])
    if str(regime_snapshot["state"]) == "capital_preservation":
        return "Wait for better conditions. Protecting cash is a valid position."
    if score >= 70:
        return "If you trade, lean in with discipline. The setup has enough support to matter."
    if score >= 50:
        return "If you trade, think starter position, not full conviction."
    return "Stand down unless you enjoy forcing trades that do not want to exist."


def _superbrain_rating(score: float) -> dict[str, str]:
    if score >= 75:
        return {"label": "High-conviction setup", "action": "BUY"}
    if score >= 55:
        return {"label": "Respectable but selective", "action": "HOLD"}
    return {"label": "Too weak to trust", "action": "PROTECT"}


def _pulse_message(mode: str) -> str:
    if mode == "capital_preservation":
        return "This market is acting like a toddler with leverage. Cash first."
    if mode == "tactical_accumulation":
        return "There is a trade here, not a romance. Scale in and keep your dignity."
    return "The tape is finally acting rational enough to fund optimism."


def _render_superbrain_score_card(score_payload: dict[str, float | str]) -> str:
    score = int(float(score_payload["score"]))
    circumference = 2 * 3.1416 * 52
    dash = circumference * (score / 100)
    color = "#12A150" if score >= 70 else "#111111" if score >= 45 else "#D93025"
    rating = _superbrain_rating(float(score_payload["score"]))
    return f"""
    <div class="hero-card">
        <div class="card-label">Guru's Superbrain | {score_payload['ticker']}</div>
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
                <div class="card-meta">Superbrain action: {rating['action']}</div>
            </div>
        </div>
    </div>
    """


def _build_superbrain_board(pipeline: DataPipeline, tickers: tuple[str, ...]) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    for ticker in tickers:
        payload = pipeline.generate_sovereign_score(ticker)
        rating = _superbrain_rating(float(payload["score"]))
        rows.append(
            {
                "ticker": ticker,
                "score": float(payload["score"]),
                "action": rating["action"],
                "rating": rating["label"],
                "momentum_20d": float(payload["momentum_20d"]),
                "drawdown_20d": float(payload["drawdown_20d"]),
                "volatility_20d": float(payload["volatility_20d"]),
                "copy": str(payload["copy"]),
            }
        )
    return pd.DataFrame(rows).sort_values(["score", "ticker"], ascending=[False, True]).reset_index(drop=True)


def _render_superbrain_board(board: pd.DataFrame) -> None:
    st.markdown("### Guru's Superbrain Picks")
    if board.empty:
        st.info("No ranked ideas yet.")
        return
    top = board.iloc[0]
    hero_cols = st.columns([1.2, 1, 1])
    _glass_card(
        hero_cols[0],
        "Top pick right now",
        f"{top['ticker']} | {top['action']}",
        f"Score {top['score']:.1f} | {top['copy']}",
    )
    buy_count = int((board["action"] == "BUY").sum())
    hold_count = int((board["action"] == "HOLD").sum())
    protect_count = int((board["action"] == "PROTECT").sum())
    _glass_card(hero_cols[1], "Signal mix", f"{buy_count} BUY | {hold_count} HOLD | {protect_count} PROTECT", "A quick read on how aggressive the board looks.")
    _glass_card(hero_cols[2], "Average score", f"{board['score'].mean():.1f}", f"Best {board['score'].max():.1f} | Worst {board['score'].min():.1f}")
    display = board[["ticker", "score", "action", "rating", "momentum_20d", "drawdown_20d", "volatility_20d"]].copy()
    display["score"] = display["score"].round(1)
    display["momentum_20d"] = display["momentum_20d"].round(1)
    display["drawdown_20d"] = display["drawdown_20d"].round(1)
    display["volatility_20d"] = display["volatility_20d"].round(1)
    st.dataframe(display, use_container_width=True)


def _render_portfolio_doctor(board: pd.DataFrame) -> None:
    st.markdown("### Portfolio Doctor")
    credentials = st.session_state.broker_credentials
    if credentials is None:
        st.info("Link a broker to let Guru's Superbrain diagnose concentration, cash, and whether your current holdings agree with the model.")
        return
    try:
        snapshot = TradeManager(credentials).portfolio_snapshot()
    except Exception as exc:
        st.warning(f"Portfolio doctor unavailable: {exc}")
        return
    positions = snapshot.get("positions", [])
    equity = float(snapshot.get("equity", 0.0))
    cash = float(snapshot.get("cash", 0.0))
    if not positions:
        cash_pct = 0.0 if equity <= 0 else (cash / max(equity, 1e-9)) * 100.0
        _glass_card(
            st,
            "Portfolio diagnosis",
            "The account is mostly idle. That is acceptable if the board is defensive, but expensive if strong BUY scores are being ignored.",
            f"Cash share: {cash_pct:.1f}% | Board top pick: {board.iloc[0]['ticker'] if not board.empty else 'n/a'}",
        )
        return
    rows = pd.DataFrame(positions)
    if "market_value" in rows:
        rows["market_value"] = pd.to_numeric(rows["market_value"], errors="coerce").fillna(0.0)
        total_position_value = float(rows["market_value"].abs().sum())
    else:
        total_position_value = 0.0
    concentration = 0.0 if total_position_value <= 0 else float(rows["market_value"].abs().max() / total_position_value) * 100.0
    symbols = {str(value).upper() for value in rows.get("symbol", pd.Series(dtype=str)).tolist()}
    board_actions = {str(row.ticker).upper(): str(row.action) for row in board.itertuples()}
    conflict_symbols = [symbol for symbol in symbols if board_actions.get(symbol) == "PROTECT"]
    diagnosis = "Your holdings are reasonably aligned with the current board."
    if concentration >= 60:
        diagnosis = "Your account is highly concentrated. One asset is carrying too much emotional and financial weight."
    elif conflict_symbols:
        diagnosis = "Guru's Superbrain sees at least one live holding that it would rather protect than own."
    foot = f"Largest position share: {concentration:.1f}% | Cash: ${cash:,.2f}"
    if conflict_symbols:
        foot += " | Conflict: " + ", ".join(conflict_symbols[:3])
    _glass_card(st, "Portfolio diagnosis", diagnosis, foot)


def _build_sentiment_gauge(score: int) -> go.Figure:
    bar_color = "#12A150" if score >= 60 else "#D93025" if score <= 40 else "#111111"
    fig = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=score,
            title={"text": "Crowd vs. Code", "font": {"color": "#111111", "size": 20}},
            number={"suffix": "/100", "font": {"color": "#111111"}},
            gauge={
                "axis": {"range": [0, 100], "tickcolor": "#BDBDBD"},
                "bar": {"color": bar_color},
                "bgcolor": "#FFFFFF",
                "steps": [
                    {"range": [0, 33], "color": "#F4F4F4"},
                    {"range": [33, 66], "color": "#ECECEC"},
                    {"range": [66, 100], "color": "#E3E3E3"},
                ],
            },
        )
    )
    fig.update_layout(template="plotly_white", paper_bgcolor="rgba(0,0,0,0)", margin=dict(l=10, r=10, t=50, b=10), height=250)
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
        st.info("Step 1: Link Alpaca or Coinbase in Broker Link. Step 2: Refresh the pulse. Step 3: Confirm and sync.")
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
            f"Confirm all {((credentials.provider == 'coinbase' and credentials.paper) and 'sandbox') or (credentials.paper and 'paper') or 'live'} orders before submission",
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
    start = float(equity["equity"].iloc[0]) if not equity.empty else 0.0
    latest = float(equity["equity"].iloc[-1]) if not equity.empty else 0.0
    line_color = "#12A150" if latest >= start else "#D93025"
    figure = go.Figure()
    figure.add_trace(
        go.Scatter(
            x=equity["timestamp"],
            y=equity["equity"],
            mode="lines",
            line=dict(color=line_color, width=3),
            name="Equity",
        )
    )
    figure.update_layout(
        template="plotly_white",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#FFFFFF",
        title="Paper Portfolio Equity Curve",
        margin=dict(l=10, r=10, t=40, b=10),
        height=280,
        xaxis=dict(showgrid=False, color="#111111"),
        yaxis=dict(showgrid=False, color="#111111"),
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
    if "copilot_messages" not in st.session_state:
        st.session_state.copilot_messages = []
    if "copilot_pending_prompt" not in st.session_state:
        st.session_state.copilot_pending_prompt = None


def _inject_styles() -> None:
    st.markdown(
        """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
            :root {
                --bg: #FFFFFF;
                --panel: #FFFFFF;
                --border: #D8D8D8;
                --text: #111111;
                --muted: #5F6368;
                --accent: #111111;
                --red: #D93025;
                --green: #12A150;
                --soft: #F7F7F7;
            }
            @keyframes riseIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes drift {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-2px); }
                100% { transform: translateY(0px); }
            }
            .stApp {
                background: #FFFFFF;
                color: var(--text);
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            }
            [data-testid="stHeader"] { background: rgba(255, 255, 255, 0.95); border-bottom: 1px solid var(--border); }
            [data-testid="stToolbar"], [data-testid="stDecoration"] { background: transparent; }
            [data-testid="stAppViewContainer"] { background: #FFFFFF; }
            .block-container { max-width: 1180px; padding-top: 1.2rem; padding-bottom: 4rem; }
            .hero-kicker, .card-label {
                color: var(--accent);
                text-transform: uppercase;
                letter-spacing: 0.14rem;
                font-size: 0.82rem;
                margin-bottom: 0.4rem;
                font-family: "IBM Plex Mono", ui-monospace, monospace;
            }
            .hero-title {
                color: var(--text);
                font-size: 2.6rem;
                font-weight: 700;
                line-height: 1.02;
                margin-bottom: 0.5rem;
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
                animation: riseIn 0.55s ease-out, drift 5s ease-in-out infinite;
            }
            .hero-copy, .card-copy, .card-meta, .hero-message {
                color: var(--muted);
                font-size: 1rem;
                line-height: 1.55;
            }
            .hero-card, .glass-card, .signal-card, .bundle-card {
                background: var(--panel);
                border: 1px solid var(--border);
                border-radius: 22px;
                padding: 1rem 1.1rem;
                margin-bottom: 1rem;
                box-shadow: 0 14px 36px rgba(0, 0, 0, 0.06);
                animation: riseIn 0.45s ease-out;
            }
            .intent-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            .intent-card {
                background: var(--panel);
                border: 1px solid var(--border);
                border-radius: 22px;
                padding: 1rem 1.1rem;
                box-shadow: 0 14px 36px rgba(0, 0, 0, 0.05);
                animation: riseIn 0.5s ease-out;
            }
            .status-badge {
                display: inline-block;
                padding: 0.55rem 0.85rem;
                border-radius: 999px;
                border: 1px solid var(--border);
                margin-bottom: 1rem;
                font-size: 0.92rem;
                font-weight: 600;
            }
            .status-badge.connected {
                background: rgba(18, 161, 80, 0.08);
                color: var(--green);
            }
            .status-badge.disconnected {
                background: rgba(217, 48, 37, 0.08);
                color: var(--red);
            }
            .hero-flex { display: flex; gap: 1rem; align-items: center; }
            .hero-mode { color: var(--text); font-size: 1.65rem; font-weight: 700; margin-bottom: 0.35rem; }
            .donut { width: 180px; height: 180px; flex-shrink: 0; }
            .donut-track { fill: none; stroke: #E7E7E7; stroke-width: 12; }
            .donut-ring { fill: none; stroke-width: 12; stroke-linecap: round; }
            .donut-score { fill: var(--text); font-size: 22px; font-weight: 700; }
            .donut-caption { fill: var(--muted); font-size: 11px; }
            .signal-action { font-size: 1.45rem; font-weight: 700; margin-bottom: 0.4rem; }
            .signal-action.buy { color: var(--green); }
            .signal-action.protect { color: var(--red); }
            .stButton > button {
                min-height: 48px;
                background: #FFFFFF;
                color: var(--text);
                border: 1px solid #111111;
                border-radius: 14px;
                font-weight: 700;
                transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
            }
            .stButton > button:hover {
                transform: translateY(-1px);
                background: #111111;
                color: #FFFFFF;
            }
            [data-testid="stSidebar"] { background: var(--soft); }
            .stMetric {
                background: #FFFFFF;
                border: 1px solid var(--border);
                border-radius: 18px;
                padding: 0.5rem 0.75rem;
            }
            label, .stMarkdown, .stCaption, .stTextInput, .stNumberInput, .stSelectbox, .stSlider, .stRadio {
                color: var(--text) !important;
            }
            @media (max-width: 768px) { .hero-flex { flex-direction: column; align-items: flex-start; } .hero-title { font-size: 2rem; } .intent-grid { grid-template-columns: 1fr; } }
        </style>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
