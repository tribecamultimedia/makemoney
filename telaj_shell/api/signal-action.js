const {
  getConfigError,
  getBearerToken,
  getSupabaseUser,
  getFinancialPositionRecord,
  insertRecommendationHistory,
  insertSignalAction,
} = require("./_supabase");
const { buildBalanceSheet } = require("./services/balance_sheet_service");
const { buildLiquidityState } = require("./services/liquidity_service");
const { buildAcknowledgment, buildDecisionArtifacts } = require("./services/decision_engine");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
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

  const rawAction = String(req.body?.action || "").trim().toLowerCase();
  const actionType = rawAction === "execute" ? "executed" : rawAction === "simulate" ? "simulated" : rawAction === "skip" ? "skipped" : "";
  if (!actionType) {
    res.status(400).json({ error: "Action must be execute, simulate, or skip." });
    return;
  }

  try {
    const user = await getSupabaseUser(accessToken);
    const record = await getFinancialPositionRecord(accessToken, user.id);
    const balanceSheet = buildBalanceSheet(record);
    const liquidityState = buildLiquidityState(record);
    const artifacts = buildDecisionArtifacts({ balanceSheet, liquidityState });
    const timestamp = new Date().toISOString();

    await insertRecommendationHistory(accessToken, {
      user_id: user.id,
      decision_key: artifacts.signalDecision.decisionKey,
      headline: artifacts.signalDecision.headline,
      signal: artifacts.signalDecision.signal,
      why: artifacts.signalDecision.why,
      what_could_go_wrong: artifacts.signalDecision.whatCouldGoWrong,
      safer_option: artifacts.signalDecision.saferOption,
      confidence: artifacts.signalDecision.confidence,
      time_horizon: artifacts.signalDecision.timeHorizon,
      biggest_issue: artifacts.biggestIssue.headline,
      issue_score: artifacts.biggestIssue.score,
      action_status: actionType,
      recorded_at: timestamp,
    });

    const signalAction = await insertSignalAction(accessToken, {
      user_id: user.id,
      decision_key: artifacts.signalDecision.decisionKey,
      action_type: actionType,
      signal: artifacts.signalDecision.signal,
      headline: artifacts.signalDecision.headline,
      created_at: timestamp,
    });

    res.status(200).json({
      actionState: {
        status: actionType,
        acknowledgedAt: signalAction?.created_at || timestamp,
        message: buildAcknowledgment(actionType),
      },
      todayMove: {
        ...artifacts.signalDecision,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Action tracking failed" });
  }
};
