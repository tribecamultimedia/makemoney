/**
 * @typedef {Object} MarketRadarItem
 * @property {string} market
 * @property {number} jobMomentum
 * @property {number} infrastructureMomentum
 * @property {number} supplyPressure
 * @property {number} affordability
 * @property {number} rentStrength
 * @property {number} liquidity
 * @property {number} hazardDrag
 * @property {number} taxFriendliness
 * @property {string} summary
 * @property {string} strategyFit
 * @property {string[]} catalysts
 * @property {string[]} risks
 *
 * @typedef {Object} NewsSignalItem
 * @property {string} market
 * @property {string} headline
 * @property {string} category
 * @property {string} implication
 * @property {string} stance
 * @property {string} confidence
 *
 * @typedef {Object} DealCandidate
 * @property {string} id
 * @property {string} address
 * @property {string} market
 * @property {string} propertyType
 * @property {string} strategy
 * @property {number} price
 * @property {number} expectedRent
 * @property {number} capRate
 * @property {number} monthlyCashFlow
 * @property {number} score
 * @property {string[]} positives
 * @property {string[]} risks
 *
 * @typedef {Object} AddressAnalysisInput
 * @property {string} address
 * @property {number} purchasePrice
 * @property {number} expectedRent
 * @property {number} downPaymentPct
 * @property {number} interestRatePct
 * @property {number} taxesMonthly
 * @property {number} insuranceMonthly
 * @property {number} repairsMonthly
 * @property {number} vacancyPct
 * @property {number} managementPct
 * @property {number} closingCosts
 * @property {number} renovationBudget
 *
 * @typedef {Object} HoldDecisionInput
 * @property {string} address
 * @property {number} currentValue
 * @property {number} mortgageBalance
 * @property {number} currentRent
 * @property {number} monthlyExpenses
 * @property {number} estimatedRepairs
 * @property {number} currentRatePct
 * @property {number} expectedSalePrice
 * @property {number} exitCostsPct
 */

