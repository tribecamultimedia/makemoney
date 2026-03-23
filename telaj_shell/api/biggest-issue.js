const { getConfigError, getBearerToken, getSupabaseUser, getFinancialPositionRecord } = require("./_supabase");
const { buildBalanceSheet } = require("./services/balance_sheet_service");
const { buildLiquidityState } = require("./services/liquidity_service");
const { buildDecisionArtifacts } = require("./services/decision_engine");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const configError = getConfigError();
  if (configError) {
    res.status(500).json({ error: configError });
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

    res.status(200).json({
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
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Load failed" });
  }
};
