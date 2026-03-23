require("../contracts");

function toNumber(value) {
  return Number(value || 0);
}

function buildLiquidityState(record, { wealthFor = "me", propertyExposure = false } = {}) {
  const liquidCash = toNumber(record?.liquid_cash);
  const monthlyNeed = toNumber(record?.monthly_need);
  const reserveMonths = monthlyNeed > 0 ? liquidCash / monthlyNeed : 0;

  let reserveTargetMonths = 6;
  if (wealthFor === "children" || wealthFor === "multi-generational") {
    reserveTargetMonths = 9;
  } else if (propertyExposure || toNumber(record?.mortgage_debt) > 0) {
    reserveTargetMonths = 8;
  }

  const reserveTargetAmount = monthlyNeed > 0 ? reserveTargetMonths * monthlyNeed : 0;
  const reserveGap = Math.max(reserveTargetAmount - liquidCash, 0);

  let liquidityPosture = "unmapped";
  let summary = "TELAJ needs your liquid cash and monthly need to produce a real reserve view.";

  if (liquidCash <= 0 || monthlyNeed <= 0) {
    liquidityPosture = "unmapped";
  } else if (reserveMonths < 3) {
    liquidityPosture = "fragile";
    summary = "Your reserve runway is still fragile. TELAJ would build liquidity before taking more optional risk.";
  } else if (reserveMonths < reserveTargetMonths) {
    liquidityPosture = "building";
    summary = "Your reserve base is improving, but it is still short of target. TELAJ would keep strengthening resilience.";
  } else {
    liquidityPosture = "stable";
    summary = "Your reserve coverage is in a healthier range. TELAJ can let more of the next dollar work.";
  }

  return {
    liquidCash,
    monthlyNeed,
    reserveMonths,
    reserveTargetMonths,
    reserveTargetAmount,
    reserveGap,
    liquidityPosture,
    summary,
  };
}

module.exports = {
  buildLiquidityState,
};
