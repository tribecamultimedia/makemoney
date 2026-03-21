from __future__ import annotations

import json
import os
import sys
from dataclasses import asdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go
import requests
import streamlit as st

ROOT_DIR = str(Path(__file__).resolve().parent.parent)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from . import data as data_module
    from .data import DataConfig, DataPipeline
    from .execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker, SovereignAgent
    from .experiment_tracker import read_experiment_runs
    from .feature_flags import (
        load_feature_flags,
        new_theme_enabled,
        onboarding_gate_enabled,
        planning_service_enabled,
        portfolio_doctor_service_enabled,
        real_estate_lab_enabled,
        scenario_sim_enabled,
        telaj_prep_enabled,
        wealth_map_enabled,
    )
    from .intelligence import CreditLiquidityFactor, EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory, PortfolioAllocator
    from .ledger import LedgerEntry, append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
    from .notifications import DiscordNotifier
    from .signal_worker import latest_state_payload
    from .storage import load_family_wealth_state, save_family_wealth_state, shared_storage_enabled
    from .trade_manager import TradeManager
    from domain.user_profiles import OnboardingState
except ImportError:
    import learning_machine.data as data_module
    from learning_machine.data import DataConfig, DataPipeline
    from learning_machine.execution import BrokerCredentials, ExecutionSignal, GlobalCircuitBreaker, SovereignAgent
    from learning_machine.experiment_tracker import read_experiment_runs
    from learning_machine.feature_flags import (
        load_feature_flags,
        new_theme_enabled,
        onboarding_gate_enabled,
        planning_service_enabled,
        portfolio_doctor_service_enabled,
        real_estate_lab_enabled,
        scenario_sim_enabled,
        telaj_prep_enabled,
        wealth_map_enabled,
    )
    from learning_machine.intelligence import CreditLiquidityFactor, EnsembleDecisionEngine, EventRiskFilter, MarketInternalsFactory, PortfolioAllocator
    from learning_machine.ledger import LedgerEntry, append_equity_snapshot, append_ledger, read_equity_curve, read_ledger
    from learning_machine.notifications import DiscordNotifier
    from learning_machine.signal_worker import latest_state_payload
    from learning_machine.storage import load_family_wealth_state, save_family_wealth_state, shared_storage_enabled
    from learning_machine.trade_manager import TradeManager
    from domain.user_profiles import OnboardingState

try:
    from services.allocation_engine import AllocationEngine
    from services.asset_productivity_engine import AssetProductivityEngine
    from services.balance_sheet_engine import BalanceSheetEngine
    from domain.signals import MarketPulseSummary
    from services.legacy_engine import LegacyEngine
    from services.family_capital_engine import FamilyCapitalEngine
    from services.liability_pressure_engine import LiabilityPressureEngine
    from services.onboarding_engine import OnboardingEngine
    from services.briefing_engine import BriefingEngine
    from services.market_brain import MarketBrainService
    from services.planning_engine import PlanningEngine
    from services.portfolio_doctor import PortfolioDoctorService
    from services.real_estate_decision_engine import RealEstateDecisionEngine
    from services.real_estate_lab import RealEstateLab
    from services.real_estate_portfolio_engine import RealEstatePortfolioEngine
    from services.scenario_engine import ScenarioEngine
except ImportError:  # pragma: no cover - fallback for mixed deploys
    AllocationEngine = None
    AssetProductivityEngine = None
    BalanceSheetEngine = None
    FamilyCapitalEngine = None
    LegacyEngine = None
    LiabilityPressureEngine = None
    MarketPulseSummary = None
    OnboardingEngine = None
    BriefingEngine = None
    MarketBrainService = None
    PlanningEngine = None
    PortfolioDoctorService = None
    RealEstateDecisionEngine = None
    RealEstateLab = None
    RealEstatePortfolioEngine = None
    ScenarioEngine = None


APP_NAME = "Guru's Superbrain"
DEFAULT_APP_URL = "https://makemoneywithtommy.streamlit.app"
DEFAULT_OPENAI_MODEL = "gpt-5-mini"
BUNDLES = {
    "Core Assets": ("SPY", "QQQ"),
    "Defensive": ("GLD", "TLT"),
    "Speculative": ("BITO", "NVDA"),
    "Crypto": ("BTC-USD", "ETH-USD", "SOL-USD"),
}
INVESTMENT_PROXY_MAP = getattr(
    data_module,
    "INVESTMENT_PROXY_MAP",
    {
        "US Stocks": "SPY",
        "Tech Stocks": "QQQ",
        "Treasury Bonds": "IEF",
        "Real Estate": "VNQ",
        "Gold": "GLD",
        "Cash / T-Bills": "SGOV",
        "Bitcoin": "BTC-USD",
    },
)


def get_economic_calendar() -> list[dict[str, object]]:
    return data_module.get_economic_calendar()


def get_media_says(tickers: tuple[str, ...] = ("SPY", "QQQ")) -> dict[str, object]:
    helper = getattr(data_module, "get_media_says", None)
    if helper is None:
        return {
            "tone": "Mixed",
            "tone_color": "neutral",
            "summary": "Media reading is temporarily unavailable, so the app is falling back to the model-only view.",
            "commentary": "This does not affect the core machine. It only removes the live media layer for now.",
            "headlines": [],
            "score": 0.0,
        }
    return helper(tickers)


def get_investment_proxy_history(period: str = "2y") -> pd.DataFrame:
    helper = getattr(data_module, "get_investment_proxy_history", None)
    if helper is None:
        return pd.DataFrame()
    return helper(period)


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
            <div class="intent-card">
                <div class="card-label">Plan My Money</div>
                <div class="card-copy">Type in an amount, compare what it could have done across stocks, bonds, real estate, cash, and crypto, and get a simple next-step plan.</div>
                <div class="card-meta">Best for: beginners deciding what to do with fresh money</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    selected = st.segmented_control(
        "Choose a path",
        options=["Trade", "Invest", "Read the Market", "Plan My Money"],
        default="Trade",
        selection_mode="single",
    )
    return str(selected or "Trade")


def _product_shell_enabled() -> bool:
    return wealth_map_enabled() or telaj_prep_enabled()


