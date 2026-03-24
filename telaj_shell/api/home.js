const {
  getConfigError,
  getServiceRoleConfigError,
  getBearerToken,
  getSupabaseUser,
  getFinancialPositionRecord,
  getLatestSignalAction,
  getSignalActionForDecision,
  requestSupabaseAdmin,
} = require("./_supabase");
const { buildBalanceSheet } = require("./services/balance_sheet_service");
const { buildLiquidityState } = require("./services/liquidity_service");
const { buildAcknowledgment, buildDecisionArtifacts, buildPriorBehaviorMessage } = require("./services/decision_engine");

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildPerformanceSummary({ ledgerRows, equityRows }) {
  if (!Array.isArray(equityRows) || equityRows.length === 0) {
    return {
      hasLiveData: false,
      summary: "TELAJ does not have enough live performance history yet.",
      metrics: [],
    };
  }

  const sortedEquity = [...equityRows].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const sortedLedger = Array.isArray(ledgerRows)
    ? [...ledgerRows].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];

  const startOfYear = new Date();
  startOfYear.setUTCMonth(0, 1);
  startOfYear.setUTCHours(0, 0, 0, 0);

  const ytdStartPoint = sortedEquity.find((row) => new Date(row.timestamp) >= startOfYear) || sortedEquity[0];
  const latestPoint = sortedEquity[sortedEquity.length - 1];
  const startEquity = toNumber(ytdStartPoint?.equity);
  const latestEquity = toNumber(latestPoint?.equity);
  const returnPct = startEquity > 0 ? ((latestEquity / startEquity) - 1) * 100 : 0;

  let runningPeak = 0;
  let maxDrawdownPct = 0;
  for (const row of sortedEquity) {
    const equity = toNumber(row.equity);
    runningPeak = Math.max(runningPeak, equity);
    if (runningPeak > 0) {
      const drawdownPct = Math.abs(((equity / runningPeak) - 1) * 100);
      maxDrawdownPct = Math.max(maxDrawdownPct, drawdownPct);
    }
  }

  const submittedSignals = sortedLedger.filter((row) => row.status === "submitted");
  let wins = 0;
  let evaluated = 0;
  for (const row of submittedSignals) {
    const before = sortedEquity.filter((point) => new Date(point.timestamp) <= new Date(row.timestamp));
    const after = sortedEquity.filter((point) => new Date(point.timestamp) > new Date(row.timestamp));
    if (!before.length || !after.length) {
      continue;
    }
    const beforeEquity = toNumber(before[before.length - 1].equity);
    const afterEquity = toNumber(after[0].equity);
    evaluated += 1;
    if (row.action === "BUY" && afterEquity >= beforeEquity) {
      wins += 1;
    } else if (row.action === "PROTECT" && afterEquity <= beforeEquity) {
      wins += 1;
    }
  }

  const winRatePct = evaluated > 0 ? (wins / evaluated) * 100 : 0;

  return {
    hasLiveData: true,
    updatedAt: latestPoint?.timestamp || null,
    summary: "These numbers come from TELAJ's live execution ledger and equity curve, not shell placeholders.",
    metrics: [
      {
        key: "engine_return",
        label: "Engine return",
        value: `${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(1)}%`,
        note: "Live from the equity curve since the start of the current year or first available point.",
      },
      {
        key: "signals_taken",
        label: "Signals taken",
        value: String(submittedSignals.length),
        note: "Submitted actions from the live trade ledger.",
      },
      {
        key: "win_rate",
        label: "Win rate",
        value: `${winRatePct.toFixed(1)}%`,
        note: "Evaluated from the next equity snapshot after each submitted action.",
      },
      {
        key: "max_drawdown",
        label: "Max drawdown",
        value: `${maxDrawdownPct.toFixed(1)}%`,
        note: "Worst peak-to-trough decline in the recorded equity curve.",
      },
    ],
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authConfigError = getConfigError();
  if (authConfigError) {
    res.status(500).json({ error: authConfigError });
    return;
  }

  const serviceRoleConfigError = getServiceRoleConfigError();
  if (serviceRoleConfigError) {
    res.status(500).json({ error: serviceRoleConfigError });
    return;
  }

  const accessToken = getBearerToken(req);
  if (!accessToken) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const user = await getSupabaseUser(accessToken);
    const record = await getFinancialPositionRecord(accessToken, user.id);
    const balanceSheet = buildBalanceSheet(record);
    const liquidityState = buildLiquidityState(record);
    const artifacts = buildDecisionArtifacts({ balanceSheet, liquidityState });

    let currentAction = null;
    let priorAction = null;
    try {
      currentAction = await getSignalActionForDecision(accessToken, user.id, artifacts.signalDecision.decisionKey);
      const latestAction = await getLatestSignalAction(accessToken, user.id);
      priorAction = latestAction && latestAction.decision_key !== artifacts.signalDecision.decisionKey ? latestAction : null;
    } catch (trackingError) {
      console.warn("TELAJ action tracking lookup failed.", trackingError);
    }

    const [ledgerRows, equityRows] = await Promise.all([
      requestSupabaseAdmin("trade_ledger?select=timestamp,action,status&order=timestamp.asc"),
      requestSupabaseAdmin("equity_curve?select=timestamp,equity&order=timestamp.asc"),
    ]);

    res.status(200).json({
      whereIStand: {
        userState: {
          userId: user.id,
          authenticated: true,
          email: user.email || "",
          marketRegion: "US",
          source: record ? "financial_positions" : "empty_financial_positions",
        },
        balanceSheet,
        liquidityState,
      },
      biggestIssue: {
        biggestIssue: artifacts.biggestIssue,
        balanceSheetSummary: {
          totalAssets: balanceSheet.totalAssets,
          totalDebt: balanceSheet.totalDebt,
          netWorth: balanceSheet.netWorth,
          debtRatio: balanceSheet.debtRatio,
        },
        liquiditySummary: {
          reserveMonths: liquidityState.reserveMonths,
          reserveTargetMonths: liquidityState.reserveTargetMonths,
          reserveGap: liquidityState.reserveGap,
        },
      },
      todayMove: {
        todayMove: {
          ...artifacts.signalDecision,
          actionState: currentAction
            ? {
                status: currentAction.action_type,
                acknowledgedAt: currentAction.created_at,
                message: buildAcknowledgment(currentAction.action_type),
              }
            : null,
          priorBehavior: priorAction
            ? {
                action: priorAction.action_type,
                decisionKey: priorAction.decision_key,
                message: buildPriorBehaviorMessage(priorAction.action_type),
                at: priorAction.created_at,
              }
            : null,
        },
      },
      actionPlan: {
        actionPlan: artifacts.actionPlan,
      },
      performanceSummary: {
        performanceSummary: buildPerformanceSummary({
          ledgerRows,
          equityRows,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Load failed" });
  }
};
