const {
  getConfigError,
  getBearerToken,
  getSupabaseUser,
  getFinancialPositionRecord,
  getLatestSignalAction,
  getSignalActionForDecision,
} = require("./_supabase");
const { buildBalanceSheet } = require("./services/balance_sheet_service");
const { buildLiquidityState } = require("./services/liquidity_service");
const { buildAcknowledgment, buildDecisionArtifacts, buildPriorBehaviorMessage } = require("./services/decision_engine");

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
    let currentAction = null;
    let priorAction = null;
    try {
      currentAction = await getSignalActionForDecision(accessToken, user.id, artifacts.signalDecision.decisionKey);
      const latestAction = await getLatestSignalAction(accessToken, user.id);
      priorAction = latestAction && latestAction.decision_key !== artifacts.signalDecision.decisionKey ? latestAction : null;
    } catch (trackingError) {
      console.warn("TELAJ action tracking lookup failed.", trackingError);
    }

    res.status(200).json({
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
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Load failed" });
  }
};
