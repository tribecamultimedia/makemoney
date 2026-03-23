const { getConfigError, getBearerToken, getSupabaseUser, getFinancialPositionRecord } = require("./_supabase");
const { buildBalanceSheet } = require("./services/balance_sheet_service");
const { buildLiquidityState } = require("./services/liquidity_service");

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

    res.status(200).json({
      userState: {
        userId: user.id,
        authenticated: true,
        email: user.email || "",
        marketRegion: "US",
        source: record ? "financial_positions" : "empty_financial_positions",
      },
      balanceSheet,
      liquidityState,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Load failed" });
  }
};
