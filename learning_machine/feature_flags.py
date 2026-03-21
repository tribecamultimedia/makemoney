from __future__ import annotations

import os
from dataclasses import dataclass


def _parse_bool(raw: object, *, default: bool) -> bool:
    if raw is None:
        return default
    value = str(raw).strip().lower()
    if value in {"1", "true", "yes", "on"}:
        return True
    if value in {"0", "false", "no", "off"}:
        return False
    return default


def _streamlit_flag(name: str) -> object | None:
    try:
        import streamlit as st  # type: ignore
    except Exception:
        return None
    try:
        return st.secrets.get(name)
    except Exception:
        return None


def _raw_flag(name: str) -> object | None:
    streamlit_value = _streamlit_flag(name)
    if streamlit_value is not None:
        return streamlit_value
    return os.getenv(name)


def is_enabled(name: str, *, default: bool = False) -> bool:
    return _parse_bool(_raw_flag(name), default=default)


@dataclass(frozen=True, slots=True)
class FeatureFlags:
    planning_service: bool
    portfolio_doctor_service: bool
    onboarding_gate: bool
    wealth_map: bool
    simple_mode: bool
    pro_mode: bool
    real_estate_lab: bool
    scenario_sim: bool
    telaj_prep: bool
    new_theme: bool


def load_feature_flags() -> FeatureFlags:
    return FeatureFlags(
        planning_service=is_enabled("FEATURE_PLANNING_SERVICE", default=True),
        portfolio_doctor_service=is_enabled("FEATURE_PORTFOLIO_DOCTOR_SERVICE", default=True),
        onboarding_gate=is_enabled("FEATURE_ONBOARDING_GATE", default=False),
        wealth_map=is_enabled("FEATURE_WEALTH_MAP", default=False),
        simple_mode=is_enabled("FEATURE_SIMPLE_MODE", default=True),
        pro_mode=is_enabled("FEATURE_PRO_MODE", default=False),
        real_estate_lab=is_enabled("FEATURE_REAL_ESTATE_LAB", default=False),
        scenario_sim=is_enabled("FEATURE_SCENARIO_SIM", default=False),
        telaj_prep=is_enabled("FEATURE_TELAJ_PREP", default=False),
        new_theme=is_enabled("FEATURE_NEW_THEME", default=True),
    )


def planning_service_enabled() -> bool:
    return load_feature_flags().planning_service


def portfolio_doctor_service_enabled() -> bool:
    return load_feature_flags().portfolio_doctor_service


def onboarding_gate_enabled() -> bool:
    return load_feature_flags().onboarding_gate


def wealth_map_enabled() -> bool:
    return load_feature_flags().wealth_map


def simple_mode_enabled() -> bool:
    return load_feature_flags().simple_mode


def pro_mode_enabled() -> bool:
    return load_feature_flags().pro_mode


def real_estate_lab_enabled() -> bool:
    return load_feature_flags().real_estate_lab


def scenario_sim_enabled() -> bool:
    return load_feature_flags().scenario_sim


def telaj_prep_enabled() -> bool:
    return load_feature_flags().telaj_prep


def new_theme_enabled() -> bool:
    return load_feature_flags().new_theme

