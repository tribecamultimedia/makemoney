require("../contracts");

function slugifyDecisionKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatUtcDecisionDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function buildDecisionKey(signalDecision, date = new Date()) {
  return `${formatUtcDecisionDate(date)}::${slugifyDecisionKey(signalDecision?.signal || signalDecision?.headline)}`;
}

function buildAcknowledgment(action) {
  if (action === "executed") {
    return "You followed through. TELAJ will treat this as committed.";
  }
  if (action === "simulated") {
    return "Simulation saved. TELAJ will treat this as a test path, not a committed move.";
  }
  return "Skipped for now. TELAJ is aware the risk is still present.";
}

function buildPriorBehaviorMessage(action) {
  if (action === "executed") {
    return "You followed through yesterday. Good move.";
  }
  if (action === "simulated") {
    return "You simulated this yesterday. TELAJ can compare it to the live path.";
  }
  if (action === "skipped") {
    return "You skipped this yesterday. The risk is still present.";
  }
  return "";
}

function allocatePercentages(rawSteps) {
  const total = rawSteps.reduce((sum, item) => sum + item.percent, 0);
  if (!total) {
    return rawSteps;
  }

  const normalized = rawSteps.map((item) => ({
    ...item,
    percent: Math.round((item.percent / total) * 100),
  }));

  const diff = 100 - normalized.reduce((sum, item) => sum + item.percent, 0);
  if (diff !== 0 && normalized.length) {
    normalized[0].percent += diff;
  }

  return normalized;
}

