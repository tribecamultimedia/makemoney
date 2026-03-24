from __future__ import annotations

import json
import os
from datetime import UTC, datetime
from zoneinfo import ZoneInfo

from .notifications import LinkedInNotifier
from .signal_worker import DEFAULT_APP_URL, SignalState, build_signal_state
from .storage import load_linkedin_post_state, save_linkedin_post_state


def _bool_env(name: str) -> bool:
    return os.getenv(name, "").strip().lower() in {"1", "true", "yes", "on"}


def _now_in_timezone(name: str) -> datetime:
    try:
        return datetime.now(ZoneInfo(name))
    except Exception:
        return datetime.now(UTC)


def build_linkedin_commentary(state: SignalState, *, app_url: str) -> str:
    top = state.top_signals[0] if state.top_signals else {}
    lead_signal = str(top.get("signal", "hold")).upper()
    lead_ticker = str(top.get("ticker", "SPY"))
    lead_why = str(top.get("why", state.reason))
    safer = str(top.get("safer", "Move in tranches instead of all at once."))

    lines = [
        f"TELAJ Today: {state.label}.",
        f"Primary move: {lead_signal} {lead_ticker}.",
        lead_why,
        f"Safer option: {safer}",
        f"Decision engine view: {state.message}",
        f"More at {app_url}",
    ]
    return "\n".join(line.strip() for line in lines if line.strip())


def should_skip_post(*, local_date: str, force_post: bool) -> bool:
    if force_post:
        return False
    previous = load_linkedin_post_state()
    if not previous:
        return False
    return str(previous.get("local_date", "")) == local_date


def main() -> None:
    fred_api_key = os.getenv("FRED_API_KEY")
    access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    organization_urn = os.getenv("LINKEDIN_ORGANIZATION_URN")
    app_url = os.getenv("APP_URL") or "https://telaj.com"
    linkedin_version = os.getenv("LINKEDIN_VERSION") or "202601"
    timezone_name = os.getenv("LINKEDIN_POST_TIMEZONE") or "Europe/Rome"
    dry_run = _bool_env("LINKEDIN_DRY_RUN")
    force_post = _bool_env("LINKEDIN_FORCE_POST")

    if not fred_api_key:
        raise RuntimeError("FRED_API_KEY is required for the LinkedIn worker.")
    if not access_token or not organization_urn:
        raise RuntimeError("LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_URN are required for LinkedIn posting.")

    now_local = _now_in_timezone(timezone_name)
    local_date = now_local.date().isoformat()
    if should_skip_post(local_date=local_date, force_post=force_post):
        print(json.dumps({"posted": False, "reason": "already_posted_today", "local_date": local_date}))
        return

    state = build_signal_state(fred_api_key=fred_api_key)
    commentary = build_linkedin_commentary(state, app_url=app_url or DEFAULT_APP_URL)
    notifier = LinkedInNotifier(
        access_token=access_token,
        organization_urn=organization_urn,
        app_url=app_url or DEFAULT_APP_URL,
        version=linkedin_version,
        dry_run=dry_run,
    )
    result = notifier.post_organization_update(
        commentary=commentary,
        article_url=app_url or DEFAULT_APP_URL,
        article_title="TELAJ daily move",
        article_description=state.message,
    )
    if not result or not result.get("ok"):
        raise RuntimeError(f"LinkedIn post failed: {json.dumps(result or {}, default=str)}")

    save_linkedin_post_state(
        {
            "local_date": local_date,
            "posted_at": datetime.now(UTC).isoformat(),
            "timezone": timezone_name,
            "dry_run": dry_run,
            "post_id": result.get("post_id", ""),
            "mode": state.mode,
            "label": state.label,
        }
    )
    print(
        json.dumps(
            {
                "posted": True,
                "local_date": local_date,
                "dry_run": dry_run,
                "post_id": result.get("post_id", ""),
                "label": state.label,
            }
        )
    )


if __name__ == "__main__":
    main()