(function attachRealEstateEngine(global) {
  const cityPricingRules = [
    { match: ["columbus", "ohio"], pricePerSqm: 2600, rentPerSqm: 19 },
    { match: ["cincinnati"], pricePerSqm: 2450, rentPerSqm: 17 },
    { match: ["cleveland"], pricePerSqm: 2100, rentPerSqm: 15 },
    { match: ["austin"], pricePerSqm: 4200, rentPerSqm: 24 },
    { match: ["nashville"], pricePerSqm: 3600, rentPerSqm: 22 },
    { match: ["raleigh"], pricePerSqm: 3400, rentPerSqm: 21 },
    { match: ["milan", "milano"], pricePerSqm: 6200, rentPerSqm: 28 },
    { match: ["rome", "roma"], pricePerSqm: 5400, rentPerSqm: 24 },
    { match: ["london"], pricePerSqm: 11000, rentPerSqm: 42 },
  ];

  function average(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function scoreMarket(item) {
    const opportunity =
      item.jobMomentum * 0.2 +
      item.infrastructureMomentum * 0.16 +
      item.affordability * 0.12 +
      item.rentStrength * 0.18 +
      item.liquidity * 0.12 +
      item.taxFriendliness * 0.1 +
      (100 - item.supplyPressure) * 0.07 +
      (100 - item.hazardDrag) * 0.05;

    const risk =
      item.supplyPressure * 0.28 +
      item.hazardDrag * 0.18 +
      (100 - item.affordability) * 0.16 +
      (100 - item.liquidity) * 0.14 +
      (100 - item.taxFriendliness) * 0.08 +
      (100 - item.rentStrength) * 0.16;

    return {
      ...item,
      opportunityScore: Math.round(opportunity),
      riskScore: Math.round(risk),
      demandMomentum: Math.round(average([item.jobMomentum, item.infrastructureMomentum, item.rentStrength])),
      exitability: item.liquidity,
    };
  }

  function rankMarkets(markets) {
    return markets.map(scoreMarket).sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  function summarizeNews(newsItems) {
    return newsItems.map((item) => ({
      ...item,
      plainEnglish: `${item.headline}. TELAJ reads this as ${item.implication.toLowerCase()}.`,
      caution:
        item.stance === "caution"
          ? "This is a risk signal, not a green light."
          : "This is a signal, not certainty.",
    }));
  }

  function mortgagePayment(principal, annualRatePct, years = 30) {
    const monthlyRate = annualRatePct / 100 / 12;
    const periods = years * 12;
    if (principal <= 0) return 0;
    if (monthlyRate <= 0) return principal / periods;
    return principal * (monthlyRate * (1 + monthlyRate) ** periods) / (((1 + monthlyRate) ** periods) - 1);
  }

  function marketFromString(value) {
    const text = String(value || "").toLowerCase();
    return cityPricingRules.find((rule) => rule.match.some((token) => text.includes(token))) || { pricePerSqm: 2800, rentPerSqm: 16 };
  }

  function estimateAddressValue(address, purchasePrice) {
    const market = marketFromString(address);
    const basis = purchasePrice > 0 ? purchasePrice : market.pricePerSqm * 90;
    return {
      low: Math.round(basis * 0.92),
      mid: Math.round(basis),
      high: Math.round(basis * 1.08),
      rentLow: Math.round(market.rentPerSqm * 80),
      rentHigh: Math.round(market.rentPerSqm * 110),
    };
  }

  function analyzeAddress(input) {
    const purchasePrice = Number(input.purchasePrice || 0);
    const expectedRent = Number(input.expectedRent || 0);
    const downPaymentPct = Number(input.downPaymentPct || 0);
    const interestRatePct = Number(input.interestRatePct || 0);
    const taxesMonthly = Number(input.taxesMonthly || 0);
    const insuranceMonthly = Number(input.insuranceMonthly || 0);
    const repairsMonthly = Number(input.repairsMonthly || 0);
    const vacancyPct = Number(input.vacancyPct || 0);
    const managementPct = Number(input.managementPct || 0);
    const closingCosts = Number(input.closingCosts || 0);
    const renovationBudget = Number(input.renovationBudget || 0);

    const downPayment = purchasePrice * (downPaymentPct / 100);
    const loanAmount = Math.max(purchasePrice - downPayment, 0);
    const monthlyDebtService = mortgagePayment(loanAmount, interestRatePct);
    const vacancyDrag = expectedRent * (vacancyPct / 100);
    const managementDrag = expectedRent * (managementPct / 100);
    const noiMonthly = expectedRent - taxesMonthly - insuranceMonthly - repairsMonthly - vacancyDrag - managementDrag;
    const annualNoi = noiMonthly * 12;
    const capRate = purchasePrice > 0 ? (annualNoi / purchasePrice) * 100 : 0;
    const monthlyCashFlow = noiMonthly - monthlyDebtService;
    const cashIn = downPayment + closingCosts + renovationBudget;
    const cashOnCash = cashIn > 0 ? ((monthlyCashFlow * 12) / cashIn) * 100 : 0;
    const dscr = monthlyDebtService > 0 ? noiMonthly / monthlyDebtService : 0;
    const stressRent = expectedRent * 0.9;
    const stressNoi = stressRent - taxesMonthly - insuranceMonthly - repairsMonthly * 1.15 - stressRent * ((vacancyPct + 5) / 100) - stressRent * (managementPct / 100);
    const stressCashFlow = stressNoi - monthlyDebtService;
    const valuation = estimateAddressValue(input.address, purchasePrice);

    let verdict = "review carefully";
    if (monthlyCashFlow > 250 && capRate >= 6 && dscr >= 1.25 && stressCashFlow >= 0) {
      verdict = "strong candidate";
    } else if (monthlyCashFlow > 0 && dscr >= 1.1) {
      verdict = "decent but thin";
    } else if (monthlyCashFlow < 0 || dscr < 1) {
      verdict = "pass";
    }

    const strengths = [];
    const risks = [];
    if (capRate >= 6) strengths.push("Cap rate is workable for the asking basis.");
    if (monthlyCashFlow > 0) strengths.push("The property throws off positive monthly cash flow in the base case.");
    if (dscr >= 1.25) strengths.push("Debt coverage is resilient enough to survive moderate stress.");
    if (stressCashFlow < 0) risks.push("Stress case turns the property negative.");
    if (capRate < 5) risks.push("Cap rate is thin for the risk taken.");
    if (cashOnCash < 5) risks.push("Cash-on-cash return is weak relative to the effort and illiquidity.");

    return {
      valuationRange: valuation,
      rentRange: { low: valuation.rentLow, high: valuation.rentHigh },
      capRate: Number(capRate.toFixed(2)),
      monthlyCashFlow: Number(monthlyCashFlow.toFixed(2)),
      cashOnCash: Number(cashOnCash.toFixed(2)),
      dscr: Number(dscr.toFixed(2)),
      stressCashFlow: Number(stressCashFlow.toFixed(2)),
      verdict,
      strengths,
      risks,
      explanation: `TELAJ sees ${verdict} because the base-case cash flow is ${monthlyCashFlow >= 0 ? "positive" : "negative"}, the cap rate is ${capRate.toFixed(1)}%, and DSCR is ${dscr.toFixed(2)}.`,
    };
  }

  function scoreDeal(candidate) {
    return Math.round(
      candidate.capRate * 8 +
        Math.max(candidate.monthlyCashFlow, 0) / 20 +
        (candidate.strategy === "small multifamily" ? 6 : 0) +
        (candidate.strategy === "buy and hold" ? 4 : 0)
    );
  }

  function findDeals(candidates, filters) {
    return candidates
      .filter((item) => !filters.market || item.market === filters.market)
      .filter((item) => !filters.strategy || item.strategy === filters.strategy)
      .filter((item) => !filters.propertyType || item.propertyType === filters.propertyType)
      .filter((item) => !filters.budget || item.price <= filters.budget)
      .filter((item) => !filters.minimumCapRate || item.capRate >= filters.minimumCapRate)
      .filter((item) => !filters.minimumCashFlow || item.monthlyCashFlow >= filters.minimumCashFlow)
      .map((item) => ({ ...item, score: scoreDeal(item) }))
      .sort((a, b) => b.score - a.score);
  }

  function adviseOwnedProperty(input) {
    const currentValue = Number(input.currentValue || 0);
    const mortgageBalance = Number(input.mortgageBalance || 0);
    const currentRent = Number(input.currentRent || 0);
    const monthlyExpenses = Number(input.monthlyExpenses || 0);
    const estimatedRepairs = Number(input.estimatedRepairs || 0);
    const currentRatePct = Number(input.currentRatePct || 0);
    const expectedSalePrice = Number(input.expectedSalePrice || currentValue || 0);
    const exitCostsPct = Number(input.exitCostsPct || 0);
    const equity = Math.max(currentValue - mortgageBalance, 0);
    const keepCashFlow = currentRent - monthlyExpenses - estimatedRepairs / 12;
    const refinanceBenefit = currentRatePct >= 6.5 ? equity * 0.08 : 0;
    const saleProceeds = expectedSalePrice * (1 - exitCostsPct / 100) - mortgageBalance;
    const score =
      (keepCashFlow > 250 ? 20 : 0) +
      (equity > currentValue * 0.35 ? 18 : 6) +
      (refinanceBenefit > 0 ? 12 : 0) +
      (saleProceeds > equity * 0.9 ? 10 : 0) -
      (estimatedRepairs > 15000 ? 12 : 0);

    let recommendation = "review";
    if (keepCashFlow > 300 && estimatedRepairs < 10000) recommendation = "keep";
    else if (refinanceBenefit > 15000 && keepCashFlow >= 0) recommendation = "refinance";
    else if (keepCashFlow < 0 && saleProceeds > 0) recommendation = "sell";
    else if (keepCashFlow >= 0 && estimatedRepairs >= 10000) recommendation = "optimize";

    return {
      score,
      equity: Math.round(equity),
      keepScenario: keepCashFlow,
      rentScenario: keepCashFlow,
      refinanceScenario: refinanceBenefit,
      sellScenario: Math.round(saleProceeds),
      recommendation,
      explanation:
        recommendation === "sell"
          ? "TELAJ sees trapped equity and weak operating economics, so redeployment may be stronger than continuing to carry the property."
          : recommendation === "refinance"
            ? "TELAJ sees an asset that can work better with improved debt structure."
            : recommendation === "optimize"
              ? "TELAJ sees a property worth keeping only if you improve the drag factors first."
              : "TELAJ sees the property as serviceable enough to keep, with regular review.",
    };
  }

  global.TelajRealEstateEngine = {
    rankMarkets,
    summarizeNews,
    findDeals,
    analyzeAddress,
    adviseOwnedProperty,
    scoreMarket,
  };
})(window);
