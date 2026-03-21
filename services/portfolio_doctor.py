from __future__ import annotations

import pandas as pd

from domain.portfolio import PortfolioChecklistItem, PortfolioDoctorResult


class PortfolioDoctorService:
    """Read-only portfolio interpretation for beginner-friendly diagnostics."""

    def diagnose(self, *, positions: list[dict[str, object]], equity: float, cash: float, board: pd.DataFrame) -> dict[str, object]:
        if not positions:
            cash_pct = 0.0 if equity <= 0 else (cash / max(equity, 1e-9)) * 100.0
            result = PortfolioDoctorResult(
                diagnosis="The account is mostly idle. That is acceptable if the board is defensive, but expensive if strong BUY scores are being ignored.",
                footer=f"Cash share: {cash_pct:.1f}% | Board top pick: {board.iloc[0]['ticker'] if not board.empty else 'n/a'}",
                cash_pct=cash_pct,
                concentration_pct=0.0,
                conflict_symbols=tuple(),
                checklist=self._build_checklist(cash_pct=cash_pct, concentration=0.0, conflict_symbols=[]),
            )
            return self._to_payload(result)

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
        cash_pct = 0.0 if equity <= 0 else (cash / max(equity, 1e-9)) * 100.0
        footer = f"Largest position share: {concentration:.1f}% | Cash: ${cash:,.2f}"
        if conflict_symbols:
            footer += " | Conflict: " + ", ".join(conflict_symbols[:3])

        result = PortfolioDoctorResult(
            diagnosis=diagnosis,
            footer=footer,
            cash_pct=cash_pct,
            concentration_pct=concentration,
            conflict_symbols=tuple(conflict_symbols),
            checklist=self._build_checklist(cash_pct=cash_pct, concentration=concentration, conflict_symbols=conflict_symbols),
        )
        return self._to_payload(result)

    def _build_checklist(self, *, cash_pct: float, concentration: float, conflict_symbols: list[str]) -> tuple[PortfolioChecklistItem, ...]:
        return (
            PortfolioChecklistItem(
                simple_check="Do I have too much in one thing?",
                answer="Yes" if concentration >= 60 else "No",
                meaning="One asset dominates the account." if concentration >= 60 else "Your money is not trapped in one bet.",
            ),
            PortfolioChecklistItem(
                simple_check="Am I mostly sitting in cash?",
                answer="Yes" if cash_pct >= 70 else "No",
                meaning="That is okay if the board is scared." if cash_pct >= 70 else "You already have some money at work.",
            ),
            PortfolioChecklistItem(
                simple_check="Do my holdings fight the model?",
                answer="Yes" if conflict_symbols else "No",
                meaning=f"Conflicts: {', '.join(conflict_symbols[:3])}" if conflict_symbols else "Your holdings broadly agree with the current board.",
            ),
        )

    @staticmethod
    def _to_payload(result: PortfolioDoctorResult) -> dict[str, object]:
        return {
            "diagnosis": result.diagnosis,
            "footer": result.footer,
            "cash_pct": result.cash_pct,
            "concentration_pct": result.concentration_pct,
            "conflict_symbols": list(result.conflict_symbols),
            "checklist": [
                {
                    "Simple check": item.simple_check,
                    "Answer": item.answer,
                    "What it means": item.meaning,
                }
                for item in result.checklist
            ],
        }