def _render_product_shell() -> str:
    st.session_state.setdefault("shell_section", "Balance Sheet")
    st.markdown(
        """
        <div class="shell-frame">
            <div class="shell-kicker">TELAJ PREVIEW</div>
            <div class="shell-title">A family wealth operating system, not a dashboard</div>
            <div class="shell-copy">Start from the family balance sheet, decide where the next dollar should go, and use markets as one decision layer, not the center of the product.</div>
            <div class="shell-strip">
                <div class="shell-strip-block">
                    <div class="shell-strip-label">Morning signal</div>
                    <div class="shell-strip-value">One clear call each day</div>
                </div>
                <div class="shell-strip-block">
                    <div class="shell-strip-label">Capital mission</div>
                    <div class="shell-strip-value">Protect. Allocate. Compound.</div>
                </div>
                <div class="shell-strip-block">
                    <div class="shell-strip-label">Family mode</div>
                    <div class="shell-strip-value">Built for real households</div>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    shell_cols = st.columns(7)
    shell_labels = ["Balance Sheet", "Allocation", "Portfolio", "Market", "Real Estate", "Scenario Lab", "Account"]
    shell_notes = [
        "Understand what the family owns, owes, and what needs attention first.",
        "See where the next dollar should go and why.",
        "Review holdings, productivity, diagnostics, and track record.",
        "Use the market and signal layer as decision support, not the product center.",
        "Review property decisions, rental math, and asset quality.",
        "Stress test the family plan before the market does it for you.",
        "Manage broker connection, execution status, and system operations.",
    ]
    shell_codes = ["01", "02", "03", "04", "05", "06", "07"]
    for col, label, note in zip(shell_cols, shell_labels, shell_notes, strict=True):
        code = shell_codes[shell_labels.index(label)]
        with col:
            if st.button(label, key=f"shell-card-{label}", use_container_width=True):
                st.session_state["shell_section"] = label
                st.rerun()
            st.markdown(
                f"""
                <div class="shell-card">
                    <div class="shell-card-code">{code}</div>
                    <div class="shell-card-label">{label}</div>
                    <div class="shell-card-note">{note}</div>
                    <div class="shell-card-footer">Open module</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
    selected = st.segmented_control(
        "Choose a section",
        options=shell_labels,
        key="shell_section",
        selection_mode="single",
    )
    return str(selected or "Balance Sheet")


def _render_placeholder_module(*, title: str, body: str, footer: str) -> None:
    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">{title}</div>
            <div class="card-copy">{body}</div>
            <div class="card-meta">{footer}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _safe_portfolio_snapshot() -> dict[str, object] | None:
    credentials = st.session_state.broker_credentials
    if credentials is None:
        return None
    try:
        return TradeManager(credentials).portfolio_snapshot()
    except Exception:
        return None


def _current_family_profile() -> dict[str, str]:
    profile = st.session_state.onboarding_state.get("profile", {})
    return dict(profile) if isinstance(profile, dict) else {}


def _option_index(options: list[str], value: str, fallback: int = 0) -> int:
    try:
        return options.index(value)
    except ValueError:
        return fallback


def _current_balance_sheet_summary() -> dict[str, object]:
    profile = _current_family_profile()
    if not profile:
        return {}
    if BalanceSheetEngine is None:
        return {}
    return BalanceSheetEngine().build_summary(profile, st.session_state.get("family_balance_sheet_inputs"))


def _current_balance_sheet_inputs() -> dict[str, float]:
    if BalanceSheetEngine is None:
        return {}
    return BalanceSheetEngine().normalize_inputs(st.session_state.get("family_balance_sheet_inputs"))


def _current_liability_pressure() -> dict[str, object]:
    profile = _current_family_profile()
    if not profile or LiabilityPressureEngine is None:
        return {}
    return LiabilityPressureEngine().evaluate(profile, st.session_state.get("family_balance_sheet_inputs"))


def _current_asset_productivity() -> dict[str, object]:
    profile = _current_family_profile()
    summary = _current_balance_sheet_summary()
    if not profile or not summary or AssetProductivityEngine is None:
        return {}
    return AssetProductivityEngine().build_report(profile, summary)


def _current_legacy_plan_inputs() -> dict[str, object]:
    return dict(st.session_state.get("legacy_plan_inputs", {}))


def _current_legacy_plan() -> dict[str, object]:
    profile = _current_family_profile()
    balance_sheet_inputs = _current_balance_sheet_inputs()
    if not profile or not balance_sheet_inputs or LegacyEngine is None:
        return {}
    return LegacyEngine().build_plan(
        profile=profile,
        balance_sheet_inputs=balance_sheet_inputs,
        raw_inputs=_current_legacy_plan_inputs(),
    )


def _current_real_estate_registry() -> list[dict[str, object]]:
    registry = st.session_state.get("real_estate_registry", [])
    return list(registry) if isinstance(registry, list) else []


def _current_real_estate_portfolio() -> dict[str, object]:
    if RealEstatePortfolioEngine is None:
        return {}
    return RealEstatePortfolioEngine().build_portfolio(_current_real_estate_registry())


def _current_allocation_recommendation() -> dict[str, object]:
    profile = _current_family_profile()
    if not profile:
        return {}
    if AllocationEngine is None:
        return {}
    return AllocationEngine().recommend_next_dollar(profile, _current_balance_sheet_summary(), _current_liability_pressure())


def _render_family_capital_dashboard() -> None:
    profile = _current_family_profile()
    summary = _current_balance_sheet_summary()
    st.markdown("### Family Capital Dashboard")
    if not profile or not summary:
        st.info("Complete TELAJ onboarding and save the family balance sheet to activate the family capital dashboard.")
        return
    dashboard = None
    if FamilyCapitalEngine is not None:
        dashboard = FamilyCapitalEngine().build_dashboard(
            profile=profile,
            summary=summary,
            liability=_current_liability_pressure(),
            productivity=_current_asset_productivity(),
            allocation=_current_allocation_recommendation(),
            legacy=_current_legacy_plan(),
            real_estate=_current_real_estate_portfolio(),
            balance_inputs=_current_balance_sheet_inputs(),
        )

    if dashboard is None:
        st.info("Family capital summary is temporarily unavailable.")
        return

    st.markdown(
        f"""
        <div class="glass-card">
            <div class="card-label">{dashboard.title}</div>
            <div class="card-copy">{dashboard.subtitle}</div>
            <div class="card-meta">Use this as the family operating view before diving into the detail modules.</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    liability = _current_liability_pressure()
    legacy = _current_legacy_plan()
    property_summary = _current_real_estate_portfolio().get("summary", {})
    balance_inputs = _current_balance_sheet_inputs()
    monthly_income = float(balance_inputs.get("monthly_household_income", 0.0))
    monthly_expenses = float(balance_inputs.get("monthly_household_expenses", 0.0))
    monthly_burden = float(liability.get("monthly_burden", 0.0))
    liquidity_ratio = 0.0 if monthly_expenses <= 0 else min(float(summary.get("liquid_assets", {}).get("amount", 0.0)) / max(monthly_expenses * 6.0, 1.0), 1.0)
    burden_ratio = min(float(liability.get("burden_to_income_pct", 0.0)) / 40.0, 1.0)
    reserve_ratio = 1.0 if float(legacy.get("reserve_gap", 0.0)) <= 0 else max(0.0, 1.0 - min(float(legacy.get("reserve_gap", 0.0)) / max(float(legacy.get("reserve_target", 1.0)), 1.0), 1.0))
    property_ratio = 0.0
    total_property_value = float(property_summary.get("total_property_value", 0.0))
    if total_property_value > 0:
        property_ratio = max(0.0, min((float(property_summary.get("total_equity", 0.0)) / total_property_value), 1.0))

    st.markdown(
        f"""
        <div class="mission-grid">
            <div class="mission-card">
                <div class="card-label">TODAY'S MISSION</div>
                <div class="mission-title">{dashboard.cards[0].value}</div>
                <div class="mission-copy">{dashboard.cards[0].detail}</div>
                <div class="meter-track"><div class="meter-fill" style="width: {max(min(float(_current_allocation_recommendation().get('confidence', 0.0)) * 100.0, 100.0), 8.0):.0f}%"></div></div>
            </div>
            <div class="mission-card">
                <div class="card-label">LIQUIDITY SHIELD</div>
                <div class="mission-title">{liquidity_ratio * 100:.0f}/100</div>
                <div class="mission-copy">Liquid assets versus six months of expenses.</div>
                <div class="meter-track"><div class="meter-fill" style="width: {liquidity_ratio * 100:.0f}%"></div></div>
            </div>
            <div class="mission-card">
                <div class="card-label">DEBT PRESSURE</div>
                <div class="mission-title">{str(liability.get("pressure_level", "Unknown"))}</div>
                <div class="mission-copy">Income ${monthly_income:,.0f} | Costs ${monthly_expenses + monthly_burden:,.0f}</div>
                <div class="meter-track danger"><div class="meter-fill danger" style="width: {burden_ratio * 100:.0f}%"></div></div>
            </div>
            <div class="mission-card">
                <div class="card-label">LEGACY READINESS</div>
                <div class="mission-title">{reserve_ratio * 100:.0f}/100</div>
                <div class="mission-copy">{str(legacy.get("posture", "Legacy not defined yet."))}</div>
                <div class="meter-track"><div class="meter-fill" style="width: {reserve_ratio * 100:.0f}%"></div></div>
            </div>
            <div class="mission-card">
                <div class="card-label">PROPERTY POSITION</div>
                <div class="mission-title">{property_ratio * 100:.0f}/100</div>
                <div class="mission-copy">{str(property_summary.get("posture", "No property registry yet."))}</div>
                <div class="meter-track"><div class="meter-fill" style="width: {property_ratio * 100:.0f}%"></div></div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    card_cols = st.columns(3)
    for index, card in enumerate(dashboard.cards):
        _glass_card(card_cols[index % 3], card.title, card.value, card.detail)

    focus = list(dashboard.focus)
    if focus:
        st.markdown(
            """
            <div class="glass-card">
                <div class="card-label">Current focus</div>
                <div class="card-copy">"""
            + "<br>".join(focus[:3])
            + """</div>
                <div class="card-meta">TELAJ should direct attention, not create more noise.</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    nav_cols = st.columns(len(dashboard.cards))
    for idx, card in enumerate(dashboard.cards):
        if nav_cols[idx].button(f"Open {card.target_section}", key=f"family-capital-nav-{idx}", use_container_width=True):
            st.session_state["shell_section"] = card.target_section
            st.rerun()


def _render_morning_command_center(
    *,
    pulse: dict[str, object],
    regime_snapshot: dict[str, float | str],
    selected_bundle: str,
    latest_signal: dict[str, object] | None,
    media_brief: dict[str, object],
    calendar: list[dict[str, object]],
) -> None:
    allocation = _current_allocation_recommendation()
    liability = _current_liability_pressure()
    legacy = _current_legacy_plan()
    property_summary = _current_real_estate_portfolio().get("summary", {})
    profile = _current_family_profile()

    invest_call = str(allocation.get("recommendation", "Wait for the family picture to get clearer."))
    liquidity_call = str(liability.get("recommendation", "Preserve enough liquidity to survive stress without forced selling."))
    property_call = (
        "Real estate deserves active attention now."
        if str(property_summary.get("posture", "")).lower() not in {"", "no property registry yet."}
        else "No property book yet. Add properties before making a real-estate decision."
    )
    reserve_call = str(legacy.get("safer_option", "Default to reserves and simplicity before reaching for complexity."))
    family_move = str(allocation.get("safer_option", "Move slower than the market wants you to."))
    morning_signal = latest_signal["label"] if latest_signal is not None else pulse["label"]
    morning_message = latest_signal["message"] if latest_signal is not None else pulse["message"]

    st.markdown("### Morning Command Center")
    st.markdown(
        f"""
        <div class="glass-card morning-card">
            <div class="card-label">Daily operating brief</div>
            <div class="morning-title">{morning_signal}</div>
            <div class="morning-copy">{morning_message}</div>
            <div class="morning-meta">Macro pulse: {pulse['label']} | Bundle: {selected_bundle} | Media tone: {media_brief.get('tone', 'Mixed')}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    action_cols = st.columns(5)
    action_cards = [
        ("Invest", invest_call, "Allocation"),
        ("Hold liquidity", liquidity_call, "Balance Sheet"),
        ("Real estate", property_call, "Real Estate"),
        ("ETF / gold / reserves", reserve_call, "Allocation"),
        ("Today's family move", family_move, "Scenario Lab"),
    ]
    for idx, (title, body, target) in enumerate(action_cards):
        _glass_card(action_cols[idx], title, body, f"Open {target}")

    nav_cols = st.columns(5)
    for idx, (_, _, target) in enumerate(action_cards):
        if nav_cols[idx].button(f"Go to {target}", key=f"morning-nav-{idx}", use_container_width=True):
            st.session_state["shell_section"] = target
            st.rerun()

    lower_cols = st.columns([1.2, 1, 1])
    _glass_card(
        lower_cols[0],
        "Today's Briefing",
        _guru_briefing(regime_snapshot, pulse, selected_bundle),
        f"Yield Curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f} | Inflation YoY: {float(regime_snapshot['inflation_yoy']):.2f}%",
    )
    _glass_card(
        lower_cols[1],
        "What the media says",
        str(media_brief.get("summary", "Media layer unavailable.")),
        str(media_brief.get("commentary", "")),
    )
    _glass_card(
        lower_cols[2],
        "Today matters because",
        _calendar_footer(calendar),
        _calendar_body(calendar),
    )

    if profile:
        st.markdown(
            f"""
            <div class="glass-card">
                <div class="card-label">Household context</div>
                <div class="card-copy">Goal: {profile['primary_goal'].title()} | Wealth for: {profile['wealth_for'].replace('-', ' ').title()} | Archetype: {profile['archetype']}</div>
                <div class="card-meta">TELAJ should translate the market into a family-level decision, not leave you with a pile of disconnected signals.</div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def _render_family_balance_sheet() -> None:
    profile = _current_family_profile()
    summary = _current_balance_sheet_summary()
    if not profile or not summary:
        st.info("Complete TELAJ onboarding to generate the family balance sheet.")
        return

    st.markdown("### Family Balance Sheet")
    with st.expander("Edit family profile", expanded=False):
        with st.form("family_profile_form", clear_on_submit=False):
            left, right = st.columns([1, 1])
            goal_options = ["safety", "income", "growth", "legacy"]
            wealth_for_options = ["me", "spouse", "children", "multi-generational"]
            liquidity_options = ["Most of it is liquid", "About half is liquid", "A smaller share is liquid", "Very little is liquid", "I am not sure"]
            drawdown_options = ["Sell quickly", "Wait and watch", "Hold steady", "Buy more", "I do not know"]
            primary_goal = left.selectbox("Primary goal", options=goal_options, index=_option_index(goal_options, profile.get("primary_goal", "growth"), 2))
            wealth_for = left.selectbox("Who this wealth is for", options=wealth_for_options, index=_option_index(wealth_for_options, profile.get("wealth_for", "me"), 0))
            liquidity_profile = right.selectbox("Liquidity profile", options=liquidity_options, index=_option_index(liquidity_options, profile.get("liquidity_profile", "I am not sure"), len(liquidity_options) - 1))
            drawdown_response = right.selectbox("20% drawdown response", options=drawdown_options, index=_option_index(drawdown_options, profile.get("drawdown_response", "Wait and watch"), 1))
            owned_assets = st.text_input("Owned assets summary", value=profile.get("owned_assets", ""))
            liabilities_label = st.text_input("Liability summary", value=profile.get("liabilities", ""))
            invested_assets = st.text_input("Invested assets summary", value=profile.get("invested_assets", ""))
            saved_profile = st.form_submit_button("Save family profile", type="primary", use_container_width=True)
            if saved_profile and OnboardingEngine is not None:
                answers = {
                    "owned_assets": owned_assets or profile.get("owned_assets", ""),
                    "liabilities": liabilities_label or profile.get("liabilities", ""),
                    "liquidity_profile": liquidity_profile,
                    "primary_goal": primary_goal,
                    "wealth_for": wealth_for,
                    "drawdown_response": drawdown_response,
                    "invested_assets": invested_assets or profile.get("invested_assets", ""),
                }
                st.session_state.onboarding_state["answers"].update(answers)
                st.session_state.onboarding_state["profile"] = OnboardingEngine().build_family_profile(answers)
                save_family_wealth_state(
                    profile=st.session_state.onboarding_state["profile"],
                    balance_sheet=st.session_state.get("family_balance_sheet_inputs", {}),
                    legacy_plan=st.session_state.get("legacy_plan_inputs", {}),
                    real_estate_registry=st.session_state.get("real_estate_registry", []),
                )
                st.success("Family profile updated.")
                st.rerun()

    inputs = _current_balance_sheet_inputs()
    with st.form("family_balance_sheet_form", clear_on_submit=False):
        input_cols = st.columns([1, 1, 1, 1])
        liquid_assets = input_cols[0].number_input("Liquid assets", min_value=0.0, value=float(inputs.get("liquid_assets", 0.0)), step=1000.0)
        investments = input_cols[1].number_input("Investments", min_value=0.0, value=float(inputs.get("investments", 0.0)), step=1000.0)
        real_estate = input_cols[2].number_input("Real estate", min_value=0.0, value=float(inputs.get("real_estate", 0.0)), step=5000.0)
        business_assets = input_cols[3].number_input("Business assets", min_value=0.0, value=float(inputs.get("business_assets", 0.0)), step=5000.0)

        debt_cols = st.columns([1, 1, 1, 1, 1])
        liabilities = debt_cols[0].number_input("Liabilities", min_value=0.0, value=float(inputs.get("liabilities", 0.0)), step=1000.0)
        monthly_liability_payment = debt_cols[1].number_input("Monthly liability payment", min_value=0.0, value=float(inputs.get("monthly_liability_payment", 0.0)), step=50.0)
        average_interest_rate_pct = debt_cols[2].number_input("Average liability rate %", min_value=0.0, max_value=50.0, value=float(inputs.get("average_interest_rate_pct", 0.0)), step=0.25)
        monthly_household_income = debt_cols[3].number_input("Monthly household income", min_value=0.0, value=float(inputs.get("monthly_household_income", 0.0)), step=100.0)
        monthly_household_expenses = debt_cols[4].number_input("Monthly household expenses", min_value=0.0, value=float(inputs.get("monthly_household_expenses", 0.0)), step=100.0)

        saved = st.form_submit_button("Save family balance sheet", type="primary", use_container_width=True)
        if saved:
            st.session_state.family_balance_sheet_inputs = {
                "liquid_assets": float(liquid_assets),
                "investments": float(investments),
                "real_estate": float(real_estate),
                "business_assets": float(business_assets),
                "liabilities": float(liabilities),
                "monthly_liability_payment": float(monthly_liability_payment),
                "average_interest_rate_pct": float(average_interest_rate_pct),
                "monthly_household_income": float(monthly_household_income),
                "monthly_household_expenses": float(monthly_household_expenses),
            }
            save_family_wealth_state(
                profile=profile,
                balance_sheet=st.session_state.family_balance_sheet_inputs,
                legacy_plan=st.session_state.get("legacy_plan_inputs", {}),
                real_estate_registry=st.session_state.get("real_estate_registry", []),
            )
            st.success("Family wealth state saved.")
            st.rerun()

    summary = _current_balance_sheet_summary()
    liability_pressure = _current_liability_pressure()
    productivity = _current_asset_productivity()
    intro_cols = st.columns([1, 1, 1])
    _glass_card(intro_cols[0], "Family archetype", profile["archetype"], profile["operating_posture"])
    _glass_card(intro_cols[1], "Risk posture", profile["risk_level"], f"Liquidity priority: {profile['liquidity_priority']}")
    _glass_card(intro_cols[2], "Who this wealth is for", profile["wealth_for"].replace("-", " ").title(), f"Legacy priority: {profile['legacy_priority']}")

    bucket_cols = st.columns([1, 1, 1])
    for column, key in zip(bucket_cols, ["liquid_assets", "investments", "real_estate"], strict=True):
        bucket = summary[key]
        _glass_card(column, bucket["label"], bucket["posture"], bucket["recommendation"])

    lower_cols = st.columns([1, 1, 1])
    for column, key in zip(lower_cols, ["business_assets", "liabilities"], strict=False):
        bucket = summary[key]
        _glass_card(column, bucket["label"], bucket["posture"], bucket["recommendation"])
    _glass_card(lower_cols[2], "Net worth posture", str(summary["net_worth_posture"]), f"Assets ${summary['total_assets']:,.0f} | Liabilities ${summary['total_liabilities']:,.0f} | Net worth ${summary['net_worth']:,.0f}")

    engine_cols = st.columns([1, 1, 1])
    _glass_card(engine_cols[0], "Asset Productivity Engine", str(summary["productivity_summary"]), "Keep, optimize, sell, or review should become the language of the household balance sheet.")
    _glass_card(
        engine_cols[1],
        "Liability Pressure Engine",
        str(liability_pressure.get("impact_on_growth", summary["liability_summary"])),
        (
            f"Pressure: {liability_pressure.get('pressure_level', 'Unknown')} | "
            f"Urgency: {liability_pressure.get('urgency', 'Unknown')} | "
            f"Monthly burden: ${float(liability_pressure.get('monthly_burden', 0.0)):,.0f} | "
            f"Burden / income: {float(liability_pressure.get('burden_to_income_pct', 0.0)):.1f}%"
        ),
    )
    _glass_card(engine_cols[2], "Legacy Engine", str(summary["legacy_summary"]), "TELAJ should always name who the wealth is meant to protect or build for.")

    st.markdown("### Asset Productivity Engine")
    _glass_card(st, "Productivity posture", str(productivity.get("posture", "No productivity read yet.")), str(productivity.get("summary", "")))
    items = productivity.get("items", [])
    if items:
        rows = [
            {
                "Asset class": item["asset_class"],
                "Return": item["estimated_return_profile"],
                "Cash flow": item["cash_flow_profile"],
                "Liquidity": item["liquidity_profile"],
                "Risk": item["risk_profile"],
                "Call": item["recommendation"],
                "Why": item["reason"],
            }
            for item in items
        ]
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)


def _render_capital_allocation_engine(board: pd.DataFrame) -> None:
    recommendation = _current_allocation_recommendation()
    liability_pressure = _current_liability_pressure()
    summary = _current_balance_sheet_summary()
    st.markdown("### Capital Allocation Engine")
    if not recommendation:
        st.info("Complete TELAJ onboarding to generate a next-dollar recommendation.")
        return

    top_cols = st.columns([1, 1, 1])
    _glass_card(top_cols[0], "Where should the next dollar go?", str(recommendation["recommendation"]), f"Confidence: {recommendation['confidence']}")
    _glass_card(top_cols[1], "Who this is for", str(recommendation["who_its_for"]), "TELAJ should connect capital allocation to the people the money is meant to serve.")
    _glass_card(top_cols[2], "Safer option", str(recommendation["safer_option"]), "The system should always explain the lower-stress version of the decision.")

    lower_cols = st.columns([1, 1, 1])
    _glass_card(lower_cols[0], "Why", "<br>".join(recommendation["why"]), "Calm reasons beat noise.")
    _glass_card(lower_cols[1], "Risks", "<br>".join(recommendation["risks"]), "<br>".join(recommendation["next_priority_stack"]))
    _glass_card(
        lower_cols[2],
        "Liability pressure",
        str(liability_pressure.get("recommendation", "Add liabilities and monthly burden to sharpen this recommendation.")),
        (
            f"Pressure: {liability_pressure.get('pressure_level', 'Unknown')} | "
            f"Net worth: ${float(summary.get('net_worth', 0.0)):,.0f}"
        ),
    )

    _render_money_planner_view(board)


def _render_legacy_engine() -> None:
    st.markdown("### Legacy Engine")
    profile = _current_family_profile()
    balance_sheet_inputs = _current_balance_sheet_inputs()
    if not profile or not balance_sheet_inputs:
        st.info("Complete TELAJ onboarding and save the family balance sheet to activate the Legacy Engine.")
        return

    defaults = LegacyEngine.default_inputs() if LegacyEngine is not None else {
        "children_fund_target": 0.0,
        "long_term_reserve_months": 12,
        "annual_family_contribution": 0.0,
        "wealth_transfer_priority": "balanced",
    }
    current_inputs = {**defaults, **_current_legacy_plan_inputs()}
    with st.form("legacy_engine_form", clear_on_submit=False):
        cols = st.columns([1, 1, 1, 1])
        children_fund_target = cols[0].number_input("Children / legacy fund target", min_value=0.0, value=float(current_inputs.get("children_fund_target", 0.0)), step=1000.0)
        long_term_reserve_months = int(cols[1].selectbox("Long-term reserve target", options=[6, 12, 18, 24, 36], index=_option_index(["6", "12", "18", "24", "36"], str(current_inputs.get("long_term_reserve_months", 12)), 1)))
        annual_family_contribution = cols[2].number_input("Annual family contribution", min_value=0.0, value=float(current_inputs.get("annual_family_contribution", 0.0)), step=500.0)
        wealth_transfer_priority = cols[3].selectbox("Wealth transfer priority", options=["balanced", "high", "very high"], index=_option_index(["balanced", "high", "very high"], str(current_inputs.get("wealth_transfer_priority", "balanced")), 0))
        saved = st.form_submit_button("Save legacy plan", type="primary", use_container_width=True)
        if saved:
            st.session_state.legacy_plan_inputs = {
                "children_fund_target": float(children_fund_target),
                "long_term_reserve_months": int(long_term_reserve_months),
                "annual_family_contribution": float(annual_family_contribution),
                "wealth_transfer_priority": str(wealth_transfer_priority),
            }
            save_family_wealth_state(
                profile=profile,
                balance_sheet=st.session_state.get("family_balance_sheet_inputs", {}),
                legacy_plan=st.session_state.legacy_plan_inputs,
                real_estate_registry=st.session_state.get("real_estate_registry", []),
            )
            st.success("Legacy plan saved.")
            st.rerun()

    legacy_plan = _current_legacy_plan()
    if not legacy_plan:
        st.info("Legacy planning will appear after the first save.")
        return

    top_cols = st.columns([1, 1, 1])
    _glass_card(top_cols[0], "Legacy posture", str(legacy_plan["posture"]), str(legacy_plan["recommendation"]))
    _glass_card(top_cols[1], "Reserve target", f"${float(legacy_plan['reserve_target']):,.0f}", f"Reserve gap: ${float(legacy_plan['reserve_gap']):,.0f}")
    _glass_card(top_cols[2], "Children target gap", f"${float(legacy_plan['children_target_gap']):,.0f}", f"Confidence: {legacy_plan['confidence']}")

    lower_cols = st.columns([1, 1])
    _glass_card(lower_cols[0], "Why", "<br>".join(legacy_plan["why"]), f"Wealth for: {profile['wealth_for'].replace('-', ' ').title()}")
    _glass_card(lower_cols[1], "Risks", "<br>".join(legacy_plan["risks"]), str(legacy_plan["safer_option"]))


def main() -> None:
    st.set_page_config(page_title=APP_NAME, page_icon="◉", layout="wide", initial_sidebar_state="expanded")
    _flags = load_feature_flags()
    _init_broker_state()

    if onboarding_gate_enabled() and not st.session_state.onboarding_state["completed"]:
        _inject_onboarding_styles()
        _render_onboarding_gate()
        return

    _inject_styles()
    secrets = _require_secrets()
    if secrets is None:
        return

    fred_api_key, discord_webhook, app_url = secrets
    notifier = DiscordNotifier(webhook_url=discord_webhook, username="Sovereign AI", app_url=app_url)

    # Current TELAJ prep check point.
    # These flags are intentionally loaded centrally even when they do not yet change behavior,
    # so future view routing can be added without re-scattering config reads through the UI.
    if _flags.telaj_prep:
        st.session_state["telaj_prep_enabled"] = True

    if _product_shell_enabled():
        st.markdown("<div class='hero-kicker'>TELAJ</div>", unsafe_allow_html=True)
        st.markdown("<div class='hero-title'>A calm operating system for family wealth</div>", unsafe_allow_html=True)
        st.markdown(
            "<div class='hero-copy'>Start with what the family owns, what it owes, what is productive, and where the next dollar should go. Markets and signals stay in the system, but they no longer get the first seat.</div>",
            unsafe_allow_html=True,
        )
    else:
        st.markdown("<div class='hero-kicker'>GURU'S SUPERBRAIN</div>", unsafe_allow_html=True)
        st.markdown("<div class='hero-title'>Your AI market brain, trade desk, and portfolio doctor</div>", unsafe_allow_html=True)
        st.markdown(
            "<div class='hero-copy'>See what Guru's Superbrain wants to buy, what it wants to avoid, and how it diagnoses your account before you press sync.</div>",
            unsafe_allow_html=True,
        )
    st.markdown(_render_broker_status_badge(), unsafe_allow_html=True)
    shell_section: str | None = None
    user_path: str = "Trade"
    if _product_shell_enabled():
        user_path = "Shell Only"
        shell_section = _render_product_shell()
        if shell_section == "Balance Sheet":
            user_path = "Balance Sheet"
        elif shell_section == "Allocation":
            user_path = "Allocation"
        elif shell_section == "Market":
            signal_mode = st.segmented_control(
                "Market layer",
                options=["Morning Brief", "Market Brief", "Signal Desk", "Core Investing"],
                default="Morning Brief",
                selection_mode="single",
            )
            if signal_mode == "Core Investing":
                user_path = "Invest"
            elif signal_mode == "Signal Desk":
                user_path = "Trade"
            elif signal_mode == "Morning Brief":
                user_path = "Morning Brief"
            else:
                user_path = "Read the Market"
    else:
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
    media_brief = get_media_says(selected_tickers)
    internals = MarketInternalsFactory().build()
    credit = CreditLiquidityFactor().build()
    calendar = get_economic_calendar()
    event_risk = EventRiskFilter().evaluate(calendar)

    sentiment_score = _mock_retail_sentiment(selected_bundle)
    hype_copy = _hype_meter_copy(sentiment_score, pulse)
    latest_signal = latest_state_payload()

    if shell_section is None or shell_section == "Market":
        pulse_col, sentiment_col = st.columns([1, 1])
        pulse_col.markdown(_render_superbrain_score_card(sovereign_score), unsafe_allow_html=True)
        sentiment_col.plotly_chart(
            _build_sentiment_gauge(sentiment_score),
            use_container_width=True,
            config={"displayModeBar": False},
            key="hero_sentiment_gauge",
        )
        top_action = "Stay liquid" if pulse["mode"] == "capital_preservation" else "Build positions slowly" if pulse["mode"] == "tactical_accumulation" else "Lean into quality assets"
        st.markdown(
            f"""
            <div class="signal-strip">
                <div class="signal-strip-block">
                    <div class="card-label">Morning signal</div>
                    <div class="signal-strip-value">{pulse['label']}</div>
                    <div class="signal-strip-note">{top_action}</div>
                </div>
                <div class="signal-strip-block">
                    <div class="card-label">Hype meter</div>
                    <div class="signal-strip-value">{sentiment_score}/100</div>
                    <div class="signal-strip-note">{hype_copy}</div>
                </div>
                <div class="signal-strip-block">
                    <div class="card-label">Machine mode</div>
                    <div class="signal-strip-value">{latest_signal['label'] if latest_signal is not None else pulse['label']}</div>
                    <div class="signal-strip-note">{latest_signal['message'] if latest_signal is not None else pulse['message']}</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        editorial_cols = st.columns([1.15, 0.85])
        editorial_cols[0].markdown(
            f"""
            <div class="brief-lead">
                <div class="card-label">Morning Edition</div>
                <div class="brief-title">Today's Briefing</div>
                <div class="brief-copy">{_guru_briefing(regime_snapshot, pulse, selected_bundle)}</div>
                <div class="brief-meta">Yield Curve: {float(regime_snapshot['yield_curve_10y_2y']):.2f} | Inflation YoY: {float(regime_snapshot['inflation_yoy']):.2f}%</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        _render_media_brief(editorial_cols[1], media_brief)
    elif shell_section == "Balance Sheet":
        profile = _current_family_profile()
        if profile:
            top_cols = st.columns([1, 1, 1])
            _glass_card(top_cols[0], "TELAJ profile", profile["archetype"], profile["operating_posture"])
            _glass_card(top_cols[1], "Primary goal", profile["primary_goal"].title(), f"Wealth for: {profile['wealth_for'].replace('-', ' ').title()}")
            _glass_card(top_cols[2], "Risk posture", profile["risk_level"], f"Drawdown response: {profile['drawdown_response']}")
    elif shell_section == "Allocation":
        recommendation = _current_allocation_recommendation()
        if recommendation:
            top_cols = st.columns([1, 1])
            _glass_card(top_cols[0], "Next-dollar recommendation", str(recommendation["recommendation"]), f"Confidence: {recommendation['confidence']}")
            _glass_card(top_cols[1], "Why now", "<br>".join(recommendation["why"]), str(recommendation["safer_option"]))

    if user_path == "Shell Only":
        pass
    elif user_path == "Balance Sheet":
        _render_family_capital_dashboard()
        _render_family_balance_sheet()
        _render_legacy_engine()
    elif user_path == "Allocation":
        _render_capital_allocation_engine(superbrain_board)
    elif user_path == "Trade":
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
    elif user_path == "Plan My Money":
        _render_money_planner_view(superbrain_board)
    elif user_path == "Morning Brief":
        _render_morning_command_center(
            pulse=pulse,
            regime_snapshot=regime_snapshot,
            selected_bundle=selected_bundle,
            latest_signal=latest_signal,
            media_brief=media_brief,
            calendar=calendar,
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

    if shell_section is None:
        _render_everyday_guide(superbrain_board, media_brief, latest_signal)
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
            _render_media_headlines(media_brief)
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
    else:
        if shell_section == "Balance Sheet":
            pass
        elif shell_section == "Allocation":
            _render_everyday_guide(superbrain_board, media_brief, latest_signal)
        elif shell_section == "Portfolio":
            _render_portfolio_doctor(superbrain_board)
            _render_portfolio_panel()
            _render_ledger_panels()
        elif shell_section == "Market":
            if user_path == "Morning Brief":
                _render_superbrain_board(superbrain_board)
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
            else:
                _render_superbrain_board(superbrain_board)
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
                    _render_media_headlines(media_brief)
                    _render_experiment_panel()
        elif shell_section == "Real Estate":
            _render_real_estate_lab()
        elif shell_section == "Scenario Lab":
            _render_scenario_lab(superbrain_board)
        elif shell_section == "Account":
            _render_machine_feed()
            _render_portfolio_panel()
            _render_last_execution_status()
            _render_audit_log()
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


def _render_money_planner_view(board: pd.DataFrame) -> None:
    st.markdown("### Plan My Money")
    controls = st.columns([1, 1, 1, 1])
    amount = controls[0].number_input("How much do you want to invest?", min_value=100.0, max_value=5_000_000.0, value=10_000.0, step=100.0)
    horizon_years = int(controls[1].selectbox("How long can you leave it alone?", options=[1, 3, 5, 10, 20], index=2))
    risk_profile = controls[2].selectbox("How much stress can you handle?", options=["Safe", "Balanced", "Aggressive"], index=1)
    account_type = controls[3].selectbox("Where is this money going?", options=["Taxable account", "Roth IRA", "401(k)", "Not sure"], index=0)

    history = load_planner_history()
    if history.empty:
        st.info("Planner data is not available yet.")
        return

    comparisons = _planner_comparison(history, amount)
    plan = _planner_money_genie_plan(
        amount=amount,
        horizon_years=horizon_years,
        risk_profile=risk_profile,
        account_type=account_type,
        board=board,
    )

    top_cols = st.columns([1, 1, 1])
    best = comparisons.iloc[0]
    worst = comparisons.iloc[-1]
    _glass_card(
        top_cols[0],
        "If you had invested 12 months ago",
        f"${amount:,.0f} in {best['Asset']} would be worth ${best['Value Today']:,.0f} today.",
        f"Best 12-month result: {best['Return %']:.1f}%",
    )
    _glass_card(
        top_cols[1],
        "The slowest place for your money",
        f"{worst['Asset']} would now be ${worst['Value Today']:,.0f}.",
        f"Return: {worst['Return %']:.1f}% over the past year",
    )
    _glass_card(
        top_cols[2],
        "Money Genie says",
        f"{plan['plan_name']}. {plan['summary']}",
        plan["footer"],
    )

    st.plotly_chart(_build_planner_growth_chart(history, amount), use_container_width=True, config={"displayModeBar": False})
    st.dataframe(comparisons, use_container_width=True, hide_index=True)

    alloc_cols = st.columns([1, 1])
    _glass_card(
        alloc_cols[0],
        "How to spread the money",
        "<br>".join([f"{item['label']}: {item['weight']}%" for item in plan["allocation"]]),
        "This is a simple starter mix, not personal tax or legal advice.",
    )
    _glass_card(
        alloc_cols[1],
        "Account note",
        plan["account_note"],
        "Roth IRA and 401(k) are account wrappers. The investments inside them still need a sensible mix.",
    )

    with st.expander("Why the Money Genie picked this plan", expanded=False):
        checklist = pd.DataFrame(
            [
                {"Question": "Plan selected", "Answer": plan["plan_name"], "Why it matters": "This is the reusable plan output TELAJ can later expose through APIs and other frontends."},
                {"Question": "How much risk can you handle?", "Answer": risk_profile, "Why it matters": "This changes how much should go into stocks vs. bonds and cash."},
                {"Question": "How long can you wait?", "Answer": f"{horizon_years} years", "Why it matters": "Longer timelines can usually carry more growth assets."},
                {"Question": "What does the board like today?", "Answer": plan["board_note"], "Why it matters": "Guru's Superbrain should influence how aggressive you are right now."},
                {"Question": "Suitable horizon", "Answer": plan["suitable_time_horizon"], "Why it matters": "A plan only makes sense if the time horizon matches the emotional and financial reality."},
                {"Question": "Safer alternative", "Answer": plan["safer_alternative"], "Why it matters": "TELAJ should always be able to explain the lower-stress version of the recommendation."},
            ]
        )
        st.dataframe(checklist, use_container_width=True, hide_index=True)
        reason_cols = st.columns([1, 1])
        _glass_card(
            reason_cols[0],
            "Why this plan fits",
            "<br>".join(plan["reasons"]),
            "Plain-English reasons for the recommendation.",
        )
        _glass_card(
            reason_cols[1],
            "Key risks",
            "<br>".join(plan["key_risks"]),
            plan["safer_alternative"],
        )


def _render_media_brief(container, media_brief: dict[str, object]) -> None:
    if BriefingEngine is not None:
        media_tone = BriefingEngine().build_media_tone(media_brief)
        tone = media_tone.tone
        tone_class = media_tone.tone_color
        summary = media_tone.summary
        commentary = media_tone.commentary
    else:
        tone = str(media_brief["tone"])
        tone_class = str(media_brief.get("tone_color", "neutral"))
        summary = str(media_brief["summary"])
        commentary = str(media_brief["commentary"])
    container.markdown(
        f"""
        <div class="media-brief {tone_class}">
            <div class="card-label">What the Media Says</div>
            <div class="brief-title">{tone}</div>
            <div class="brief-copy">{summary}</div>
            <div class="brief-meta">{commentary}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _render_media_headlines(media_brief: dict[str, object]) -> None:
    headlines = list(media_brief.get("headlines", []))
    if not headlines:
        st.info("No recent media headlines were available.")
        return
    rows = []
    for row in headlines[:5]:
        rows.append(
            {
                "source": row.get("source", ""),
                "headline": row.get("title", ""),
                "published": row.get("published", ""),
            }
        )
    st.dataframe(pd.DataFrame(rows), use_container_width=True)


def _render_scenario_lab(board: pd.DataFrame) -> None:
    st.markdown("### Scenario Lab")
    if not scenario_sim_enabled() or ScenarioEngine is None:
        _render_placeholder_module(
            title="Scenario Lab",
            body="Scenario Lab is reserved for macro shock tests, allocation stress, and what-if planning.",
            footer="Enable FEATURE_SCENARIO_SIM to turn on the educational stress-test module.",
        )
        return

    engine = ScenarioEngine()
    mode = st.segmented_control(
        "Scenario mode",
        options=["Household", "Portfolio"],
        default="Household",
        selection_mode="single",
    )

    if mode == "Household":
        profile = _current_family_profile()
        balance_sheet_inputs = _current_balance_sheet_inputs()
        has_balance_sheet = any(float(value) > 0 for value in balance_sheet_inputs.values())
        if not profile or not has_balance_sheet:
            st.info("Complete TELAJ onboarding and save the family balance sheet to unlock Household Scenario Lab.")
            return

        selected = st.selectbox(
            "Choose a household stress case",
            options=[
                ("income_drop", "Income Drop"),
                ("job_loss", "Job Loss"),
                ("rate_spike", "Rate Spike"),
                ("property_vacancy", "Property Vacancy"),
                ("market_drawdown", "Market Drawdown"),
                ("business_slowdown", "Business Slowdown"),
            ],
            format_func=lambda item: item[1],
            key="household_scenario_lab_select",
        )
        result = engine.run_household_scenario(
            scenario_name=selected[0],
            profile=profile,
            balance_sheet_inputs=balance_sheet_inputs,
        )

        top_cols = st.columns([1, 1, 1])
        _glass_card(
            top_cols[0],
            "Household impact",
            result["narrative"],
            f"Net worth effect: {result['net_worth_impact_pct']:.1f}%",
        )
        _glass_card(
            top_cols[1],
            "Reserve gap",
            f"{result['reserve_gap_months']:.1f} months",
            result["shock_description"],
        )
        _glass_card(
            top_cols[2],
            "Safer move",
            result["safer_move"],
            "The goal is to stay functional before chasing optimization.",
        )

        impact_rows = pd.DataFrame(
            [
                {"Category": "Monthly income change", "Impact": f"${result['monthly_income_change']:,.0f}"},
                {"Category": "Monthly expense change", "Impact": f"${result['monthly_expense_change']:,.0f}"},
                {"Category": "Monthly liability change", "Impact": f"${result['monthly_liability_change']:,.0f}"},
            ]
        )
        st.dataframe(impact_rows, use_container_width=True, hide_index=True)

        lower_cols = st.columns([1, 1])
        _glass_card(
            lower_cols[0],
            "Pressure points",
            "<br>".join(result["pressure_points"]),
            (
                f"Income ${float(balance_sheet_inputs.get('monthly_household_income', 0.0)):,.0f} | "
                f"Expenses ${float(balance_sheet_inputs.get('monthly_household_expenses', 0.0)):,.0f} | "
                f"Liability payments ${float(balance_sheet_inputs.get('monthly_liability_payment', 0.0)):,.0f}"
            ),
        )
        _glass_card(
            lower_cols[1],
            "Who this plan protects",
            profile["wealth_for"].replace("-", " ").title(),
            f"Primary goal: {profile['primary_goal'].title()} | Archetype: {profile['archetype']}",
        )
    else:
        snapshot = _safe_portfolio_snapshot()
        wealth_map = engine.wealth_map_from_snapshot(snapshot)
        selected = st.selectbox(
            "Choose a portfolio stress case",
            options=[
                ("rates_up", "Rates Up"),
                ("recession", "Recession"),
                ("inflation_spike", "Inflation Spike"),
                ("crypto_crash", "Crypto Crash"),
                ("tech_selloff", "Tech Selloff"),
                ("rental_vacancy", "Rental Vacancy"),
            ],
            format_func=lambda item: item[1],
            key="portfolio_scenario_lab_select",
        )
        result = engine.run_scenario(scenario_name=selected[0], wealth_map=wealth_map)

        top_cols = st.columns([1, 1, 1])
        _glass_card(
            top_cols[0],
            "Scenario impact",
            result["narrative"],
            f"Portfolio effect: {result['portfolio_impact_pct']:.1f}%",
        )
        _glass_card(
            top_cols[1],
            "Best holding bucket",
            result["best_bucket"].replace("_", " ").title(),
            result["shock_description"],
        )
        _glass_card(
            top_cols[2],
            "Weakest holding bucket",
            result["worst_bucket"].replace("_", " ").title(),
            "Educational only. This is a stress map, not a forecast.",
        )

        impact_rows = pd.DataFrame(
            [
                {"Bucket": "Cash", "Stress %": result["cash_impact_pct"]},
                {"Bucket": "Stocks", "Stress %": result["stocks_impact_pct"]},
                {"Bucket": "Bonds", "Stress %": result["bonds_impact_pct"]},
                {"Bucket": "Crypto", "Stress %": result["crypto_impact_pct"]},
                {"Bucket": "Real Estate", "Stress %": result["real_estate_impact_pct"]},
            ]
        )
        st.dataframe(impact_rows, use_container_width=True, hide_index=True)

        lower_cols = st.columns([1, 1])
        _glass_card(
            lower_cols[0],
            "Your current wealth map",
            (
                f"Cash {wealth_map.cash_pct:.1f}% | Stocks {wealth_map.stocks_pct:.1f}% | Bonds {wealth_map.bonds_pct:.1f}%<br>"
                f"Crypto {wealth_map.crypto_pct:.1f}% | Real Estate {wealth_map.real_estate_pct:.1f}%"
            ),
            f"Diversification {wealth_map.diversification_score}/100 | Risk {wealth_map.risk_score}/100",
        )
        _glass_card(
            lower_cols[1],
            "What to watch",
            "<br>".join(result["guidance"]),
            "The purpose is to make risk understandable before the market forces the lesson.",
        )


def _render_real_estate_lab() -> None:
    st.markdown("### Real Estate Lab")
    if not real_estate_lab_enabled() or RealEstateLab is None:
        _render_placeholder_module(
            title="Real Estate Lab",
            body="This section is reserved for educational property analysis, simple cash-flow math, and downside framing.",
            footer="Enable FEATURE_REAL_ESTATE_LAB to turn on the calculator module.",
        )
        return

    with st.form("real_estate_registry_form", clear_on_submit=False):
        reg_cols = st.columns([1, 1, 1, 1])
        property_name = reg_cols[0].text_input("Property name", value="")
        property_type = reg_cols[1].selectbox("Type", options=["Residential", "Multi-family", "Commercial", "Vacation", "Other"], index=0)
        estimated_value = reg_cols[2].number_input("Estimated value", min_value=0.0, max_value=20000000.0, value=350000.0, step=10000.0)
        mortgage_balance = reg_cols[3].number_input("Mortgage balance", min_value=0.0, max_value=20000000.0, value=200000.0, step=10000.0)
        reg_cols_2 = st.columns([1, 1, 1, 1])
        registry_rent = reg_cols_2[0].number_input("Monthly rent", min_value=0.0, max_value=100000.0, value=1800.0, step=50.0)
        registry_expenses = reg_cols_2[1].number_input("Monthly expenses", min_value=0.0, max_value=50000.0, value=500.0, step=25.0)
        registry_rate = reg_cols_2[2].number_input("Interest rate %", min_value=0.0, max_value=20.0, value=4.5, step=0.1)
        occupancy_status = reg_cols_2[3].selectbox("Occupancy", options=["occupied", "vacant", "owner occupied"], index=0)
        add_property = st.form_submit_button("Add property", type="primary", use_container_width=True)
        if add_property:
            st.session_state.real_estate_registry.append(
                {
                    "property_name": property_name or f"Property {len(st.session_state.real_estate_registry) + 1}",
                    "property_type": property_type,
                    "estimated_value": float(estimated_value),
                    "mortgage_balance": float(mortgage_balance),
                    "monthly_rent": float(registry_rent),
                    "monthly_expenses": float(registry_expenses),
                    "interest_rate_pct": float(registry_rate),
                    "occupancy_status": occupancy_status,
                }
            )
            save_family_wealth_state(
                profile=_current_family_profile(),
                balance_sheet=st.session_state.get("family_balance_sheet_inputs", {}),
                legacy_plan=st.session_state.get("legacy_plan_inputs", {}),
                real_estate_registry=st.session_state.real_estate_registry,
            )
            st.success("Property added to TELAJ registry.")
            st.rerun()

    portfolio = _current_real_estate_portfolio()
    summary = dict(portfolio.get("summary", {}))
    properties = list(portfolio.get("properties", []))
    if summary:
        top_cols = st.columns([1, 1, 1, 1, 1])
        _glass_card(top_cols[0], "Portfolio posture", str(summary["posture"]), "TELAJ reads property as part of family capital, not as a standalone hobby.")
        _glass_card(top_cols[1], "Property value", f"${float(summary['total_property_value']):,.0f}", f"Equity ${float(summary['total_equity']):,.0f}")
        _glass_card(top_cols[2], "Mortgage balance", f"${float(summary['total_mortgage_balance']):,.0f}", f"Avg rate {float(summary['average_interest_rate_pct']):.2f}%")
        _glass_card(top_cols[3], "Monthly cash flow", f"${float(summary['total_monthly_cash_flow']):,.0f}", "Across all saved properties.")
        _glass_card(top_cols[4], "Properties", str(len(properties)), "Registry count")

    if properties:
        rows = []
        for property_row in properties:
            rows.append(
                {
                    "Property": property_row["property_name"],
                    "Type": property_row["property_type"],
                    "Value": property_row["estimated_value"],
                    "Debt": property_row["mortgage_balance"],
                    "Equity": property_row["equity"],
                    "Cash Flow": property_row["analysis"]["monthly_cash_flow"],
                    "Decision": property_row["decision"]["decision"],
                }
            )
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

        selected_name = st.selectbox(
            "Review a saved property",
            options=[property_row["property_name"] for property_row in properties],
            key="real_estate_registry_select",
        )
        selected_property = next((property_row for property_row in properties if property_row["property_name"] == selected_name), properties[0])
        detail_cols = st.columns([1, 1, 1])
        _glass_card(detail_cols[0], "Decision", selected_property["decision"]["decision"], f"Confidence: {selected_property['decision']['confidence']}")
        _glass_card(detail_cols[1], "Why", "<br>".join(selected_property["decision"]["why"]), selected_property["analysis"]["summary"])
        _glass_card(detail_cols[2], "Risks", "<br>".join(selected_property["decision"]["risks"]), selected_property["decision"]["safer_option"])

    st.markdown("### Property Analysis Lab")
    controls = st.columns([1, 1, 1, 1])
    purchase_price = controls[0].number_input("Purchase price", min_value=50000.0, max_value=5000000.0, value=250000.0, step=10000.0)
    down_payment_pct = controls[1].slider("Down payment %", min_value=5, max_value=100, value=20, step=5)
    monthly_rent = controls[2].number_input("Monthly rent", min_value=0.0, max_value=100000.0, value=1400.0, step=50.0)
    rate_pct = controls[3].slider("Mortgage rate %", min_value=0.0, max_value=12.0, value=4.5, step=0.1)
    lower_controls = st.columns([1, 1, 1])
    monthly_expenses = lower_controls[0].number_input("Monthly expenses", min_value=0.0, max_value=50000.0, value=420.0, step=25.0)
    expected_appreciation_pct = lower_controls[1].slider("Expected appreciation %", min_value=-5.0, max_value=15.0, value=3.0, step=0.5)
    holding_period_years = int(lower_controls[2].selectbox("Holding period", options=[3, 5, 7, 10, 15, 20], index=2))

    analysis = RealEstateLab().analyze(
        purchase_price=float(purchase_price),
        down_payment_pct=float(down_payment_pct),
        monthly_rent=float(monthly_rent),
        rate_pct=float(rate_pct),
        monthly_expenses=float(monthly_expenses),
        expected_appreciation_pct=float(expected_appreciation_pct),
        holding_period_years=holding_period_years,
    )
    decision = RealEstateDecisionEngine().decide(analysis) if RealEstateDecisionEngine is not None else None

    metric_cols = st.columns(4)
    metric_cols[0].metric("Monthly Cash Flow", f"${analysis['monthly_cash_flow']:,.0f}")
    metric_cols[1].metric("Cap Rate", f"{analysis['cap_rate_pct']:.2f}%")
    metric_cols[2].metric("Cash-on-Cash", f"{analysis['cash_on_cash_pct']:.2f}%")
    metric_cols[3].metric("Stress Cash Flow", f"${analysis['downside_cash_flow']:,.0f}")

    lower_cols = st.columns([1, 1])
    _glass_card(
        lower_cols[0],
        "Base case",
        analysis["summary"],
        f"Estimated appreciation gain over hold: ${analysis['estimated_equity_gain']:,.0f}",
    )
    _glass_card(
        lower_cols[1],
        "Downside case",
        analysis["downside_summary"],
        "Stress case assumes softer rent and hotter expenses.",
    )
    if decision is not None:
        decision_cols = st.columns([1, 1, 1])
        _glass_card(decision_cols[0], "Real Estate Decision Engine", decision["decision"], f"Confidence: {decision['confidence']}")
        _glass_card(decision_cols[1], "Why", "<br>".join(decision["why"]), analysis["summary"])
        _glass_card(decision_cols[2], "Risks", "<br>".join(decision["risks"]), decision["safer_option"])
    with st.expander("Educational tax framing", expanded=False):
        st.info(analysis["tax_note"])
        st.caption("This is educational only and not tax, legal, or accounting advice.")


def _render_everyday_guide(
    board: pd.DataFrame,
    media_brief: dict[str, object],
    latest_signal: dict[str, object] | None,
) -> None:
    st.markdown("### Your Everyday Guide")
    if board.empty:
        st.info("Guru's Superbrain needs a little more data before it can give you a simple daily guide.")
        return
    next_move = str(latest_signal["label"]) if latest_signal is not None else "No saved stance yet"
    guide = None
    if BriefingEngine is not None:
        media_tone = BriefingEngine().build_media_tone(media_brief)
        guide = BriefingEngine().build_everyday_guide(
            board=board,
            media_tone=media_tone,
            machine_stance_label=next_move,
        )
    best = board.iloc[0]
    worst = board.iloc[-1]
    cols = st.columns([1, 1, 1])
    _glass_card(
        cols[0],
        "Best idea today",
        guide.best_idea_title if guide is not None else f"{best['ticker']} looks strongest right now.",
        guide.best_idea_footer if guide is not None else f"{best['action']} | Score {best['score']:.1f} | {best['copy']}",
    )
    _glass_card(
        cols[1],
        "Best thing to avoid",
        guide.avoid_title if guide is not None else f"{worst['ticker']} is the weakest setup on the board.",
        guide.avoid_footer if guide is not None else f"{worst['action']} | Score {worst['score']:.1f} | Better to wait than force it.",
    )
    _glass_card(
        cols[2],
        "What to do next",
        guide.next_step_title if guide is not None else _simple_next_step(str(best["action"]), str(media_brief["tone"]), next_move),
        guide.next_step_footer if guide is not None else f"Media tone: {media_brief['tone']} | Machine stance: {next_move}",
    )


@st.cache_data(ttl=3600, show_spinner=False)
def load_planner_history() -> pd.DataFrame:
    return get_investment_proxy_history(period="2y")


def _planner_comparison(history: pd.DataFrame, amount: float) -> pd.DataFrame:
    if planner_service_enabled() and PlanningEngine is not None:
        return PlanningEngine().build_investment_comparison(history, amount)
    return _build_investment_comparison(history, amount)


def _planner_money_genie_plan(
    *,
    amount: float,
    horizon_years: int,
    risk_profile: str,
    account_type: str,
    board: pd.DataFrame,
) -> dict[str, object]:
    if planner_service_enabled() and PlanningEngine is not None:
        return PlanningEngine().build_money_genie_plan(
            amount=amount,
            horizon_years=horizon_years,
            risk_profile=risk_profile,
            account_type=account_type,
            board=board,
        )
    return _build_money_genie_plan(
        amount=amount,
        horizon_years=horizon_years,
        risk_profile=risk_profile,
        account_type=account_type,
        board=board,
    )


def _build_investment_comparison(history: pd.DataFrame, amount: float) -> pd.DataFrame:
    trailing = history.dropna().tail(252)
    if trailing.empty:
        return pd.DataFrame(columns=["Asset", "Value Today", "Return %"])
    rows = []
    for label in trailing.columns:
        start = float(trailing[label].iloc[0])
        end = float(trailing[label].iloc[-1])
        value_today = 0.0 if start <= 0 else amount * (end / start)
        rows.append(
            {
                "Asset": label,
                "Value Today": round(value_today, 2),
                "Return %": round(((value_today / amount) - 1.0) * 100.0 if amount > 0 else 0.0, 1),
            }
        )
    return pd.DataFrame(rows).sort_values("Value Today", ascending=False).reset_index(drop=True)


def _build_planner_growth_chart(history: pd.DataFrame, amount: float) -> go.Figure:
    trailing = history.dropna().tail(252)
    figure = go.Figure()
    for label in trailing.columns:
        normalized = trailing[label] / float(trailing[label].iloc[0]) * amount
        figure.add_trace(
            go.Scatter(
                x=normalized.index,
                y=normalized.values,
                mode="lines",
                name=label,
                line=dict(width=2),
            )
        )
    figure.update_layout(
        template="plotly_white",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="#FFFFFF",
        title="What your money would have done over the past 12 months",
        margin=dict(l=10, r=10, t=40, b=10),
        height=320,
        legend=dict(orientation="h"),
        xaxis=dict(showgrid=False, color="#111111"),
        yaxis=dict(showgrid=False, color="#111111"),
    )
    return figure


def _build_money_genie_plan(
    *,
    amount: float,
    horizon_years: int,
    risk_profile: str,
    account_type: str,
    board: pd.DataFrame,
) -> dict[str, object]:
    top_buy = board[board["action"] == "BUY"].iloc[0]["ticker"] if not board.empty and (board["action"] == "BUY").any() else None
    if risk_profile == "Very low":
        allocation = [
            {"label": "Treasury bonds", "weight": 40},
            {"label": "Cash / T-Bills", "weight": 25},
            {"label": "US stocks ETF", "weight": 20},
            {"label": "Real estate ETF", "weight": 10},
            {"label": "Gold", "weight": 5},
        ]
    elif risk_profile == "Growth":
        allocation = [
            {"label": "US stocks ETF", "weight": 40},
            {"label": "Tech stocks ETF", "weight": 20},
            {"label": "Real estate ETF", "weight": 10},
            {"label": "Treasury bonds", "weight": 15},
            {"label": "Cash / T-Bills", "weight": 5},
            {"label": "Bitcoin", "weight": 10},
        ]
    else:
        allocation = [
            {"label": "US stocks ETF", "weight": 35},
            {"label": "Treasury bonds", "weight": 25},
            {"label": "Tech stocks ETF", "weight": 10},
            {"label": "Real estate ETF", "weight": 10},
            {"label": "Cash / T-Bills", "weight": 15},
            {"label": "Gold", "weight": 5},
        ]

    if horizon_years <= 3:
        for item in allocation:
            if item["label"] in {"Treasury bonds", "Cash / T-Bills"}:
                item["weight"] += 5
            if item["label"] in {"Tech stocks ETF", "Bitcoin"}:
                item["weight"] = max(item["weight"] - 5, 0)

    summary = (
        f"With about ${amount:,.0f}, the safest smart move is to spread your money instead of betting it all on one story. "
        f"{'Right now the board likes ' + str(top_buy) + ', but only as part of a mix.' if top_buy else 'Right now the board is not screaming for a big risk-on move.'}"
    )
    board_note = f"Best current board idea: {top_buy}" if top_buy else "The board is mostly cautious today."
    account_note = (
        "A Roth IRA usually makes sense for long-term tax-free growth if you qualify."
        if account_type == "Roth IRA"
        else "A 401(k) is often strongest when employer matching is available."
        if account_type == "401(k)"
        else "A normal taxable account gives flexibility, but taxes matter more."
        if account_type == "Taxable account"
        else "If you are not sure, start with the mix first and decide the account wrapper second."
    )
    footer = f"Risk style: {risk_profile} | Time horizon: {horizon_years} years"
    return {
        "allocation": allocation,
        "summary": summary,
        "footer": footer,
        "account_note": account_note,
        "board_note": board_note,
    }


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
    st.markdown("#### How You Are Doing")
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
    if MarketBrainService is not None:
        pulse = MarketBrainService().build_pulse_summary(
            regime_snapshot=regime_snapshot,
            stress_snapshot=stress_snapshot,
        )
        return {
            "mode": pulse.mode,
            "score": pulse.score,
            "label": pulse.label,
            "narrative": pulse.narrative,
            "message": pulse.message,
        }
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
    if MarketBrainService is not None:
        return MarketBrainService().superbrain_rating(score)
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


def _plain_english_rating_explainer(row) -> str:
    if row.action == "BUY":
        return (
            f"{row.ticker} is near the top because price strength is holding up and the machine sees fewer reasons to stay away. "
            "That still means start small and stay disciplined."
        )
    if row.action == "HOLD":
        return (
            f"{row.ticker} is not weak enough to avoid, but not strong enough to chase. "
            "The safe interpretation is: keep it on the watchlist, but do not rush."
        )
    return (
        f"{row.ticker} ranks low because the setup looks fragile, noisy, or both. "
        "For most people, waiting is better than hoping."
    )


def _simple_next_step(best_action: str, media_tone: str, next_move: str) -> str:
    if best_action == "BUY" and media_tone != "Defensive":
        return "Start small with the strongest idea, then let the machine earn the right to add more."
    if "Capital Preservation" in next_move or best_action == "PROTECT":
        return "Do less for now. Cash and patience are real positions when the market feels unstable."
    return "Watch first, then move slowly. The machine is not seeing a clean all-clear yet."


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
    if MarketBrainService is not None:
        return MarketBrainService().build_board_frame(pipeline=pipeline, tickers=tickers)
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
    st.markdown("### Top Ideas Right Now")
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
    _glass_card(hero_cols[1], "How brave the board feels", f"{buy_count} Buy | {hold_count} Hold | {protect_count} Protect", "This tells you whether the machine feels bold, patient, or defensive.")
    _glass_card(hero_cols[2], "Average strength", f"{board['score'].mean():.1f}", f"Best {board['score'].max():.1f} | Worst {board['score'].min():.1f}")
    display = board[["ticker", "score", "action", "rating", "momentum_20d", "drawdown_20d", "volatility_20d"]].copy()
    display["score"] = display["score"].round(1)
    display["momentum_20d"] = display["momentum_20d"].round(1)
    display["drawdown_20d"] = display["drawdown_20d"].round(1)
    display["volatility_20d"] = display["volatility_20d"].round(1)
    display = display.rename(
        columns={
            "ticker": "Asset",
            "score": "Superbrain Score",
            "action": "Simple Call",
            "rating": "What it means",
            "momentum_20d": "20-day move %",
            "drawdown_20d": "Pullback %",
            "volatility_20d": "Volatility %",
        }
    )
    st.dataframe(display, use_container_width=True)
    with st.expander("Why each idea got its rating", expanded=False):
        for row in board.itertuples():
            _glass_card(
                st,
                f"{row.ticker} explained simply",
                _plain_english_rating_explainer(row),
                f"Score {row.score:.1f} | Call: {row.action}",
            )


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
    result = _portfolio_doctor_result(positions=positions, equity=equity, cash=cash, board=board)
    _glass_card(st, "Portfolio diagnosis", str(result["diagnosis"]), str(result["footer"]))
    st.dataframe(pd.DataFrame(result["checklist"]), use_container_width=True, hide_index=True)


def _render_portfolio_checklist(*, cash_pct: float, concentration: float, conflict_symbols: list[str]) -> None:
    checklist = pd.DataFrame(
        [
            {
                "Simple check": "Do I have too much in one thing?",
                "Answer": "Yes" if concentration >= 60 else "No",
                "What it means": "One asset dominates the account." if concentration >= 60 else "Your money is not trapped in one bet.",
            },
            {
                "Simple check": "Am I mostly sitting in cash?",
                "Answer": "Yes" if cash_pct >= 70 else "No",
                "What it means": "That is okay if the board is scared." if cash_pct >= 70 else "You already have some money at work.",
            },
            {
                "Simple check": "Do my holdings fight the model?",
                "Answer": "Yes" if conflict_symbols else "No",
                "What it means": f"Conflicts: {', '.join(conflict_symbols[:3])}" if conflict_symbols else "Your holdings broadly agree with the current board.",
            },
        ]
    )
    st.dataframe(checklist, use_container_width=True, hide_index=True)


def _portfolio_doctor_result(*, positions: list[dict[str, object]], equity: float, cash: float, board: pd.DataFrame) -> dict[str, object]:
    if portfolio_doctor_service_enabled() and PortfolioDoctorService is not None:
        return PortfolioDoctorService().diagnose(positions=positions, equity=equity, cash=cash, board=board)

    if not positions:
        cash_pct = 0.0 if equity <= 0 else (cash / max(equity, 1e-9)) * 100.0
        return {
            "diagnosis": "The account is mostly idle. That is acceptable if the board is defensive, but expensive if strong BUY scores are being ignored.",
            "footer": f"Cash share: {cash_pct:.1f}% | Board top pick: {board.iloc[0]['ticker'] if not board.empty else 'n/a'}",
            "checklist": [
                {
                    "Simple check": "Do I have too much in one thing?",
                    "Answer": "No",
                    "What it means": "Your money is not trapped in one bet.",
                },
                {
                    "Simple check": "Am I mostly sitting in cash?",
                    "Answer": "Yes" if cash_pct >= 70 else "No",
                    "What it means": "That is okay if the board is scared." if cash_pct >= 70 else "You already have some money at work.",
                },
                {
                    "Simple check": "Do my holdings fight the model?",
                    "Answer": "No",
                    "What it means": "No live holdings are currently fighting the model.",
                },
            ],
        }

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
    cash_pct = 0.0 if equity <= 0 else (cash / max(equity, 1e-9)) * 100.0
    return {
        "diagnosis": diagnosis,
        "footer": foot,
        "checklist": [
            {
                "Simple check": "Do I have too much in one thing?",
                "Answer": "Yes" if concentration >= 60 else "No",
                "What it means": "One asset dominates the account." if concentration >= 60 else "Your money is not trapped in one bet.",
            },
            {
                "Simple check": "Am I mostly sitting in cash?",
                "Answer": "Yes" if cash_pct >= 70 else "No",
                "What it means": "That is okay if the board is scared." if cash_pct >= 70 else "You already have some money at work.",
            },
            {
                "Simple check": "Do my holdings fight the model?",
                "Answer": "Yes" if conflict_symbols else "No",
                "What it means": f"Conflicts: {', '.join(conflict_symbols[:3])}" if conflict_symbols else "Your holdings broadly agree with the current board.",
            },
        ],
    }


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
    if BriefingEngine is not None and MarketPulseSummary is not None:
        return BriefingEngine().build_hype_copy(
            sentiment_score=sentiment_score,
            pulse=MarketPulseSummary(**pulse),
        )
    if sentiment_score >= 75 and pulse["mode"] == "capital_preservation":
        return "The internet is screaming 'To the Moon.' The Guru is looking at the actual interest rates. One of them is lying. Hint: It's the one with the rocket emoji."
    if sentiment_score >= 75:
        return "The crowd finally found a pulse. Fine. Just remember volume is not wisdom."
    if sentiment_score <= 35 and pulse["mode"] == "risk_on_expansion":
        return "Retail is sulking while the macro tape improves. That usually means the market is already leaving without them."
    return "Noise is moderate. Which is perfect, because serious money prefers rooms without chanting."


def _guru_briefing(regime_snapshot: dict[str, float | str], pulse: dict[str, object], bundle: str) -> str:
    if BriefingEngine is not None and MarketPulseSummary is not None:
        return BriefingEngine().build_daily_briefing(
            regime_snapshot=regime_snapshot,
            pulse=MarketPulseSummary(**pulse),
            bundle=bundle,
        ).body
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
    if "onboarding_state" not in st.session_state:
        st.session_state.onboarding_state = asdict(OnboardingState())
    if "family_balance_sheet_inputs" not in st.session_state:
        st.session_state.family_balance_sheet_inputs = {}
    if "legacy_plan_inputs" not in st.session_state:
        st.session_state.legacy_plan_inputs = {}
    if "real_estate_registry" not in st.session_state:
        st.session_state.real_estate_registry = []

    saved_family_state = load_family_wealth_state()
    if saved_family_state:
        saved_profile = saved_family_state.get("profile", {})
        saved_balance_sheet = saved_family_state.get("balance_sheet", {})
        saved_legacy_plan = saved_family_state.get("legacy_plan", {})
        saved_real_estate_registry = saved_family_state.get("real_estate_registry", [])
        if saved_profile and not st.session_state.onboarding_state.get("profile"):
            st.session_state.onboarding_state["profile"] = saved_profile
            st.session_state.onboarding_state["completed"] = True
        if saved_balance_sheet and not st.session_state.family_balance_sheet_inputs:
            st.session_state.family_balance_sheet_inputs = saved_balance_sheet
        if saved_legacy_plan and not st.session_state.legacy_plan_inputs:
            st.session_state.legacy_plan_inputs = saved_legacy_plan
        if saved_real_estate_registry and not st.session_state.real_estate_registry:
            st.session_state.real_estate_registry = saved_real_estate_registry


def _onboarding_questions() -> list[dict[str, object]]:
    return [
        {
            "key": "owned_assets",
            "question": "What assets do you currently own?",
            "options": [
                "Mostly cash and savings",
                "Stocks, ETFs, or retirement accounts",
                "Real estate or property",
                "Business ownership or private assets",
                "A mix of several asset types",
            ],
        },
        {
            "key": "liabilities",
            "question": "What liabilities do you currently have?",
            "options": [
                "No meaningful debt",
                "A mortgage only",
                "Mortgage plus some loans",
                "Consumer or credit card debt",
                "A heavy mix of liabilities",
            ],
        },
        {
            "key": "liquidity_profile",
            "question": "How much of your wealth is liquid?",
            "options": [
                "Most of it is liquid",
                "About half is liquid",
                "A smaller share is liquid",
                "Very little is liquid",
                "I am not sure",
            ],
        },
        {
            "key": "primary_goal",
            "question": "What are you trying to build?",
            "options": ["safety", "income", "growth", "legacy"],
        },
        {
            "key": "wealth_for",
            "question": "Who is this wealth for?",
            "options": ["me", "spouse", "children", "multi-generational"],
        },
        {
            "key": "drawdown_response",
            "question": "If your portfolio drops 20%, what do you do?",
            "options": ["Sell quickly", "Wait and watch", "Hold steady", "Buy more", "I do not know"],
        },
        {
            "key": "invested_assets",
            "question": "What assets do you already invest in?",
            "options": ["None yet", "Stocks or ETFs", "Crypto", "Real estate", "A mix of assets"],
        },
    ]


def _render_onboarding_gate() -> None:
    state = st.session_state.onboarding_state
    questions = _onboarding_questions()
    step = max(0, min(int(state["current_step"]), len(questions) - 1))
    current = questions[step]
    current_key = str(current["key"])
    current_question = str(current["question"])
    options = list(current["options"])
    current_answer = str(state["answers"].get(current_key, options[0]))

    st.markdown(
        f"""
        <div class="onboarding-shell">
            <div class="onboarding-progress">{step + 1}/7</div>
            <div class="onboarding-kicker">TELAJ START</div>
            <div class="onboarding-question">{current_question}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    choice = st.radio(
        "Choose one answer",
        options=options,
        index=options.index(current_answer) if current_answer in options else 0,
        label_visibility="collapsed",
    )

    nav_cols = st.columns([1, 1])
    back_disabled = step == 0
    back_clicked = nav_cols[0].button("Back", use_container_width=True, disabled=back_disabled)
    next_label = "Finish" if step == len(questions) - 1 else "Next"
    next_clicked = nav_cols[1].button(next_label, use_container_width=True, type="primary")

    if back_clicked:
        state["current_step"] = max(step - 1, 0)
        st.rerun()

    if next_clicked:
        state["answers"][current_key] = choice
        if step >= len(questions) - 1:
            state["completed"] = True
            if OnboardingEngine is not None:
                state["profile"] = OnboardingEngine().build_family_profile(state["answers"])
                save_family_wealth_state(
                    profile=state["profile"],
                    balance_sheet=st.session_state.get("family_balance_sheet_inputs", {}),
                    legacy_plan=st.session_state.get("legacy_plan_inputs", {}),
                    real_estate_registry=st.session_state.get("real_estate_registry", []),
                )
        else:
            state["current_step"] = step + 1
        st.session_state.onboarding_state = state
        st.rerun()


def _inject_onboarding_styles() -> None:
    st.markdown(
        """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap');
            :root {
                --ob-bg: #0A0A0B;
                --ob-panel: #111113;
                --ob-border: #2A2A2E;
                --ob-text: #F4F6FB;
                --ob-muted: #A5ACB8;
                --ob-accent: #1F6BFF;
                --ob-accent-soft: rgba(31, 107, 255, 0.14);
            }
            .stApp {
                background: var(--ob-bg);
                color: var(--ob-text);
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            }
            [data-testid="stSidebar"],
            [data-testid="collapsedControl"],
            [data-testid="stHeader"] {
                display: none;
            }
            .block-container {
                max-width: 860px;
                padding-top: 5rem;
                padding-bottom: 3rem;
            }
            .onboarding-shell {
                border: 2px solid var(--ob-border);
                background: var(--ob-panel);
                padding: 1.5rem 1.5rem 2rem 1.5rem;
                margin-bottom: 1.4rem;
            }
            .onboarding-progress {
                font-family: "JetBrains Mono", ui-monospace, monospace;
                font-size: 0.82rem;
                color: var(--ob-muted);
                margin-bottom: 0.75rem;
            }
            .onboarding-kicker {
                font-family: "JetBrains Mono", ui-monospace, monospace;
                font-size: 0.74rem;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--ob-accent);
                margin-bottom: 0.8rem;
            }
            .onboarding-question {
                font-size: clamp(2.1rem, 4vw, 4.4rem);
                font-weight: 700;
                line-height: 0.98;
                color: var(--ob-text);
                max-width: 13ch;
            }
            div[role="radiogroup"] > label {
                border: 2px solid var(--ob-border);
                background: var(--ob-panel);
                padding: 1rem 1.05rem;
                margin-bottom: 0.85rem;
            }
            div[role="radiogroup"] > label:hover {
                border-color: var(--ob-accent);
                background: var(--ob-accent-soft);
            }
            div[role="radiogroup"] label p {
                color: var(--ob-text) !important;
                font-weight: 500;
            }
            .stButton > button {
                border: 2px solid var(--ob-border);
                border-radius: 0;
                font-weight: 700;
                min-height: 3rem;
                background: var(--ob-panel);
                color: var(--ob-text);
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


def _inject_styles() -> None:
    # Current check point for FEATURE_NEW_THEME.
    # Disabling the flag falls back to Streamlit defaults without changing the rest of the app.
    if not new_theme_enabled():
        return
    st.markdown(
        """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
            :root {
                --bg: #0A0A0B;
                --surface: #111113;
                --panel: #151518;
                --border: #2A2A2E;
                --text: #F3F4F6;
                --muted: #A3A8B3;
                --accent: #1F6BFF;
                --accent-strong: #3D8BFF;
                --accent-soft: #6FA8FF;
                --red: #FF4D4F;
                --green: #2ECC71;
                --soft: #111113;
            }
            @keyframes riseIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulseLine {
                0% { border-color: var(--border); }
                50% { border-color: rgba(61, 139, 255, 0.65); }
                100% { border-color: var(--border); }
            }
            .stApp {
                background: var(--bg);
                color: var(--text);
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            }
            [data-testid="stHeader"] { background: rgba(10, 10, 11, 0.98); border-bottom: 1px solid var(--border); }
            [data-testid="stToolbar"], [data-testid="stDecoration"] { background: transparent; }
            [data-testid="stAppViewContainer"] { background: var(--bg); }
            .block-container { max-width: 1180px; padding-top: 1.2rem; padding-bottom: 4rem; }
            .hero-kicker, .card-label {
                color: var(--accent-soft);
                text-transform: uppercase;
                letter-spacing: 0.14rem;
                font-size: 0.82rem;
                margin-bottom: 0.4rem;
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .hero-title {
                color: var(--text);
                font-size: 3rem;
                font-weight: 700;
                line-height: 1.02;
                margin-bottom: 0.5rem;
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
                animation: riseIn 0.55s ease-out;
            }
            .hero-copy, .card-copy, .card-meta, .hero-message {
                color: var(--muted);
                font-size: 1rem;
                line-height: 1.55;
            }
            .hero-card, .glass-card, .signal-card, .bundle-card {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 1rem 1.1rem;
                margin-bottom: 1rem;
                box-shadow: none;
                animation: riseIn 0.45s ease-out;
                transition: border-color 0.18s ease, transform 0.18s ease;
            }
            .hero-card:hover, .glass-card:hover, .signal-card:hover, .bundle-card:hover, .intent-card:hover, .brief-lead:hover, .media-brief:hover {
                border-color: var(--accent);
                transform: translateY(-1px);
            }
            .shell-frame {
                background: var(--surface);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 1rem 1.1rem;
                margin-bottom: 1rem;
                animation: riseIn 0.4s ease-out;
            }
            .shell-kicker {
                color: var(--accent-soft);
                text-transform: uppercase;
                letter-spacing: 0.14rem;
                font-size: 0.75rem;
                margin-bottom: 0.45rem;
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .shell-title {
                color: var(--text);
                font-size: 1.55rem;
                font-weight: 700;
                line-height: 1.08;
                margin-bottom: 0.35rem;
            }
            .shell-copy {
                color: var(--muted);
                font-size: 0.95rem;
                line-height: 1.5;
                max-width: 72ch;
            }
            .shell-strip {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.75rem;
                margin-top: 1rem;
            }
            .shell-strip-block {
                border: 1px solid var(--border);
                border-radius: 4px;
                padding: 0.8rem 0.85rem;
                background: rgba(31, 107, 255, 0.05);
            }
            .shell-strip-label {
                color: var(--accent-soft);
                text-transform: uppercase;
                letter-spacing: 0.12rem;
                font-size: 0.7rem;
                font-family: "JetBrains Mono", ui-monospace, monospace;
                margin-bottom: 0.35rem;
            }
            .shell-strip-value {
                color: var(--text);
                font-size: 1rem;
                font-weight: 700;
            }
            .shell-card {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 0.85rem 0.9rem;
                min-height: 7.4rem;
                margin-bottom: 0.8rem;
                position: relative;
                overflow: hidden;
            }
            .shell-card::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, var(--accent), transparent);
                opacity: 0.7;
            }
            .shell-card-code {
                color: rgba(111, 168, 255, 0.24);
                font-family: "JetBrains Mono", ui-monospace, monospace;
                font-size: 2rem;
                font-weight: 700;
                line-height: 1;
                margin-bottom: 0.45rem;
            }
            .shell-card-label {
                color: var(--accent-soft);
                text-transform: uppercase;
                letter-spacing: 0.1rem;
                font-size: 0.76rem;
                margin-bottom: 0.5rem;
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .shell-card-note {
                color: var(--muted);
                font-size: 0.83rem;
                line-height: 1.4;
            }
            .shell-card-footer {
                color: var(--text);
                font-size: 0.72rem;
                text-transform: uppercase;
                letter-spacing: 0.12rem;
                margin-top: 0.65rem;
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .mission-grid {
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 0.85rem;
                margin-bottom: 1rem;
            }
            .mission-card {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 0.95rem 1rem;
                min-height: 10rem;
            }
            .mission-title {
                color: var(--text);
                font-size: 1.35rem;
                line-height: 1.1;
                font-weight: 700;
                margin-bottom: 0.35rem;
            }
            .mission-copy {
                color: var(--muted);
                font-size: 0.83rem;
                line-height: 1.45;
                min-height: 2.8rem;
                margin-bottom: 0.75rem;
            }
            .meter-track {
                width: 100%;
                height: 8px;
                background: #1C1D21;
                border: 1px solid var(--border);
                border-radius: 999px;
                overflow: hidden;
            }
            .meter-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent), var(--accent-soft));
            }
            .meter-track.danger .meter-fill.danger {
                background: linear-gradient(90deg, #FF6B6B, var(--red));
            }
            .signal-strip {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.85rem;
                margin-bottom: 1rem;
            }
            .signal-strip-block {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 1rem 1.05rem;
                min-height: 8rem;
            }
            .signal-strip-value {
                color: var(--text);
                font-size: 1.3rem;
                font-weight: 700;
                line-height: 1.15;
                margin-bottom: 0.35rem;
            }
            .signal-strip-note {
                color: var(--muted);
                font-size: 0.86rem;
                line-height: 1.45;
            }
            .brief-lead, .media-brief {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 1.1rem 1.15rem 1rem 1.15rem;
                min-height: 100%;
                box-shadow: none;
                animation: riseIn 0.45s ease-out;
            }
            .brief-title {
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
                font-size: 1.8rem;
                line-height: 1.08;
                color: var(--text);
                margin-bottom: 0.45rem;
            }
            .brief-copy {
                font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
                font-size: 1.05rem;
                line-height: 1.6;
                color: var(--text);
                margin-bottom: 0.55rem;
            }
            .brief-meta {
                color: var(--muted);
                font-size: 0.92rem;
                border-top: 1px solid var(--border);
                padding-top: 0.65rem;
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .media-brief.green { border-left: 4px solid var(--green); }
            .media-brief.red { border-left: 4px solid var(--red); }
            .media-brief.neutral { border-left: 4px solid var(--accent); }
            .intent-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            .intent-card {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 6px;
                padding: 1rem 1.1rem;
                box-shadow: none;
                animation: riseIn 0.5s ease-out;
                transition: border-color 0.18s ease, transform 0.18s ease;
            }
            .status-badge {
                display: inline-block;
                padding: 0.55rem 0.85rem;
                border-radius: 999px;
                border: 1px solid var(--border);
                margin-bottom: 1rem;
                font-size: 0.92rem;
                font-weight: 600;
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .status-badge.connected {
                background: rgba(31, 107, 255, 0.08);
                color: var(--accent-soft);
            }
            .status-badge.disconnected {
                background: rgba(255, 77, 79, 0.08);
                color: var(--red);
            }
            .hero-flex { display: flex; gap: 1rem; align-items: center; }
            .hero-mode { color: var(--text); font-size: 1.65rem; font-weight: 700; margin-bottom: 0.35rem; }
            .donut { width: 180px; height: 180px; flex-shrink: 0; }
            .donut-track { fill: none; stroke: #22242A; stroke-width: 12; }
            .donut-ring { fill: none; stroke-width: 12; stroke-linecap: round; }
            .donut-score { fill: var(--text); font-size: 22px; font-weight: 700; }
            .donut-caption { fill: var(--muted); font-size: 11px; }
            .signal-action { font-size: 1.45rem; font-weight: 700; margin-bottom: 0.4rem; }
            .signal-action.buy { color: var(--green); }
            .signal-action.protect { color: var(--red); }
            .stButton > button {
                min-height: 48px;
                background: var(--surface);
                color: var(--text);
                border: 1.5px solid var(--border);
                border-radius: 4px;
                font-weight: 700;
                transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
            }
            .stButton > button:hover {
                transform: translateY(-1px);
                background: var(--surface);
                color: var(--accent-soft);
                border-color: var(--accent);
            }
            [data-testid="stSidebar"] { background: var(--soft); border-right: 1px solid var(--border); }
            .stMetric {
                background: var(--panel);
                border: 1.5px solid var(--border);
                border-radius: 4px;
                padding: 0.5rem 0.75rem;
            }
            label, .stMarkdown, .stCaption, .stTextInput, .stNumberInput, .stSelectbox, .stSlider, .stRadio {
                color: var(--text) !important;
            }
            [data-testid="stMetricValue"], [data-testid="stMetricDelta"], .run-time, .run-countdown {
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .card-meta, .shadow-value, .shadow-label {
                font-family: "JetBrains Mono", ui-monospace, monospace;
            }
            .shadow-ticker {
                background: var(--surface);
                border: 1.5px solid var(--border);
                border-radius: 4px;
                padding: 0.9rem 1rem;
                margin-top: 1rem;
                color: var(--text);
                animation: pulseLine 4s linear infinite;
            }
            @media (max-width: 768px) {
                .hero-flex { flex-direction: column; align-items: flex-start; }
                .hero-title { font-size: 2.2rem; }
                .intent-grid { grid-template-columns: 1fr; }
                .shell-strip, .signal-strip, .mission-grid { grid-template-columns: 1fr; }
                .brief-title { font-size: 1.45rem; }
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