function buildDecisionArtifacts({ balanceSheet, liquidityState }) {
  const liquidCash = balanceSheet.liquidCash;
  const unsecuredDebt = balanceSheet.creditCardDebt + balanceSheet.loans;

  let headline;
  let summary;
  let primaryAction;
  let secondaryAction;
  let growthSleeve;
  let watchout;
  let why;
  let whatCouldGoWrong;
  let saferOption;
  let confidence;
  let timeHorizon;
  let reasons;
  let steps;
  let issue;
  let issueScore;
  let issueReasons;

  if (liquidCash <= 0 || liquidityState.monthlyNeed <= 0) {
    headline = "Map your liquid position before TELAJ commits you to an investment move";
    summary = "Without clear liquid cash and monthly need, TELAJ should default to caution and finish the financial map first.";
    primaryAction = "Confirm liquid cash and monthly financial need";
    secondaryAction = "Only invest after the reserve picture is visible";
    growthSleeve = "No growth sleeve yet";
    watchout = "Acting on an incomplete balance sheet";
    why = "The best next move is to finish the financial map, because every later decision depends on the reserve picture.";
    whatCouldGoWrong = "If you invest before mapping liquidity, you can confuse spare cash with emergency capital.";
    saferOption = "Pause and complete the liquid cash and monthly-need inputs first.";
    confidence = 94;
    timeHorizon = "Today";
    reasons = [
      "The balance sheet is still incomplete.",
      "Reserve math is impossible without liquid cash and monthly need.",
      "TELAJ should not manufacture certainty from missing data.",
    ];
    steps = allocatePercentages([{ label: "Cash mapping", percent: 100, note: "Finish the core financial map first." }]);
    issue = "Your financial position is not mapped clearly enough yet.";
    issueScore = 95;
    issueReasons = reasons;
  } else if (balanceSheet.creditCardDebt > 0) {
    headline = "Use liquid capital to repair the balance sheet before investing aggressively";
    summary = "TELAJ sees expensive consumer debt on the balance sheet, so the first move is repair, not chasing returns.";
    primaryAction = "Pay down credit card debt first";
    secondaryAction = "Keep the defensive sleeve liquid and stable";
    growthSleeve = "Delay aggressive ETF adds until expensive debt is cleared";
    watchout = "Stretching into risk while revolving debt is still active";
    why = "Paying down expensive consumer debt is a cleaner return than adding optional market risk while interest compounds against you.";
    whatCouldGoWrong = "You can feel invested but still lose ground if high-cost debt keeps working against every other decision.";
    saferOption = "Keep a minimal reserve, then attack the most expensive debt first.";
    confidence = 90;
    timeHorizon = "0-3 months";
    reasons = [
      "Revolving debt weakens every future allocation decision.",
      "A reserve buffer prevents falling back into the debt loop.",
      "New risk should wait until the expensive drag is reduced.",
    ];
    steps = allocatePercentages([
      { label: "Debt payoff", percent: 45, note: "Expensive revolving debt deserves first claim on liquid capital." },
      { label: "Emergency reserve", percent: 35, note: "Keep the finances from falling back into the debt loop." },
      { label: "Treasury reserve", percent: 20, note: "Hold the defensive sleeve somewhere stable and liquid." },
    ]).map((item) => ({ ...item, amount: liquidCash * (item.percent / 100) }));
    issue = "Expensive consumer debt is still the biggest drag on the system.";
    issueScore = 92;
    issueReasons = reasons;
  } else if (liquidityState.liquidityPosture !== "stable") {
    headline = "Strengthen the reserve base before taking a bigger risk move";
    summary = `TELAJ sees about ${liquidityState.reserveMonths.toFixed(1)} months of runway, so resilience still matters more than going fully invested.`;
    primaryAction = "Close the reserve gap first";
    secondaryAction = "Keep the defensive sleeve in short Treasuries or cash equivalents";
    growthSleeve = "Only a measured ETF sleeve until the reserve target is funded";
    watchout = "Acting fully invested while the reserve target is still short";
    why = "Your finances still need more runway before TELAJ leans harder into optional risk.";
    whatCouldGoWrong = "A thinner reserve can turn normal volatility or life events into forced selling.";
    saferOption = "Build the reserve target first, then let a smaller growth sleeve work in parallel.";
    confidence = 82;
    timeHorizon = "1-6 months";
    reasons = [
      `Reserve target is about ${Math.round(liquidityState.reserveTargetAmount)} and the gap is still ${Math.round(liquidityState.reserveGap)}.`,
      "Resilience reduces the chance of forced decisions.",
      "Measured growth is fine, but only after the reserve gap is being closed.",
    ];
    steps = allocatePercentages([
      { label: "Emergency reserve", percent: 45, note: "Bring the reserve base up to target." },
      { label: "Treasury reserve", percent: 30, note: "Keep defensive capital productive and liquid." },
      { label: "Broad ETFs", percent: 15, note: "Allow some growth without compromising resilience." },
      { label: "Gold", percent: 10, note: "Add ballast instead of extra fragility." },
    ]).map((item) => ({ ...item, amount: liquidCash * (item.percent / 100) }));
    issue = "Liquidity is still below the level TELAJ wants before taking more risk.";
    issueScore = 84;
    issueReasons = reasons;
  } else {
    headline = "Use the liquid balance deliberately instead of letting it sit idle";
    summary = "Reserve coverage looks healthier and expensive debt is not the main issue, so TELAJ can let the next dollar work in planned sleeves.";
    primaryAction = "Allocate the liquid balance in planned sleeves";
    secondaryAction = "Keep a real reserve intact instead of going all-in";
    growthSleeve = "Broad ETFs as the core growth engine";
    watchout = "Going all-in because the cash balance feels too large";
    why = "TELAJ sees enough reserve strength to let part of the capital compound, while still keeping defense and optionality in place.";
    whatCouldGoWrong = "If you confuse available cash with excess cash, you can end up weakening the reserve without realizing it.";
    saferOption = "Build in tranches and keep a visible reserve target in place.";
    confidence = 76;
    timeHorizon = "3-12 months";
    reasons = [
      "A diversified ETF sleeve is the cleanest growth engine for long-term capital.",
      "Gold and Treasuries reduce the risk of regretting the move under stress.",
      "Keeping a dedicated reserve prevents the portfolio from becoming the emergency fund.",
    ];
    steps = allocatePercentages([
      { label: "Emergency reserve", percent: 30, note: "Keep a real shock absorber in place." },
      { label: "Treasury reserve", percent: 25, note: "Fund defense and optionality with short-duration quality." },
      { label: "Broad ETFs", percent: 30, note: "Compounding should happen through a diversified core." },
      { label: "Gold", percent: 15, note: "Gold stays as a defensive hedge, not the entire plan." },
    ]).map((item) => ({ ...item, amount: liquidCash * (item.percent / 100) }));
    issue = "The main job is disciplined deployment, not emergency repair.";
    issueScore = 54;
    issueReasons = reasons;
  }

  return {
    biggestIssue: {
      headline: issue,
      score: issueScore,
      reasons: issueReasons,
    },
    signalDecision: {
      decisionKey: buildDecisionKey({ signal: primaryAction, headline }),
      headline,
      signal: primaryAction,
      primaryAction,
      why,
      whatCouldGoWrong,
      saferOption,
      confidence,
      timeHorizon,
      reasons,
    },
    actionPlan: {
      headline,
      summary,
      primaryAction,
      secondaryAction,
      growthSleeve,
      watchout,
      plainEnglish: liquidCash
        ? `If ${Math.round(liquidCash)} is the liquid cash available today, TELAJ would split it as ${steps
            .map((item) => `${item.percent}% to ${item.label.toLowerCase()}`)
            .join(", ")}.`
        : "TELAJ needs the liquid position mapped before it can produce a real allocation call.",
      reasons,
      steps,
    },
  };
}

module.exports = {
  buildAcknowledgment,
  buildDecisionKey,
  buildPriorBehaviorMessage,
  buildDecisionArtifacts,
};
