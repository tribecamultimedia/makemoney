const defaultState = {
  activeView: "home",
  dataSource: "Embedded fallback",
  auth: {
    authenticated: false,
    mode: "gate",
    guest: false,
    email: "",
    legalAccepted: false,
    betaUnlocked: false,
    betaCode: "",
    error: "",
    info: "",
  },
  subscription: {
    plan: "Beta",
    status: "Invite only",
    seat: "Founding tester",
    renewal: "Billing not live yet",
  },
  syncStatus: {
    financialPosition: "Local browser only",
    financialPositionDetail: "Sign in and connect the backend route to sync this panel.",
  },
  marketRegion: "US",
  subscriberPreferences: {
    contactEmail: "",
    signalEmailOptIn: false,
    weeklyDigestOptIn: false,
    marketingOptIn: false,
    discordOptIn: false,
    discordHandle: "",
    deliveryStatus: "Preferences only",
  },
  onboarding: {
    completed: false,
    currentStep: 0,
    stage: "questions",
    answers: {},
    profiles: {
      householdProfile: null,
      behaviorProfile: null,
      goalProfile: null,
    },
    intent: {
      notes: "",
      analysis: null,
      confirmed: false,
    },
  },
  morningSignal: {
    live: true,
    confidence: 78,
    move: "Increase liquidity buffer before adding more risk",
    rationale:
      "Volatility is elevated, your cash reserve is still below target, and the model would rather strengthen your financial base than stretch into another position too early.",
    risk: "medium",
    whoFor: "Financial stability",
    confidenceLabel: "AI confidence",
    rationaleShort: "Protect the system first, invest second.",
  },
  systemHealth: {
    discipline: 82,
    liquidity: 61,
    allocation: 74,
    resilience: 68,
  },
  profile: {
    level: "Allocator",
    xp: 2480,
    nextLevelXp: 3000,
    streak: 18,
    rank: "Builder -> Strategist",
  },
  stats: {
    ytd: "+8.4%",
    benchmark: "+6.9%",
    cashReserve: "4.3 months",
    signalsTaken: 19,
    winRate: "68%",
  },
  allocation: [
    { label: "ETFs", weight: 42, note: "Core wealth engine" },
    { label: "Cash", weight: 18, note: "Shock absorber" },
    { label: "Gold", weight: 10, note: "Defensive ballast" },
    { label: "Real Estate", weight: 20, note: "Long-duration asset" },
    { label: "Equities", weight: 10, note: "Higher-beta sleeve" },
  ],
  watchlist: [
    { ticker: "SPY", move: "+0.8%", signal: "Watch", trend: "up" },
    { ticker: "GLD", move: "+1.3%", signal: "Add slowly", trend: "up" },
    { ticker: "VNQ", move: "-0.4%", signal: "Prepare", trend: "down" },
    { ticker: "SGOV", move: "+0.1%", signal: "Hold reserve", trend: "up" },
  ],
  marketTape: [
    { ticker: "NVDA", price: 132.48, changePct: 2.4, trend: "up" },
    { ticker: "TSLA", price: 211.34, changePct: -1.1, trend: "down" },
    { ticker: "MU", price: 118.22, changePct: 1.8, trend: "up" },
    { ticker: "VRT", price: 96.73, changePct: 3.2, trend: "up" },
    { ticker: "SMCI", price: 58.11, changePct: -2.6, trend: "down" },
    { ticker: "INTC", price: 34.62, changePct: 0.7, trend: "up" },
  ],
  investmentIntel: {
    marketState: {
      regime: "defensive accumulation",
      distanceFromMonthLowPct: 2.1,
      distanceFromMonthHighPct: 8.7,
      breadth: "improving",
      volatility: "elevated",
      rates: "stable-to-softening",
      riskLevel: "medium",
      summary: "The market is off recent highs and still close enough to recent lows that TELAJ prefers selective buying over aggressive chasing.",
    },
    newsDrivers: [
      "Rate pressure has stopped getting worse, which helps broad ETF accumulation.",
      "Macro stress is still present, so defense should stay in the mix.",
      "Gold remains useful while real yields and policy uncertainty are not fully settled."
    ],
    assetSignals: [
      {
        ticker: "SPY",
        label: "Broad ETF core",
        signal: "add slowly",
        confidence: 74,
        why: "The market is still below recent highs and close enough to recent lows that broad exposure is more attractive than waiting for a perfect entry.",
        risk: "If breadth weakens again, a better entry may appear later.",
        safer: "Buy in tranches instead of all at once.",
        horizon: "6-18 months"
      },
      {
        ticker: "GLD",
        label: "Gold defense",
        signal: "buy",
        confidence: 71,
        why: "Volatility and macro uncertainty still justify a defensive hedge.",
        risk: "Gold can lag badly if risk appetite broadens and real yields rise.",
        safer: "Add a smaller hedge rather than oversizing it.",
        horizon: "3-12 months"
      },
      {
        ticker: "SGOV",
        label: "Treasury reserve sleeve",
        signal: "hold",
        confidence: 79,
        why: "Short-duration Treasuries still work well for reserve capital while the market remains uneven.",
        risk: "This protects capital more than it compounds aggressively.",
        safer: "Keep it as the reserve sleeve, not the whole portfolio.",
        horizon: "0-12 months"
      },
      {
        ticker: "QQQ",
        label: "High-beta growth",
        signal: "avoid",
        confidence: 67,
        why: "This part of the market is more vulnerable if momentum rolls over again.",
        risk: "You can miss upside if the rally broadens quickly.",
        safer: "Use broad ETFs instead of concentrated beta.",
        horizon: "1-6 months"
      }
    ],
    portfolioAction: {
      title: "Buy ETF core and gold, keep Treasuries as ballast",
      summary: "TELAJ would add to broad ETFs in small tranches, keep a live gold hedge, and leave reserve capital in short Treasuries instead of chasing higher-beta names.",
      primary: "Buy broad ETF in tranches",
      secondary: "Add a measured gold hedge",
      avoid: "Selling safety to chase fast momentum"
    }
  },
  highlightedSignals: [
    {
      ticker: "GLD",
      label: "Defensive add",
      note: "Gold is the cleaner defensive sleeve if the financial position still needs ballast.",
      action: "Add slowly",
    },
    {
      ticker: "SGOV",
      label: "Reserve builder",
      note: "Short-duration cash proxies help when liquidity matters more than excitement.",
      action: "Hold reserve",
    },
    {
      ticker: "VRT",
      label: "Momentum watch",
      note: "Interesting mover, but TELAJ should only let this matter after the core plan is funded.",
      action: "Watch only",
    },
  ],
  recommendation: {
    headline: "Increase liquidity first, then add gold and broad ETFs",
    summary: "TELAJ is not against investing. It wants your financial position to be harder to destabilize before you push further into risk.",
    primaryAction: "Add to cash reserve",
    secondaryAction: "Allocate 10% to gold",
    growthSleeve: "Use a broad ETF basket only",
    avoid: "Concentrated speculative bets",
  },
  rules: [
    "Cash before complexity when reserves are thin",
    "Gold when the model wants defense, not panic",
    "Broad ETFs before narrow bets",
    "Real estate only when liquidity and stress tests support it",
  ],
  watchouts: [
    "Do not buy assets you cannot hold through drawdowns",
    "Do not let one asset dominate the financial system",
    "Do not weaken reserves to feel invested",
  ],
  history: [
    {
      date: "Mar 21",
      title: "Avoid adding risk before event volatility",
      action: "Skipped",
      outcome: "Avoided drawdown",
      impact: "+1.4% protected",
      quality: "good",
      spark: [18, 20, 17, 15, 12, 10, 8],
    },
    {
      date: "Mar 18",
      title: "Shift 10% to gold and cash",
      action: "Executed",
      outcome: "Reduced pressure",
      impact: "Buffer improved",
      quality: "good",
      spark: [4, 6, 8, 9, 10, 11, 12],
    },
    {
      date: "Mar 14",
      title: "Wait before entering real estate",
      action: "Observed",
      outcome: "Patience preserved options",
      impact: "No forced move",
      quality: "warn",
      spark: [11, 10, 10, 9, 8, 8, 8],
    },
  ],
  tasks: [
    { id: "signal", title: "Review the morning signal", xp: 50, done: true },
    { id: "cash", title: "Confirm emergency reserve target", xp: 70, done: false },
    { id: "rebalance", title: "Review allocation drift", xp: 60, done: false },
    { id: "asset", title: "Audit one asset for productivity", xp: 45, done: true },
    { id: "discipline", title: "Choose patience over noise", xp: 40, done: true },
  ],
  badges: [
    { name: "Balanced Allocator", note: "Kept core allocations within target bands.", earned: true },
    { name: "Cash Buffer Built", note: "Reached minimum reserve threshold.", earned: false },
    { name: "Gold Defender", note: "Added defense before stress escalated.", earned: true },
    { name: "Real Estate Ready", note: "Built reserves before property exposure.", earned: false },
  ],
  leaderboard: [
    { name: "You", score: "82 discipline", rank: 1 },
    { name: "Allocator cohort", score: "79 discipline", rank: 2 },
    { name: "Builder cohort", score: "73 discipline", rank: 3 },
  ],
  property: {
    signal: "Wait before entering real estate aggressively",
    note: "Rates and liquidity say prepare first, not force the move.",
    metrics: [
      { label: "Readiness score", value: "64 / 100" },
      { label: "Cash for down payment", value: "72%" },
      { label: "Rate environment", value: "Still elevated" },
      { label: "Reserve overlap", value: "Too tight" },
    ],
    checklist: [
      "Finish 6-month emergency reserve",
      "Reduce short-term debt pressure",
      "Model vacancy and maintenance stress",
      "Only buy if cash flow still works under stress",
    ],
  },
  liquidityDetails: {
    liquidAssets: 0,
    monthlyNeed: 0,
  },
  financialPosition: {
    investments: 0,
    retirement: 0,
    realEstate: 0,
    business: 0,
    creditCardDebt: 0,
    loans: 0,
    mortgageDebt: 0,
  },
  propertyAppraisal: {
    address: "",
    size: 90,
    unit: "sqm",
    estimatedValue: 0,
    valueLow: 0,
    valueHigh: 0,
    pricePerSqm: 0,
    note: "Enter an address and size to get a quick educational appraisal.",
  },
  realEstateIntel: {
    hero: null,
    markets: [],
    newsSignals: [],
    deals: [],
    taxEducation: { items: [] },
  },
  realEstateFilters: {
    budget: 350000,
    market: "",
    strategy: "",
    targetYield: 6,
    minimumCapRate: 5.5,
    minimumCashFlow: 100,
    propertyType: "",
  },
  addressAnalyzer: {
    address: "",
    purchasePrice: 250000,
    expectedRent: 2200,
    downPaymentPct: 25,
    interestRatePct: 6.25,
    taxesMonthly: 240,
    insuranceMonthly: 110,
    repairsMonthly: 150,
    vacancyPct: 6,
    managementPct: 8,
    closingCosts: 9000,
    renovationBudget: 12000,
  },
  holdAdvisor: {
    address: "",
    currentValue: 325000,
    mortgageBalance: 185000,
    currentRent: 2400,
    monthlyExpenses: 650,
    estimatedRepairs: 8000,
    currentRatePct: 6.9,
    expectedSalePrice: 325000,
    exitCostsPct: 7,
  },
};

const state = structuredClone(defaultState);
const MARKET_REGION_CONFIG = {
  US: {
    label: "US markets",
    marketTape: structuredClone(defaultState.marketTape),
    investmentIntel: structuredClone(defaultState.investmentIntel),
  },
  EU: {
    label: "European markets",
    marketTape: [
      { ticker: "ASML", price: 918.4, changePct: 1.1, trend: "up" },
      { ticker: "SAP", price: 181.2, changePct: 0.8, trend: "up" },
      { ticker: "MC", price: 802.1, changePct: -0.4, trend: "down" },
      { ticker: "SIE", price: 176.9, changePct: 1.5, trend: "up" },
      { ticker: "AIR", price: 164.7, changePct: -0.6, trend: "down" },
      { ticker: "NESN", price: 96.3, changePct: 0.2, trend: "up" },
    ],
    investmentIntel: {
      marketState: {
        regime: "selective european accumulation",
        distanceFromMonthLowPct: 3.4,
        distanceFromMonthHighPct: 6.1,
        breadth: "mixed-to-improving",
        volatility: "moderate",
        rates: "ecb easing bias",
        riskLevel: "medium",
        summary: "European risk assets are not euphoric, and softer ECB expectations are keeping diversified exposure more attractive than waiting for a perfect reset.",
      },
      newsDrivers: [
        "ECB easing expectations are helping duration and broad equity risk in Europe.",
        "Industrial and luxury leadership is narrower than in the US, so selectivity still matters.",
        "Gold remains useful as a hedge while policy and growth signals remain uneven across the region.",
      ],
      assetSignals: [
        {
          ticker: "VGK",
          label: "European broad equity core",
          signal: "add slowly",
          confidence: 72,
          why: "Broad European exposure looks more attractive when rates are no longer tightening aggressively and valuations remain less stretched than high-beta US growth.",
          risk: "European growth can still disappoint if industrial demand softens again.",
          safer: "Build in tranches rather than moving all at once.",
          horizon: "6-18 months",
        },
        {
          ticker: "EUNL",
          label: "Global developed core",
          signal: "buy",
          confidence: 69,
          why: "A developed-markets core reduces single-region risk while still letting Europe participate in a softer-rate backdrop.",
          risk: "Global exposure can dilute a sharper regional rebound.",
          safer: "Use this as the core before adding narrower thematic bets.",
          horizon: "6-18 months",
        },
        {
          ticker: "SGLD",
          label: "Gold hedge",
          signal: "hold",
          confidence: 74,
          why: "Gold still works as a macro hedge while European policy and growth signals remain uneven.",
          risk: "Gold can lag if growth and real yields both improve together.",
          safer: "Keep it as ballast, not the center of the plan.",
          horizon: "3-12 months",
        },
        {
          ticker: "ERNE",
          label: "Euro short-duration reserve sleeve",
          signal: "hold",
          confidence: 77,
          why: "Short-duration euro exposure still fits reserve capital while market conviction is only selective.",
          risk: "It preserves capital better than it compounds aggressively.",
          safer: "Use it as reserve ballast, not as the whole allocation.",
          horizon: "0-12 months",
        },
      ],
      portfolioAction: {
        title: "Add Europe slowly, keep reserves short duration, keep gold as ballast",
        summary: "TELAJ would lean toward diversified European or developed-market exposure in tranches, keep the reserve sleeve defensive, and avoid over-concentrating in a single hot theme.",
        primary: "Add broad Europe or developed-market ETF exposure in tranches",
        secondary: "Keep gold and short-duration reserves in place",
        avoid: "Concentrated regional or thematic chasing",
      },
    },
  },
};
const AUTH_STORAGE_KEY = "telaj-auth-v1";
const ONBOARDING_STORAGE_KEY = "telaj-onboarding-v1";
const WEALTH_INPUTS_STORAGE_KEY = "telaj-wealth-inputs-v1";
const SUBSCRIBER_PREFERENCES_KEY = "telaj-subscriber-preferences-v1";
const questionBank = [
  {
    id: "netWorthBand",
    category: "Balance sheet",
    prompt: "Roughly how much are you worth today?",
    helper: "TELAJ starts with a rough net-worth band so the advice fits the real scale of your finances.",
    options: [
      { value: "under-50k", title: "Under 50k", note: "Early-stage or still building the base." },
      { value: "50k-250k", title: "50k-250k", note: "You have started to build real capital." },
      { value: "250k-1m", title: "250k-1m", note: "Meaningful capital allocation decisions matter now." },
      { value: "1m-plus", title: "1m+", note: "Preservation, optimization, and structure matter more." },
    ],
  },
  {
    id: "liquidity",
    category: "Balance sheet",
    prompt: "How much of your wealth is actually liquid?",
    helper: "Liquidity matters because your finances need flexibility, not just headline net worth.",
    options: [
      { value: "very-low", title: "Very low", note: "Most wealth is tied up or hard to access." },
      { value: "moderate", title: "Moderate", note: "Some flexibility, but still somewhat constrained." },
      { value: "healthy", title: "Healthy", note: "Enough liquidity to handle shocks and choices." },
      { value: "very-strong", title: "Very strong", note: "A large share of wealth is liquid and deployable." },
    ],
  },
  {
    id: "assetLocation",
    category: "Balance sheet",
    prompt: "Where does most of your money or asset value sit today?",
    helper: "TELAJ needs to know what is really driving your balance sheet.",
    options: [
      { value: "cash", title: "Cash and reserves", note: "Most value sits in cash or savings." },
      { value: "markets", title: "Markets", note: "ETFs, stocks, retirement, or brokerage assets dominate." },
      { value: "primary-home", title: "Primary home", note: "A large share of wealth is in the family home." },
      { value: "investment-property", title: "Investment property or business", note: "Wealth is concentrated in operating or illiquid assets." },
    ],
  },
  {
    id: "primaryResidenceStatus",
    category: "Balance sheet",
    prompt: "What best describes your primary household property situation?",
    helper: "TELAJ should separate the family home from investment properties because they play different roles.",
    options: [
      { value: "rent", title: "I rent", note: "No owned primary residence." },
      { value: "own-mortgage", title: "I own with a mortgage", note: "The home exists, but debt still shapes it." },
      { value: "own-outright", title: "I own outright", note: "The home is owned free and clear." },
      { value: "other", title: "Other setup", note: "Family arrangement or mixed housing setup." },
    ],
  },
  {
    id: "primaryHomeEquity",
    category: "Balance sheet",
    prompt: "How much equity do you have in your primary home?",
    helper: "TELAJ needs the rough equity position, not a perfect valuation model.",
    options: [
      { value: "low", title: "Low equity", note: "You still owe most of the value." },
      { value: "medium", title: "Moderate equity", note: "A meaningful but not dominant equity cushion." },
      { value: "high", title: "High equity", note: "Most of the home value is already yours." },
      { value: "full", title: "Fully owned", note: "No meaningful debt remains on the home." },
    ],
  },
  {
    id: "primaryHomeDebtRate",
    category: "Balance sheet",
    prompt: "What best describes the mortgage rate on your primary home?",
    helper: "A low fixed mortgage and an expensive mortgage create very different financial decisions.",
    options: [
      { value: "low", title: "Low rate", note: "Cheap debt, usually not urgent to attack." },
      { value: "mid", title: "Mid rate", note: "Worth watching, but not necessarily urgent." },
      { value: "high", title: "High rate", note: "This debt may be slowing wealth building." },
      { value: "unknown", title: "Not sure", note: "TELAJ will stay cautious until this is clearer." },
    ],
  },
  {
    id: "ageBand",
    category: "Identity",
    prompt: "What age range are you in?",
    helper: "Life stage changes the right balance between safety, growth, and flexibility.",
    options: [
      { value: "20s", title: "20s", note: "Early builder stage." },
      { value: "30s", title: "30s", note: "Growth and family-building stage." },
      { value: "40s", title: "40s", note: "Peak responsibility and allocation stage." },
      { value: "50plus", title: "50+", note: "Preservation, transition, and legacy matter more." },
    ],
  },
  {
    id: "householdRole",
    category: "Identity",
    prompt: "Which best describes your household?",
    helper: "TELAJ needs to know whether it is advising one person or a family system.",
    options: [
      { value: "single", title: "Single", note: "Mostly my own financial system." },
      { value: "couple", title: "Couple", note: "Shared household planning matters." },
      { value: "parent", title: "Parent household", note: "Children or dependents affect the plan." },
      { value: "multi", title: "Multi-generational", note: "This is a family capital structure." },
    ],
  },
  {
    id: "dependents",
    category: "Household",
    prompt: "How many people depend on this money besides you?",
    helper: "More dependents usually mean TELAJ should protect stability first.",
    options: [
      { value: "0", title: "None", note: "The system is mostly self-directed." },
      { value: "1-2", title: "1-2", note: "A few people rely on this capital." },
      { value: "3-4", title: "3-4", note: "The household has multiple dependents." },
      { value: "5plus", title: "5+", note: "A large family system depends on it." },
    ],
  },
  {
    id: "ownedAssets",
    category: "Household",
    prompt: "What assets do you currently own?",
    helper: "Start with broad categories, not perfect accounting.",
    options: [
      { value: "mostly-cash", title: "Mostly cash", note: "Savings, cash, and little else." },
      { value: "investments", title: "Investments", note: "ETFs, retirement accounts, or funds." },
      { value: "property", title: "Property-heavy", note: "Home, rental property, or land." },
      { value: "mixed", title: "A mix of assets", note: "Cash, investments, property, or business assets." },
    ],
  },
  {
    id: "propertyCount",
    category: "Household",
    prompt: "How many investment properties do you own beyond your primary home?",
    helper: "TELAJ should separate the family home from income or investment properties.",
    options: [
      { value: "0", title: "None", note: "No investment property exposure yet." },
      { value: "1", title: "1 property", note: "A first rental or single investment property." },
      { value: "2-3", title: "2-3 properties", note: "Investment property is now a real allocation sleeve." },
      { value: "4plus", title: "4+", note: "Property investing is a major part of the system." },
    ],
  },
  {
    id: "propertyType",
    category: "Household",
    prompt: "What type of investment properties best describes what you own?",
    helper: "Rental residential and commercial or land exposure should not be treated the same way.",
    options: [
      { value: "rental", title: "Long-term rental", note: "Residential income-producing property." },
      { value: "short-term", title: "Short-term rental", note: "Higher operating intensity and variability." },
      { value: "mixed-residential", title: "Mixed residential", note: "A mix of rental styles or several residential assets." },
      { value: "commercial-land", title: "Commercial or land", note: "Commercial, mixed-use, or raw land exposure." },
    ],
  },
  {
    id: "liabilities",
    category: "Household",
    prompt: "What liabilities do you currently have?",
    helper: "Debt changes how much freedom your capital really has.",
    options: [
      { value: "none", title: "Almost none", note: "No meaningful debt burden." },
      { value: "light", title: "Light debt", note: "A manageable mortgage or small recurring debt." },
      { value: "moderate", title: "Moderate debt", note: "Monthly payments matter and need attention." },
      { value: "heavy", title: "Heavy debt", note: "Debt is actively shaping most decisions." },
    ],
  },
  {
    id: "incomeBand",
    category: "Money",
    prompt: "How would you describe your income level?",
    helper: "TELAJ should adapt recommendations to your real earning power, not pretend everyone has the same capacity.",
    options: [
      { value: "low", title: "Tight budget", note: "Every buffer matters." },
      { value: "middle", title: "Middle income", note: "There is room to build, but tradeoffs matter." },
      { value: "high", title: "High income", note: "Strong earning power, but still needs discipline." },
      { value: "very-high", title: "Very high income", note: "High capacity, potentially high leakage too." },
    ],
  },
  {
    id: "incomeStability",
    category: "Money",
    prompt: "How stable is your income?",
    helper: "Unstable income should shift TELAJ toward resilience and reserve building.",
    options: [
      { value: "stable", title: "Very stable", note: "Predictable income and lower surprise risk." },
      { value: "mostly-stable", title: "Mostly stable", note: "Some variability, but manageable." },
      { value: "variable", title: "Variable", note: "Income can change meaningfully month to month." },
      { value: "fragile", title: "Fragile", note: "Your finances need more protection first." },
    ],
  },
  {
    id: "spendingStyle",
    category: "Behavior",
    prompt: "Which best describes your money behavior?",
    helper: "TELAJ should know whether it is building around impulse control or long-term consistency.",
    options: [
      { value: "saver", title: "Mostly a saver", note: "I naturally hold back and protect capital." },
      { value: "balanced", title: "Balanced", note: "I spend and save with some structure." },
      { value: "spender", title: "Big spender", note: "Lifestyle can eat capital quickly." },
      { value: "chaotic", title: "Chaotic", note: "Money decisions are inconsistent or reactive." },
    ],
  },
  {
    id: "savingDiscipline",
    category: "Behavior",
    prompt: "How consistent are you at saving or investing?",
    helper: "TELAJ can design around inconsistency, but it needs to know it is there.",
    options: [
      { value: "automatic", title: "Very consistent", note: "I already automate and follow through." },
      { value: "mostly", title: "Mostly consistent", note: "Good habits, but not perfect." },
      { value: "sporadic", title: "Sporadic", note: "I do it sometimes, not reliably." },
      { value: "rare", title: "Rarely consistent", note: "The system needs stronger behavioral support." },
    ],
  },
  {
    id: "weakness",
    category: "Behavior",
    prompt: "What weakness hurts your finances the most?",
    helper: "TELAJ needs the real friction point, not the idealized version of you.",
    options: [
      { value: "overspending", title: "Overspending", note: "Lifestyle pressure or impulse purchases." },
      { value: "procrastination", title: "Avoiding decisions", note: "I postpone financial moves too long." },
      { value: "fomo", title: "FOMO / chasing", note: "I am tempted by hype or sudden trends." },
      { value: "consistency", title: "Inconsistency", note: "I know what to do, but I do not stick to it." },
    ],
  },
  {
    id: "drawdown",
    category: "Behavior",
    prompt: "If your portfolio drops 20%, what do you do?",
    helper: "This tells TELAJ how much emotional risk the plan can survive.",
    options: [
      { value: "sell", title: "Sell quickly", note: "I would reduce risk fast." },
      { value: "pause", title: "Wait and watch", note: "I would stop and look for clarity." },
      { value: "hold", title: "Hold steady", note: "I would stay disciplined." },
      { value: "buy", title: "Buy more", note: "I would add if the plan still makes sense." },
    ],
  },
  {
    id: "healthConstraint",
    category: "Life factors",
    prompt: "Are there any health or caregiving factors that should make TELAJ more conservative?",
    helper: "This is optional, but it matters because fragile life situations require stronger reserves.",
    options: [
      { value: "none", title: "No major issue", note: "No obvious health or caregiving constraint." },
      { value: "mild", title: "Some constraints", note: "There is some uncertainty or a personal, business, or family burden." },
      { value: "significant", title: "Significant", note: "Health or caregiving meaningfully affects planning." },
      { value: "prefer-not", title: "Prefer not to say", note: "TELAJ will stay neutral on this factor." },
    ],
  },
  {
    id: "goal",
    category: "Goals",
    prompt: "What are you trying to build first?",
    helper: "TELAJ should optimize for the mission, not generic financial advice.",
    options: [
      { value: "safety", title: "Safety", note: "Stability, reserves, and lower stress." },
      { value: "income", title: "Income", note: "Cash flow and durable monthly support." },
      { value: "growth", title: "Growth", note: "Long-term compounding and asset expansion." },
      { value: "legacy", title: "Legacy", note: "Multi-decade wealth and long-term continuity." },
    ],
  },
  {
    id: "wealthFor",
    category: "Goals",
    prompt: "Who is this wealth for?",
    helper: "TELAJ should understand whether this is personal, business, or family capital.",
    options: [
      { value: "me", title: "Me", note: "Primarily my own financial operating system." },
      { value: "spouse", title: "Me and spouse", note: "Shared stability and long-term planning." },
      { value: "children", title: "My children", note: "The next generation matters directly." },
      { value: "multi", title: "Multi-generational", note: "This is a family capital system." },
    ],
  },
  {
    id: "propertyIntent",
    category: "Goals",
    prompt: "How do you think about real estate right now?",
    helper: "TELAJ should know whether real estate is already part of the plan or only a future option.",
    options: [
      { value: "none", title: "Not a priority", note: "Property is not a current target." },
      { value: "prepare", title: "Preparing", note: "I want to be ready, but not rush." },
      { value: "active", title: "Actively interested", note: "I want TELAJ to help me move toward it." },
      { value: "existing", title: "Already involved", note: "I already own or invest in property." },
    ],
  },
  {
    id: "investedAssets",
    category: "Goals",
    prompt: "What assets do you already invest in?",
    helper: "This helps TELAJ understand your current habits and concentration.",
    options: [
      { value: "cash-and-etf", title: "Cash and ETFs", note: "Simple, broad, disciplined exposure." },
      { value: "stocks", title: "Stocks and ETFs", note: "Mostly market-based holdings." },
      { value: "property-and-market", title: "Property and markets", note: "Real estate plus investment assets." },
      { value: "mixed-risk", title: "A mixed risk stack", note: "Some combination of equities, gold, crypto, or property." },
    ],
  },
];

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const appShell = document.getElementById("app-shell");
const authShell = document.getElementById("auth-shell");
const onboardingShell = document.getElementById("onboarding-shell");
const railAccount = document.getElementById("rail-account");
const railFooter = document.getElementById("rail-footer");
let supabaseClient = null;
let navBound = false;
const DEFAULT_BETA_INVITE_CODES = ["TELAJ-BETA-7Q2M9X"];
const FINANCIAL_POSITION_ENDPOINT = "/api/financial-position";

const mockEndpoints = {
  familyDashboard: "./mock-api/family-dashboard.json",
  allocation: "./mock-api/allocation.json",
  signals: "./mock-api/signals.json",
  progress: "./mock-api/progress.json",
  realEstate: "./mock-api/real-estate.json",
  realEstateIntel: "./mock-api/real-estate-intel.json",
};

function initSupabaseClient() {
  const config = window.TELAJ_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase?.createClient) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  return supabaseClient;
}

function showFatalShellError(message) {
  appShell.classList.add("is-hidden");
  onboardingShell.classList.remove("is-active");
  onboardingShell.innerHTML = "";
  authShell.classList.add("is-active");
  authShell.innerHTML = `
    <div class="auth-card">
      <div class="auth-head">
        <div>
          <img class="auth-logo" src="./assets/telaj-logo2.png" alt="TELAJ" />
          <div class="eyebrow">TELAJ STATUS</div>
          <h1 class="onboarding-title">TELAJ hit a startup error</h1>
          <p class="onboarding-copy">The shell did not load correctly, so TELAJ is showing the error instead of a blank page.</p>
        </div>
        <div class="auth-error">Runtime error</div>
      </div>
      <div class="legal-note">
        <div class="micro-label">Error</div>
        <div class="panel-copy">${message}</div>
      </div>
      <div class="onboarding-actions">
        <button class="action-button primary" id="fatal-reload">Reload TELAJ</button>
      </div>
    </div>
  `;
  document.getElementById("fatal-reload")?.addEventListener("click", () => window.location.reload());
}

function normalizeInviteCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getBetaAccessConfig() {
  const config = window.TELAJ_CONFIG || {};
  const configuredCodes = Array.isArray(config.betaInviteCodes) ? config.betaInviteCodes : [];
  const inviteCodes = configuredCodes.length ? configuredCodes : DEFAULT_BETA_INVITE_CODES;
  return {
    inviteOnly: config.betaInviteOnly !== false,
    tierLabel: typeof config.betaTierLabel === "string" && config.betaTierLabel ? config.betaTierLabel : "Private beta",
    inviteCodes: inviteCodes.map(normalizeInviteCode).filter(Boolean),
  };
}

function loadAuthState() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    state.auth = {
      authenticated: Boolean(parsed.authenticated),
      mode: typeof parsed.mode === "string" ? parsed.mode : "gate",
      guest: Boolean(parsed.guest),
      email: typeof parsed.email === "string" ? parsed.email : "",
      legalAccepted: Boolean(parsed.legalAccepted),
      betaUnlocked: Boolean(parsed.betaUnlocked),
      betaCode: typeof parsed.betaCode === "string" ? parsed.betaCode : "",
      error: "",
      info: typeof parsed.info === "string" ? parsed.info : "",
    };
  } catch (error) {
    console.warn("TELAJ auth state could not be restored.", error);
  }
}

function persistAuthState() {
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      authenticated: state.auth.authenticated,
      mode: state.auth.mode,
      guest: state.auth.guest,
      email: state.auth.email,
      legalAccepted: state.auth.legalAccepted,
      betaUnlocked: state.auth.betaUnlocked,
      betaCode: state.auth.betaCode,
      info: state.auth.info,
    })
  );
}

function resetLocalSessionState() {
  state.auth.authenticated = false;
  state.auth.guest = false;
  state.auth.mode = "guest";
  state.auth.email = "";
  state.auth.error = "";
  state.auth.info = "";
  state.onboarding.completed = false;
  state.onboarding.currentStep = 0;
  state.onboarding.stage = "questions";
}

async function handleLogout() {
  const client = initSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (error) {
      console.warn("TELAJ could not fully sign out of Supabase.", error);
    }
  }
  resetLocalSessionState();
  persistAuthState();
  renderAll();
}

function loadSubscriberPreferences() {
  try {
    const raw = window.localStorage.getItem(SUBSCRIBER_PREFERENCES_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    state.subscriberPreferences = {
      ...state.subscriberPreferences,
      ...(typeof parsed === "object" && parsed ? parsed : {}),
    };
  } catch (error) {
    console.warn("TELAJ subscriber preferences could not be restored.", error);
  }
}

function persistSubscriberPreferences() {
  window.localStorage.setItem(SUBSCRIBER_PREFERENCES_KEY, JSON.stringify(state.subscriberPreferences));
}

function syncSubscriberEmailFromAuth() {
  if (!state.subscriberPreferences.contactEmail && state.auth.email) {
    state.subscriberPreferences.contactEmail = state.auth.email;
    persistSubscriberPreferences();
  }
}

function getAuthAvailability() {
  return Boolean(initSupabaseClient());
}

function applyMarketRegion(region) {
  const key = region === "EU" ? "EU" : "US";
  state.marketRegion = key;
  const config = MARKET_REGION_CONFIG[key];
  state.marketTape = structuredClone(config.marketTape);
  state.investmentIntel = structuredClone(config.investmentIntel);
  window.localStorage.setItem("telaj-market-region-v1", key);
}

function loadMarketRegion() {
  try {
    const saved = window.localStorage.getItem("telaj-market-region-v1") || defaultState.marketRegion;
    applyMarketRegion(saved);
  } catch (error) {
    console.warn("TELAJ could not restore market region, defaulting to US.", error);
    applyMarketRegion(defaultState.marketRegion);
  }
}

function requiresBetaInvite() {
  return getBetaAccessConfig().inviteOnly;
}

function hasBetaAccess() {
  return !requiresBetaInvite() || state.auth.betaUnlocked;
}

function unlockBetaAccess(rawCode) {
  const normalized = normalizeInviteCode(rawCode);
  const { inviteCodes } = getBetaAccessConfig();
  if (!normalized) {
    state.auth.error = "Enter a beta access code before continuing.";
    renderAuthShell();
    return false;
  }
  if (!inviteCodes.includes(normalized)) {
    state.auth.error = "That beta access code is not valid.";
    renderAuthShell();
    return false;
  }
  state.auth.betaUnlocked = true;
  state.auth.betaCode = normalized;
  state.subscription.plan = "Beta";
  state.subscription.status = "Unlocked";
  state.subscription.seat = "Founding tester";
  state.auth.error = "";
  state.auth.info = "Beta access unlocked. You can continue into TELAJ.";
  persistAuthState();
  renderAuthShell();
  return true;
}

function mergeState(payload) {
  Object.assign(state, payload);
}

function loadOnboardingState() {
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    state.onboarding = {
      completed: Boolean(parsed.completed),
      currentStep: Number(parsed.currentStep ?? 0),
      stage: parsed.stage === "complete" ? "complete" : parsed.stage === "intent" ? "intent" : "questions",
      answers: typeof parsed.answers === "object" && parsed.answers ? parsed.answers : {},
      profiles:
        typeof parsed.profiles === "object" && parsed.profiles
          ? parsed.profiles
          : structuredClone(defaultState.onboarding.profiles),
      intent:
        typeof parsed.intent === "object" && parsed.intent
          ? {
              notes: typeof parsed.intent.notes === "string" ? parsed.intent.notes : "",
              analysis: parsed.intent.analysis ?? null,
              confirmed: Boolean(parsed.intent.confirmed),
            }
          : structuredClone(defaultState.onboarding.intent),
    };
    const firstMissing = getFirstMissingQuestionIndex();
    if (firstMissing >= 0) {
      state.onboarding.completed = false;
      state.onboarding.stage = "questions";
      state.onboarding.currentStep = firstMissing;
    } else if (!state.onboarding.intent?.analysis) {
      state.onboarding.completed = false;
      state.onboarding.stage = "intent";
    } else if (state.onboarding.completed) {
      state.onboarding.stage = "complete";
    }
  } catch (error) {
    console.warn("TELAJ onboarding state could not be restored.", error);
  }
}

function persistOnboardingState() {
  window.localStorage.setItem(
    ONBOARDING_STORAGE_KEY,
    JSON.stringify({
      completed: state.onboarding.completed,
      currentStep: state.onboarding.currentStep,
      stage: state.onboarding.stage,
      answers: state.onboarding.answers,
      profiles: state.onboarding.profiles,
      intent: state.onboarding.intent,
    })
  );
}

function loadWealthInputs() {
  try {
    const raw = window.localStorage.getItem(WEALTH_INPUTS_STORAGE_KEY);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw);
    if (parsed.liquidityDetails) {
      state.liquidityDetails = { ...state.liquidityDetails, ...parsed.liquidityDetails };
    }
    if (parsed.financialPosition) {
      state.financialPosition = { ...state.financialPosition, ...parsed.financialPosition };
    }
    if (parsed.propertyAppraisal) {
      state.propertyAppraisal = { ...state.propertyAppraisal, ...parsed.propertyAppraisal };
    }
    state.syncStatus.financialPosition = "Local fallback";
    return true;
  } catch (error) {
    console.warn("TELAJ wealth inputs could not be restored.", error);
    return false;
  }
}

function persistWealthInputs() {
  window.localStorage.setItem(
    WEALTH_INPUTS_STORAGE_KEY,
    JSON.stringify({
      liquidityDetails: state.liquidityDetails,
      financialPosition: state.financialPosition,
      propertyAppraisal: state.propertyAppraisal,
    })
  );
}

async function getAccessToken() {
  const client = initSupabaseClient();
  if (!client) {
    return "";
  }
  try {
    const { data } = await client.auth.getSession();
    return data?.session?.access_token || "";
  } catch (error) {
    console.warn("TELAJ could not resolve the auth token for financial sync.", error);
    return "";
  }
}

function normalizeFinancialPositionPayload(payload) {
  const normalized = payload || {};
  state.liquidityDetails = {
    ...state.liquidityDetails,
    liquidAssets: Number(normalized.liquid_cash ?? normalized.liquidAssets ?? state.liquidityDetails.liquidAssets ?? 0),
    monthlyNeed: Number(normalized.monthly_need ?? normalized.monthlyNeed ?? state.liquidityDetails.monthlyNeed ?? 0),
  };
  state.financialPosition = {
    ...state.financialPosition,
    investments: Number(normalized.investments ?? state.financialPosition.investments ?? 0),
    retirement: Number(normalized.retirement ?? state.financialPosition.retirement ?? 0),
    realEstate: Number(normalized.real_estate ?? normalized.realEstate ?? state.financialPosition.realEstate ?? 0),
    business: Number(normalized.business_assets ?? normalized.business ?? state.financialPosition.business ?? 0),
    creditCardDebt: Number(normalized.credit_card_debt ?? normalized.creditCardDebt ?? state.financialPosition.creditCardDebt ?? 0),
    loans: Number(normalized.loans ?? state.financialPosition.loans ?? 0),
    mortgageDebt: Number(normalized.mortgage_debt ?? normalized.mortgageDebt ?? state.financialPosition.mortgageDebt ?? 0),
  };
}

async function loadFinancialPositionFromApi() {
  if (!state.auth.authenticated) {
    return false;
  }
  const token = await getAccessToken();
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(FINANCIAL_POSITION_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Financial position load failed: ${response.status}`);
    }
    const payload = await response.json();
    if (payload?.position) {
      normalizeFinancialPositionPayload(payload.position);
      persistWealthInputs();
      state.syncStatus.financialPosition = "Cloud synced";
      state.syncStatus.financialPositionDetail = "Financial position loaded from your Supabase record.";
      return true;
    }
    state.syncStatus.financialPosition = "No cloud record yet";
    state.syncStatus.financialPositionDetail = "Signed in successfully, but this account does not have a saved financial position yet.";
    return false;
  } catch (error) {
    console.warn("TELAJ financial position API load failed, using local fallback.", error);
    state.syncStatus.financialPosition = "Local fallback";
    state.syncStatus.financialPositionDetail =
      error instanceof Error ? error.message : "TELAJ could not read the cloud record, so it kept the local copy.";
    return false;
  }
}

async function saveFinancialPositionToApi() {
  if (!state.auth.authenticated) {
    state.syncStatus.financialPosition = "Saved locally";
    return false;
  }
  const token = await getAccessToken();
  if (!token) {
    state.syncStatus.financialPosition = "Saved locally";
    return false;
  }
  try {
    const response = await fetch(FINANCIAL_POSITION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        liquid_cash: Number(state.liquidityDetails.liquidAssets || 0),
        monthly_need: Number(state.liquidityDetails.monthlyNeed || 0),
        investments: Number(state.financialPosition.investments || 0),
        retirement: Number(state.financialPosition.retirement || 0),
        real_estate: Number(state.financialPosition.realEstate || 0),
        business_assets: Number(state.financialPosition.business || 0),
        credit_card_debt: Number(state.financialPosition.creditCardDebt || 0),
        loans: Number(state.financialPosition.loans || 0),
        mortgage_debt: Number(state.financialPosition.mortgageDebt || 0),
      }),
    });
    if (!response.ok) {
      throw new Error(`Financial position save failed: ${response.status}`);
    }
    const payload = await response.json();
    if (payload?.position) {
      normalizeFinancialPositionPayload(payload.position);
    }
    persistWealthInputs();
    state.syncStatus.financialPosition = "Cloud synced";
    state.syncStatus.financialPositionDetail = "Financial position saved to your Supabase record.";
    return true;
  } catch (error) {
    console.warn("TELAJ financial position API save failed, keeping local copy.", error);
    state.syncStatus.financialPosition = "Saved locally";
    state.syncStatus.financialPositionDetail =
      error instanceof Error ? error.message : "TELAJ kept the local version because the cloud save failed.";
    persistWealthInputs();
    return false;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function loadMockApiState() {
  try {
    const [familyDashboard, allocation, signals, progress, realEstate, realEstateIntel] = await Promise.all([
      fetchJson(mockEndpoints.familyDashboard),
      fetchJson(mockEndpoints.allocation),
      fetchJson(mockEndpoints.signals),
      fetchJson(mockEndpoints.progress),
      fetchJson(mockEndpoints.realEstate),
      fetchJson(mockEndpoints.realEstateIntel),
    ]);

    mergeState({
      morningSignal: familyDashboard.morningSignal ?? state.morningSignal,
      systemHealth: familyDashboard.systemHealth ?? state.systemHealth,
      profile: familyDashboard.profile ?? state.profile,
      stats: familyDashboard.stats ?? state.stats,
      allocation: familyDashboard.allocation ?? state.allocation,
      watchlist: familyDashboard.watchlist ?? state.watchlist,
      marketTape: familyDashboard.marketTape ?? state.marketTape,
      highlightedSignals: familyDashboard.highlightedSignals ?? state.highlightedSignals,
      recommendation: allocation.recommendation ?? state.recommendation,
      rules: allocation.rules ?? state.rules,
      watchouts: allocation.watchouts ?? state.watchouts,
      history: signals.history ?? state.history,
      tasks: progress.tasks ?? state.tasks,
      badges: progress.badges ?? state.badges,
      leaderboard: progress.leaderboard ?? state.leaderboard,
      property: realEstate.property ?? state.property,
      realEstateIntel: realEstateIntel ?? state.realEstateIntel,
      dataSource: "Mock API JSON",
    });
  } catch (error) {
    console.warn("TELAJ mock API load failed, using embedded fallback.", error);
    state.dataSource = "Embedded fallback";
  }
}

function setView(view) {
  state.activeView = view;
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.section === view));
  views.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.view === view));
}

function getSelectedOption(questionId) {
  return state.onboarding.answers[questionId] ?? null;
}

function getLifeMatrixQuestions() {
  const answers = state.onboarding.answers;
  return questionBank.filter((question) => {
    if (question.id === "dependents" && answers.householdRole === "single") {
      return false;
    }
    if (question.id === "primaryHomeEquity") {
      return ["own-mortgage", "own-outright"].includes(answers.primaryResidenceStatus);
    }
    if (question.id === "primaryHomeDebtRate") {
      return answers.primaryResidenceStatus === "own-mortgage";
    }
    if (question.id === "propertyCount") {
      return ["property", "mixed"].includes(answers.ownedAssets) || ["existing", "active"].includes(answers.propertyIntent);
    }
    if (question.id === "propertyType") {
      return (
        (["property", "mixed"].includes(answers.ownedAssets) || ["existing", "active"].includes(answers.propertyIntent)) &&
        Boolean(answers.propertyCount) &&
        answers.propertyCount !== "0"
      );
    }
    if (question.id === "propertyIntent" && answers.ownedAssets === "mostly-cash" && answers.goal === "safety") {
      return false;
    }
    return true;
  });
}

function getFirstMissingQuestionIndex() {
  const questions = getLifeMatrixQuestions();
  return questions.findIndex((question) => !state.onboarding.answers[question.id]);
}

function deriveHouseholdProfile(answers) {
  const assetBase =
    answers.assetLocation === "investment-property"
      ? "Business and investment property profile"
      : answers.assetLocation === "primary-home"
        ? "Home-equity-led profile"
      : answers.ownedAssets === "mixed"
      ? "Multi-asset profile"
      : answers.ownedAssets === "property"
        ? "Property-centered profile"
        : answers.ownedAssets === "investments"
          ? "Investment-led profile"
          : "Liquidity-led profile";
  const propertyExposure = ["property", "mixed"].includes(answers.ownedAssets) || ["existing", "active"].includes(answers.propertyIntent);
  const archetype =
    answers.householdRole === "parent" || answers.householdRole === "multi"
      ? "Family Stabilizer"
      : answers.incomeBand === "very-high" && answers.spendingStyle === "spender"
        ? "High Earner, Low Friction Control"
        : answers.goal === "legacy"
          ? "Legacy Builder"
          : "Independent Builder";
  return {
    ageBand: answers.ageBand ?? "unknown",
    householdRole: answers.householdRole ?? "unknown",
    dependents: answers.dependents ?? "0",
    incomeBand: answers.incomeBand ?? "unknown",
    incomeStability: answers.incomeStability ?? "unknown",
    healthConstraint: answers.healthConstraint ?? "prefer-not",
    netWorthBand: answers.netWorthBand ?? "unknown",
    assetLocation: answers.assetLocation ?? "unknown",
    assetBase,
    liabilityPressure: answers.liabilities ?? "unknown",
    liquidityProfile: answers.liquidity ?? "unknown",
    primaryResidenceStatus: answers.primaryResidenceStatus ?? "unknown",
    primaryHomeEquity: answers.primaryHomeEquity ?? "unknown",
    primaryHomeDebtRate: answers.primaryHomeDebtRate ?? "unknown",
    propertyCount: answers.propertyCount ?? "0",
    propertyType: answers.propertyType ?? "none",
    propertyExposure,
    archetype,
  };
}

function deriveBehaviorProfile(answers) {
  const disciplineScoreMap = {
    automatic: 86,
    mostly: 72,
    sporadic: 54,
    rare: 38,
  };
  const riskBehavior =
    answers.drawdown === "buy"
      ? "Aggressive under stress"
      : answers.drawdown === "hold"
        ? "Stable under stress"
        : answers.drawdown === "pause"
          ? "Cautious under stress"
          : "Fragile under stress";
  return {
    spendingStyle: answers.spendingStyle ?? "balanced",
    savingDiscipline: answers.savingDiscipline ?? "mostly",
    drawdownResponse: answers.drawdown ?? "pause",
    weakness: answers.weakness ?? "consistency",
    riskBehavior,
    disciplineScore: disciplineScoreMap[answers.savingDiscipline] ?? 60,
  };
}

function deriveGoalProfile(answers) {
  const goalArchetype =
    answers.goal === "legacy"
      ? "Long-duration family builder"
      : answers.goal === "safety"
        ? "Capital protector"
        : answers.goal === "income"
          ? "Cash-flow builder"
          : "Compounder";
  const recommendedPosture =
    answers.goal === "safety" || answers.liabilities === "heavy" || answers.liquidity === "very-low"
      ? "Reserves first"
      : answers.goal === "legacy"
        ? "Long-horizon family allocation"
        : answers.goal === "income"
          ? "Cash flow and defense"
          : "Measured growth";
  return {
    primaryGoal: answers.goal ?? "growth",
    wealthFor: answers.wealthFor ?? "me",
    propertyIntent: answers.propertyIntent ?? "none",
    investedAssets: answers.investedAssets ?? "cash-and-etf",
    goalArchetype,
    recommendedPosture,
  };
}

function deriveLifeMatrixProfiles() {
  const answers = state.onboarding.answers;
  return {
    householdProfile: deriveHouseholdProfile(answers),
    behaviorProfile: deriveBehaviorProfile(answers),
    goalProfile: deriveGoalProfile(answers),
  };
}

function dedupeList(items) {
  return [...new Set(items.filter(Boolean))];
}

function analyzeIntentNotes(notes, profiles) {
  const text = notes.trim();
  if (!text) {
    return null;
  }

  const normalized = text.toLowerCase();
  const household = profiles?.householdProfile;
  const behavior = profiles?.behaviorProfile;
  const goals = profiles?.goalProfile;

  const priorityTags = [];
  const cautionTags = [];
  const reasons = [];
  const risks = [];
  const optimizeFor = [];

  if (/(child|children|family|daughter|son|wife|husband|spouse|parent)/.test(normalized)) {
    priorityTags.push("Family-first");
    optimizeFor.push("household stability");
  }
  if (/(home|house|property|real estate|rental|rent)/.test(normalized)) {
    priorityTags.push("Real-estate intent");
    optimizeFor.push("property readiness");
  }
  if (/(income|cash flow|monthly|rent|dividend)/.test(normalized)) {
    priorityTags.push("Income focus");
    optimizeFor.push("durable cash flow");
  }
  if (/(legacy|future|generation|children|inherit)/.test(normalized)) {
    priorityTags.push("Legacy orientation");
    optimizeFor.push("long-duration family capital");
  }
  if (/(safe|safety|protect|emergency|reserve|buffer|stability)/.test(normalized)) {
    priorityTags.push("Safety-first");
    optimizeFor.push("reserve strength");
  }
  if (/(grow|growth|compound|long term|long-term|wealth)/.test(normalized)) {
    priorityTags.push("Growth intent");
    optimizeFor.push("measured compounding");
  }

  if (/(crypto|options|meme|gamble|bet|leverage|yolo)/.test(normalized)) {
    cautionTags.push("Speculation risk");
    risks.push("The motivation includes language that sounds closer to speculation than disciplined allocation.");
  }
  if (/(fast|quick|urgent|asap|immediately|get rich|rich quick)/.test(normalized)) {
    cautionTags.push("Speed pressure");
    risks.push("The goal may be pushing for speed in a way that can weaken discipline.");
  }
  if (/(fear|afraid|anxious|stress|panic)/.test(normalized)) {
    cautionTags.push("Emotional pressure");
    risks.push("Emotional stress is part of the decision environment, so TELAJ should stay more conservative.");
  }
  if (/(debt|loan|mortgage|owe)/.test(normalized)) {
    cautionTags.push("Debt sensitivity");
    optimizeFor.push("debt pressure control");
  }

  if (goals?.primaryGoal === "safety") {
    reasons.push("Your structured profile already says safety comes first, and the written motivation supports that.");
  } else if (goals?.primaryGoal === "growth") {
    reasons.push("Your notes point toward growth, but TELAJ will still filter growth through liquidity and discipline.");
  } else if (goals?.primaryGoal === "legacy") {
    reasons.push("Your motivation reads like long-duration family planning rather than short-term performance chasing.");
  }

  if (household?.liquidityProfile === "very-low") {
    risks.push("The household profile still shows weak liquidity, so good goals can still be mistimed.");
  }
  if (household?.primaryResidenceStatus === "own-mortgage" && household?.primaryHomeDebtRate === "high") {
    risks.push("A higher-cost primary-home mortgage may deserve attention before optional new risk.");
  }
  if (behavior?.weakness === "fomo") {
    cautionTags.push("FOMO guardrail");
    risks.push("Your behavior profile suggests TELAJ should challenge excitement-driven decisions more aggressively.");
  } else if (behavior?.weakness === "overspending") {
    cautionTags.push("Spending control");
    risks.push("Lifestyle leakage can quietly overpower even good allocation goals.");
  }

  const heard = text.length > 220 ? `${text.slice(0, 217).trim()}...` : text;
  const makesSense =
    reasons[0] ??
    "The motivation is usable and TELAJ can translate it into a calmer allocation posture rather than generic finance advice.";
  const critique =
    risks[0] ??
    "The goal sounds valid, but TELAJ will still pressure-test timing, liquidity, and concentration before endorsing action.";
  const optimize =
    dedupeList(optimizeFor)[0] ??
    (goals?.recommendedPosture === "Reserves first" ? "household resilience" : "disciplined long-term allocation");
  const watchout =
    dedupeList(cautionTags)[0] ??
    (behavior?.riskBehavior === "Fragile under stress" ? "Stress reactions under drawdown" : "Forcing moves too early");

  return {
    heard,
    priorityTags: dedupeList(priorityTags).slice(0, 4),
    cautionTags: dedupeList(cautionTags).slice(0, 4),
    makesSense,
    critique,
    optimizeFor: optimize,
    watchout,
  };
}

async function analyzeIntent(notes, profiles) {
  try {
    const response = await fetch("/api/intent-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes,
        profiles,
      }),
    });

    if (!response.ok) {
      throw new Error(`Intent route failed: ${response.status}`);
    }

    const payload = await response.json();
    if (payload?.analysis) {
      return payload.analysis;
    }
  } catch (error) {
    console.warn("TELAJ intent API unavailable, using local analysis.", error);
  }

  return analyzeIntentNotes(notes, profiles);
}

function applyProfilesToNarrative() {
  const { householdProfile, behaviorProfile, goalProfile } = state.onboarding.profiles;
  const intent = state.onboarding.intent?.analysis;
  if (!householdProfile || !behaviorProfile || !goalProfile) {
    return;
  }
  state.morningSignal = structuredClone(defaultState.morningSignal);
  state.recommendation = structuredClone(defaultState.recommendation);
  state.tasks = structuredClone(defaultState.tasks);
  state.property = structuredClone(defaultState.property);

  if (
    householdProfile.liquidityProfile === "very-low" ||
    householdProfile.liabilityPressure === "heavy" ||
    goalProfile.recommendedPosture === "Reserves first"
  ) {
    state.morningSignal.move = "Strengthen liquidity before adding new risk";
    state.morningSignal.rationale =
      "TELAJ sees a financial position that needs more room to absorb life, debt, or income pressure before taking on more exposure.";
    state.recommendation.headline = "Build reserve strength before stretching for returns";
    state.recommendation.primaryAction = "Increase cash buffer";
    state.tasks = [
      { id: "reserve", title: "Strengthen the emergency reserve", xp: 70, done: false },
      { id: "debt", title: "Reduce debt pressure or payments", xp: 60, done: false },
      { id: "signal", title: "Review the morning signal", xp: 50, done: true },
      { id: "discipline", title: "Avoid adding risk emotionally", xp: 45, done: false },
      { id: "asset", title: "Audit one expense leak", xp: 40, done: false },
    ];
  } else if (goalProfile.primaryGoal === "growth" && behaviorProfile.disciplineScore >= 70) {
    state.morningSignal.move = "Build a disciplined ETF core and add defense slowly";
    state.morningSignal.rationale =
      "TELAJ sees enough consistency to let growth matter, but still wants diversification and protection around it.";
    state.recommendation.headline = "Use broad ETFs as the base and keep gold as defense";
    state.recommendation.primaryAction = "Allocate to broad ETF basket";
    state.tasks = [
      { id: "signal", title: "Review the ETF allocation signal", xp: 50, done: true },
      { id: "rebalance", title: "Review allocation drift", xp: 60, done: false },
      { id: "gold", title: "Keep a defensive sleeve in place", xp: 45, done: false },
      { id: "asset", title: "Audit one holding for concentration", xp: 40, done: false },
      { id: "discipline", title: "Ignore hype and stay broad", xp: 35, done: true },
    ];
  } else if (goalProfile.propertyIntent === "active" || householdProfile.propertyExposure) {
    state.morningSignal.move = "Prepare the broader financial picture before forcing the next property move";
    state.morningSignal.rationale =
      "TELAJ sees real estate in the picture, but wants liquidity, debt pressure, and resilience checked before momentum decisions.";
    state.recommendation.secondaryAction = "Prepare for real estate deliberately";
    state.tasks = [
      { id: "signal", title: "Review the property readiness signal", xp: 50, done: true },
      { id: "cash", title: "Check down payment liquidity", xp: 65, done: false },
      { id: "vacancy", title: "Run a vacancy stress test", xp: 55, done: false },
      { id: "debt", title: "Check financing pressure", xp: 50, done: false },
      { id: "discipline", title: "Do not force the property move", xp: 40, done: true },
    ];
    state.property.signal = "Prepare before expanding real-estate exposure";
    state.property.note = "TELAJ sees property relevance, but it wants stronger financial resilience before a bigger move.";
  }

  if (householdProfile.propertyExposure && goalProfile.propertyIntent !== "none") {
    state.property.signal = "Real estate matters, but only if liquidity and stress still work";
    state.property.note = "The property decision should serve the broader financial system, not become the system.";
  }

  if (["2-3", "4plus"].includes(householdProfile.propertyCount)) {
    state.property.signal = "Property concentration now deserves active portfolio discipline";
    state.property.note =
      "TELAJ sees multiple properties on the balance sheet, so liquidity, debt structure, and vacancy resilience matter more than the next acquisition story.";
  } else if (householdProfile.propertyType === "rental" || householdProfile.propertyType === "commercial-land") {
    state.property.note =
      "TELAJ treats income-producing property as an operating asset, so cash flow discipline and stress testing matter more than headline valuations.";
  }

  if (householdProfile.primaryResidenceStatus === "own-mortgage" && householdProfile.primaryHomeDebtRate === "high") {
    state.morningSignal.move = "Review expensive home debt before stretching into new risk";
    state.morningSignal.rationale =
      "TELAJ sees a primary residence with a higher-cost mortgage, which can matter more than chasing another asset too early.";
    state.recommendation.primaryAction = "Review mortgage pressure and overall liquidity";
    state.recommendation.secondaryAction = "Delay optional risk until the home balance sheet is stronger";
  }

  if (intent?.optimizeFor === "property readiness") {
    state.recommendation.secondaryAction = "Translate the goal into a property-readiness plan, not an impulse move";
    state.property.signal = "Property intent is real, but TELAJ wants readiness over urgency";
  } else if (intent?.optimizeFor === "durable cash flow") {
    state.recommendation.headline = "Build reliable cash flow without weakening the financial core";
    state.recommendation.growthSleeve = "Favor durable ETF and cash-flow assets over concentrated bets";
  } else if (intent?.optimizeFor === "reserve strength") {
    state.morningSignal.move = "Protect the cash buffer before reaching for the next idea";
  }

  if (intent?.watchout === "Speculation risk" || intent?.watchout === "Speed pressure") {
    state.recommendation.avoid = "Fast, narrative-driven moves that break the financial plan";
  }

  if (state.financialPosition.creditCardDebt > 0) {
    state.morningSignal.move = "Clear expensive debt before adding optional risk";
    state.morningSignal.rationale =
      "TELAJ sees revolving consumer debt on the balance sheet, which usually deserves attention before new speculative or non-essential allocation.";
    state.recommendation.primaryAction = "Reduce credit card debt";
    state.recommendation.headline = "Pay down expensive debt, then rebuild the investment posture";
  } else if (state.financialPosition.loans > state.financialPosition.investments && state.financialPosition.loans > 0) {
    state.recommendation.secondaryAction = "Review loan burden before increasing long-duration risk";
  }

  if (behaviorProfile.weakness === "overspending") {
    state.recommendation.avoid = "Lifestyle inflation and emotional spending";
  } else if (behaviorProfile.weakness === "fomo") {
    state.recommendation.avoid = "Hype-driven entries and chasing fast narratives";
  } else if (behaviorProfile.weakness === "procrastination") {
    state.recommendation.avoid = "Waiting forever instead of acting on good enough decisions";
  }

  const financialAdvice = getFinancialAllocationAdvice();
  state.morningSignal.move = financialAdvice.heroMove;
  state.morningSignal.rationale = financialAdvice.heroRationale;
  state.morningSignal.rationaleShort = financialAdvice.plainEnglish;
  state.recommendation.headline = financialAdvice.headline;
  state.recommendation.summary = financialAdvice.summary;
  state.recommendation.primaryAction = financialAdvice.primaryAction;
  state.recommendation.secondaryAction = financialAdvice.secondaryAction;
  state.recommendation.growthSleeve = financialAdvice.growthSleeve;
  state.recommendation.avoid = financialAdvice.watchout;
}

function renderOnboarding() {
  if (!state.auth.authenticated) {
    onboardingShell.classList.remove("is-active");
    onboardingShell.innerHTML = "";
    appShell.classList.add("is-hidden");
    return;
  }

  if (state.onboarding.completed || state.onboarding.stage === "complete") {
    onboardingShell.classList.remove("is-active");
    appShell.classList.remove("is-hidden");
    onboardingShell.innerHTML = "";
    return;
  }

  if (state.onboarding.stage === "intent") {
    renderIntentStage();
    return;
  }

  const questions = getLifeMatrixQuestions();
  const step = Math.max(0, Math.min(state.onboarding.currentStep, questions.length - 1));
  const question = questions[step];
  const selected = getSelectedOption(question.id);
  const progress = ((step + 1) / questions.length) * 100;

  onboardingShell.classList.add("is-active");
  appShell.classList.add("is-hidden");

  const isLast = step === questions.length - 1;
  onboardingShell.innerHTML = `
    <div class="onboarding-card">
      <div class="onboarding-head">
        <div>
          <div class="eyebrow">TELAJ LIFE MATRIX</div>
          <h1 class="onboarding-title">Map your finances before anything else.</h1>
          <p class="onboarding-copy">TELAJ should understand what you own, where the capital sits, how much is owed, and only then how you behave under stress.</p>
        </div>
        <div class="onboarding-step">${question.category} | ${step + 1}/${questions.length}</div>
      </div>
      <div class="onboarding-progress">
        <div class="progress-meta-row">
          <div class="task-pill">Category: ${question.category}</div>
          <div class="task-pill">${Math.round(progress)}% mapped</div>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="question-stage">
        <div class="micro-label">Current question</div>
        <h2 class="question-prompt">${question.prompt}</h2>
        <div class="onboarding-copy">${question.helper}</div>
        <div class="answer-grid">
          ${question.options
            .map(
              (option) => `
                <button class="answer-button ${selected === option.value ? "is-selected" : ""}" data-answer="${option.value}">
                  <div class="answer-title">${option.title}</div>
                  <div class="answer-note">${option.note}</div>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="onboarding-actions">
        <button class="ghost-button" id="onboarding-back" ${step === 0 ? "disabled" : ""}>Back</button>
        <div class="task-pill">${selected ? "Answer captured" : "Choose one answer"}</div>
        <button class="action-button primary" id="onboarding-next" ${selected ? "" : "disabled"}>${isLast ? "Enter TELAJ" : "Continue"}</button>
      </div>
    </div>
  `;

  onboardingShell.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.onboarding.answers[question.id] = button.dataset.answer;
      persistOnboardingState();
      renderOnboarding();
    });
  });

  const backButton = document.getElementById("onboarding-back");
  const nextButton = document.getElementById("onboarding-next");
  backButton?.addEventListener("click", () => {
    if (state.onboarding.currentStep > 0) {
      state.onboarding.currentStep -= 1;
      persistOnboardingState();
      renderOnboarding();
    }
  });
  nextButton?.addEventListener("click", () => {
    if (!selected) {
      return;
    }
    if (isLast) {
      state.onboarding.profiles = deriveLifeMatrixProfiles();
      state.onboarding.stage = "intent";
      persistOnboardingState();
      renderOnboarding();
      return;
    }
    state.onboarding.currentStep += 1;
    persistOnboardingState();
    renderOnboarding();
  });
}

function renderAuthShell() {
  if (state.auth.authenticated) {
    authShell.classList.remove("is-active");
    authShell.innerHTML = "";
    return;
  }

  const supabaseReady = getAuthAvailability();
  const mode = state.auth.mode || "gate";
  const betaConfig = getBetaAccessConfig();
  const betaUnlocked = hasBetaAccess();
  authShell.classList.add("is-active");
  appShell.classList.add("is-hidden");
  onboardingShell.classList.remove("is-active");
  onboardingShell.innerHTML = "";

  authShell.innerHTML = `
    <div class="auth-card">
      <div class="auth-head">
        <div>
          <img class="auth-logo" src="./assets/telaj-logo2.png" alt="TELAJ" />
          <div class="eyebrow">TELAJ ACCESS</div>
          <h1 class="onboarding-title">Know where you stand. Know what to do next.</h1>
          <p class="onboarding-copy">TELAJ maps your personal, business, or family finances, shows where your money sits, and gives one clear next move. Start as a guest or create an account to keep your progress.</p>
        </div>
        <div class="auth-status">${supabaseReady ? "Supabase ready" : "Guest mode ready"}</div>
      </div>
      <div class="beta-access-card ${betaUnlocked ? "is-unlocked" : ""}">
        <div>
          <div class="micro-label">Access</div>
          <div class="beta-access-title">${betaConfig.tierLabel}</div>
          <div class="panel-copy">${
            betaUnlocked
              ? `Unlocked with code ${state.auth.betaCode}. This seat is marked as a founding tester beta.`
              : "TELAJ is invite-only right now. Enter a beta code to unlock guest mode or account creation."
          }</div>
        </div>
        <div class="beta-access-form">
          <label class="input-field">
            <span class="micro-label">Beta code</span>
            <input id="beta-code" type="text" value="${state.auth.betaCode}" placeholder="TELAJ-BETA-XXXXXX" ${betaUnlocked ? "disabled" : ""} />
          </label>
          <button class="action-button ${betaUnlocked ? "" : "primary"}" id="beta-unlock" ${betaUnlocked ? "disabled" : ""}>${
            betaUnlocked ? "Unlocked" : "Unlock beta"
          }</button>
        </div>
      </div>
      <div class="auth-options">
        <button class="auth-option ${mode === "guest" ? "is-selected" : ""}" id="auth-guest" ${betaUnlocked ? "" : "disabled"}>
          <div class="answer-title">Continue as guest</div>
          <div class="answer-note">Fastest way to try TELAJ and see your financial position clearly.</div>
        </button>
        <button class="auth-option ${mode === "signup" ? "is-selected" : ""}" id="auth-signup" ${betaUnlocked ? "" : "disabled"}>
          <div class="answer-title">Create account</div>
          <div class="answer-note">Save your financial profile, real-estate work, and TELAJ decisions across devices.</div>
        </button>
        <button class="auth-option ${mode === "login" ? "is-selected" : ""}" id="auth-login" ${betaUnlocked ? "" : "disabled"}>
          <div class="answer-title">Log in</div>
          <div class="answer-note">Return to your saved financial map, capital plan, and daily TELAJ guidance.</div>
        </button>
      </div>
      <div class="social-auth">
        <button class="social-button" id="auth-google" ${supabaseReady && betaUnlocked ? "" : "disabled"}>
          <span class="social-label">Continue with Google</span>
          <span class="social-note">Use your Gmail identity</span>
        </button>
        <button class="social-button" id="auth-github" ${supabaseReady && betaUnlocked ? "" : "disabled"}>
          <span class="social-label">Continue with GitHub</span>
          <span class="social-note">Useful for builders and operators</span>
        </button>
      </div>
      ${
        mode === "signup" || mode === "login"
          ? `
            <div class="auth-form">
              <label class="input-field">
                <span class="micro-label">Email</span>
                <input id="auth-email" type="email" value="${state.auth.email}" placeholder="you@example.com" />
              </label>
              <label class="input-field">
                <span class="micro-label">Password</span>
                <input id="auth-password" type="password" placeholder="Minimum 6 characters" />
              </label>
            </div>
          `
          : `
            <div class="auth-note">
              <div class="micro-label">What TELAJ does</div>
              <div class="panel-copy">See your assets, debts, liquidity, and capital allocation in one place. TELAJ then tells you what deserves attention first and where the next dollar should go.</div>
            </div>
          `
      }
      <div class="auth-feedback">
        ${state.auth.error ? `<div class="auth-error">${state.auth.error}</div>` : ""}
        ${state.auth.info ? `<div class="auth-info">${state.auth.info}</div>` : ""}
        ${!supabaseReady ? `<div class="auth-info">Supabase public config is not set yet, so email login is disabled and guest mode will use local preview access.</div>` : ""}
        ${requiresBetaInvite() && !betaUnlocked ? `<div class="auth-info">Beta access is required before TELAJ entry is enabled.</div>` : ""}
      </div>
      <label class="legal-ack">
        <input id="legal-accept" type="checkbox" ${state.auth.legalAccepted ? "checked" : ""} />
        <span>
          I understand TELAJ provides educational information, model-based guidance, and planning suggestions only. It is not investment, tax, legal, accounting, or financial advice, and I remain responsible for my own decisions.
        </span>
      </label>
      <div class="legal-note">
        <div class="micro-label">Important</div>
        <div class="panel-copy">TELAJ is not a broker, not an investment adviser, and not a fiduciary. Signals, scenarios, and allocation examples are informational only and do not guarantee future results.</div>
      </div>
      <div class="legal-note">
        <div class="micro-label">Privacy and cookies</div>
        <div class="panel-copy">TELAJ uses essential browser storage and session data to keep you signed in, remember your progress, and save financial inputs. If analytics or marketing tracking are added later, TELAJ should ask for separate consent before using them.</div>
      </div>
      <div class="onboarding-actions">
        <div class="task-pill">${state.subscription.plan} · ${state.subscription.status}</div>
        <button class="action-button primary" id="auth-continue" ${betaUnlocked ? "" : "disabled"}>${
          mode === "signup" ? "Create account" : mode === "login" ? "Log in" : "Continue as guest"
        }</button>
      </div>
    </div>
  `;

  document.getElementById("auth-guest")?.addEventListener("click", () => {
    state.auth.mode = "guest";
    state.auth.error = "";
    state.auth.info = "";
    renderAuthShell();
  });
  document.getElementById("auth-signup")?.addEventListener("click", () => {
    state.auth.mode = "signup";
    state.auth.error = "";
    state.auth.info = "";
    renderAuthShell();
  });
  document.getElementById("auth-login")?.addEventListener("click", () => {
    state.auth.mode = "login";
    state.auth.error = "";
    state.auth.info = "";
    renderAuthShell();
  });
  document.getElementById("legal-accept")?.addEventListener("change", (event) => {
    state.auth.legalAccepted = Boolean(event.target.checked);
    state.auth.error = "";
    persistAuthState();
  });
  document.getElementById("beta-unlock")?.addEventListener("click", () => {
    const betaCode = document.getElementById("beta-code")?.value || "";
    unlockBetaAccess(betaCode);
  });
  document.getElementById("auth-continue")?.addEventListener("click", async () => {
    await handleAuthContinue();
  });
  document.getElementById("auth-google")?.addEventListener("click", async () => {
    await handleOAuth("google");
  });
  document.getElementById("auth-github")?.addEventListener("click", async () => {
    await handleOAuth("github");
  });
}

async function handleAuthContinue() {
  state.auth.error = "";
  state.auth.info = "";
  const client = initSupabaseClient();

  if (!hasBetaAccess()) {
    state.auth.error = "Enter a valid beta code before continuing into TELAJ.";
    renderAuthShell();
    return;
  }

  if (!state.auth.legalAccepted) {
    state.auth.error = "You must acknowledge the TELAJ educational-use disclaimer before continuing.";
    renderAuthShell();
    return;
  }

  if (state.auth.mode === "guest") {
    if (client) {
      const { data, error } = await client.auth.signInAnonymously();
      if (error) {
        state.auth.error = error.message;
        renderAuthShell();
        return;
      }
      state.auth.authenticated = true;
      state.auth.guest = true;
      state.auth.email = data?.user?.email || "";
      state.auth.info = "Guest session started.";
      await loadFinancialPositionFromApi();
    } else {
      state.auth.authenticated = true;
      state.auth.guest = true;
      state.auth.info = "Guest preview session started.";
      state.syncStatus.financialPosition = "Local browser only";
    }
    persistAuthState();
    renderAuthShell();
    renderOnboarding();
    return;
  }

  const email = document.getElementById("auth-email")?.value?.trim() || "";
  const password = document.getElementById("auth-password")?.value || "";
  state.auth.email = email;

  if (!client) {
    state.auth.error = "Supabase is not configured yet. Add the public URL and anon key to enable account auth.";
    renderAuthShell();
    return;
  }
  if (!email || !password) {
    state.auth.error = "Email and password are required.";
    renderAuthShell();
    return;
  }

  const result =
    state.auth.mode === "signup"
      ? await client.auth.signUp({ email, password })
      : await client.auth.signInWithPassword({ email, password });

  if (result.error) {
    state.auth.error = result.error.message;
    renderAuthShell();
    return;
  }

  state.auth.authenticated = true;
  state.auth.guest = false;
  state.auth.info = state.auth.mode === "signup" ? "Account created. Continue into TELAJ." : "Logged in.";
  persistAuthState();
  await loadFinancialPositionFromApi();
  renderAuthShell();
  renderOnboarding();
}

async function handleOAuth(provider) {
  state.auth.error = "";
  state.auth.info = "";
  const client = initSupabaseClient();

  if (!hasBetaAccess()) {
    state.auth.error = "Enter a valid beta code before using social login.";
    renderAuthShell();
    return;
  }

  if (!state.auth.legalAccepted) {
    state.auth.error = "You must acknowledge the TELAJ educational-use disclaimer before continuing.";
    renderAuthShell();
    return;
  }

  if (!client) {
    state.auth.error = "Supabase is not configured yet. Add the public URL and anon key to enable social login.";
    renderAuthShell();
    return;
  }

  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    state.auth.error = error.message;
    renderAuthShell();
    return;
  }

  state.auth.info = `Redirecting to ${provider}...`;
  persistAuthState();
  renderAuthShell();
}

function renderIntentStage() {
  const notes = state.onboarding.intent?.notes ?? "";
  const analysis = state.onboarding.intent?.analysis;

  onboardingShell.classList.add("is-active");
  appShell.classList.add("is-hidden");
  onboardingShell.innerHTML = `
    <div class="onboarding-card intent-card">
      <div class="onboarding-head">
        <div>
          <div class="eyebrow">TELAJ INTENT CHAT</div>
          <h1 class="onboarding-title">Now explain the human reason behind the plan.</h1>
          <p class="onboarding-copy">Write in your own words. TELAJ will summarize what it heard, challenge weak assumptions, and carry your motivations into future advice.</p>
        </div>
        <div class="onboarding-step">Intent | final step</div>
      </div>
      <div class="question-stage">
        <div class="micro-label">Your words</div>
        <textarea id="intent-notes" class="intent-textarea" placeholder="Example: I want to protect my finances, stop making rushed decisions, and know when real estate actually makes sense for me, my business, or the people I support. I care more about avoiding a big mistake than chasing the fastest return.">${notes}</textarea>
        <div class="onboarding-actions intent-actions">
          <button class="ghost-button" id="intent-back">Back</button>
          <div class="task-pill">${analysis ? "Intent analyzed" : "Write freely, then analyze"}</div>
          <button class="action-button" id="intent-analyze">Analyze with TELAJ</button>
          <button class="action-button primary" id="intent-enter" ${analysis ? "" : "disabled"}>Enter TELAJ</button>
        </div>
      </div>
      <div class="onboarding-summary">
        <div class="micro-label">What TELAJ heard</div>
        ${
          analysis
            ? `
              <div class="panel-copy">${analysis.heard}</div>
              <div class="summary-grid">
                <div class="profile-chip">
                  <div class="micro-label">What makes sense</div>
                  <div class="panel-copy">${analysis.makesSense}</div>
                </div>
                <div class="profile-chip">
                  <div class="micro-label">What TELAJ will challenge</div>
                  <div class="panel-copy">${analysis.critique}</div>
                </div>
                <div class="profile-chip">
                  <div class="micro-label">TELAJ will optimize for</div>
                  <div class="panel-copy">${analysis.optimizeFor}</div>
                </div>
                <div class="profile-chip">
                  <div class="micro-label">Main watchout</div>
                  <div class="panel-copy">${analysis.watchout}</div>
                </div>
              </div>
              <div class="summary-grid">
                <div class="profile-chip">
                  <div class="micro-label">Priority tags</div>
                  <div class="tag-row">
                    ${(analysis.priorityTags.length ? analysis.priorityTags : ["General planning"]).map((item) => `<span class="task-pill">${item}</span>`).join("")}
                  </div>
                </div>
                <div class="profile-chip">
                  <div class="micro-label">Caution tags</div>
                  <div class="tag-row">
                    ${(analysis.cautionTags.length ? analysis.cautionTags : ["No major warning"]).map((item) => `<span class="task-pill">${item}</span>`).join("")}
                  </div>
                </div>
              </div>
            `
            : `<div class="panel-copy">Use this to explain motivation, fear, family priorities, values, or what kind of mistake you want TELAJ to help you avoid.</div>`
        }
      </div>
    </div>
  `;

  document.getElementById("intent-back")?.addEventListener("click", () => {
    state.onboarding.stage = "questions";
    state.onboarding.currentStep = Math.max(0, getLifeMatrixQuestions().length - 1);
    persistOnboardingState();
    renderOnboarding();
  });

  document.getElementById("intent-analyze")?.addEventListener("click", async () => {
    const nextNotes = document.getElementById("intent-notes").value.trim();
    state.onboarding.intent.notes = nextNotes;
    state.onboarding.intent.analysis = await analyzeIntent(nextNotes, state.onboarding.profiles);
    state.onboarding.intent.confirmed = false;
    persistOnboardingState();
    renderIntentStage();
  });

  document.getElementById("intent-enter")?.addEventListener("click", async () => {
    state.onboarding.intent.notes = document.getElementById("intent-notes").value.trim();
    state.onboarding.intent.analysis = await analyzeIntent(state.onboarding.intent.notes, state.onboarding.profiles);
    state.onboarding.intent.confirmed = Boolean(state.onboarding.intent.analysis);
    state.onboarding.completed = true;
    state.onboarding.stage = "complete";
    persistOnboardingState();
    applyProfilesToNarrative();
    renderOnboarding();
    renderAll();
  });
}

function sparkline(points, stroke = "#4d91ff") {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const width = 240;
  const height = 42;
  const step = width / Math.max(points.length - 1, 1);
  const scaled = points.map((point, index) => {
    const y = max === min ? height / 2 : height - ((point - min) / (max - min)) * (height - 6) - 3;
    return `${index * step},${y}`;
  });
  return `
    <svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      <polyline fill="none" stroke="${stroke}" stroke-width="3" points="${scaled.join(" ")}"></polyline>
    </svg>
  `;
}

function estimatedPricePerSqm(address) {
  const text = String(address || "").toLowerCase();
  const rules = [
    { match: ["milan", "milano"], price: 6200, note: "Milan-style premium urban pricing." },
    { match: ["rome", "roma"], price: 4800, note: "Rome-style major city pricing." },
    { match: ["florence", "firenze"], price: 5200, note: "Florence-style historic city pricing." },
    { match: ["turin", "torino"], price: 3300, note: "Turin-style established city pricing." },
    { match: ["naples", "napoli"], price: 3100, note: "Naples-style dense city pricing." },
    { match: ["bologna"], price: 4200, note: "Bologna-style strong regional pricing." },
    { match: ["london"], price: 11000, note: "London-style premium international pricing." },
    { match: ["new york", "nyc"], price: 13500, note: "New York-style prime urban pricing." },
    { match: ["miami"], price: 7000, note: "Miami-style high-demand pricing." },
  ];
  for (const rule of rules) {
    if (rule.match.some((token) => text.includes(token))) {
      return { price: rule.price, note: rule.note };
    }
  }
  return { price: 2800, note: "Fallback pricing based on a generic secondary-market estimate." };
}

function calculateLiquidityMonths() {
  const liquidAssets = Number(state.liquidityDetails.liquidAssets || 0);
  const monthlyNeed = Number(state.liquidityDetails.monthlyNeed || 0);
  if (monthlyNeed <= 0) {
    return 0;
  }
  return liquidAssets / monthlyNeed;
}

function formatEuro(value) {
  return `€${Math.round(Number(value) || 0).toLocaleString()}`;
}

function getFinancialPosition() {
  const assets = [
    { key: "liquid", label: "Cash", value: Number(state.liquidityDetails.liquidAssets || 0), color: "#1f6bff" },
    { key: "investments", label: "Investments", value: Number(state.financialPosition.investments || 0), color: "#4d91ff" },
    { key: "retirement", label: "Retirement", value: Number(state.financialPosition.retirement || 0), color: "#27d17f" },
    { key: "realEstate", label: "Real estate", value: Number(state.financialPosition.realEstate || 0), color: "#ffd166" },
    { key: "business", label: "Business", value: Number(state.financialPosition.business || 0), color: "#8c6bff" },
  ].filter((item) => item.value > 0);

  const debts = [
    { key: "creditCardDebt", label: "Credit card", value: Number(state.financialPosition.creditCardDebt || 0) },
    { key: "loans", label: "Loans", value: Number(state.financialPosition.loans || 0) },
    { key: "mortgageDebt", label: "Mortgage", value: Number(state.financialPosition.mortgageDebt || 0) },
  ].filter((item) => item.value > 0);

  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalDebt = debts.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalDebt;
  const debtRatio = totalAssets > 0 ? totalDebt / totalAssets : 0;

  let opinion = "The financial position can focus on disciplined long-term allocation.";
  if (state.financialPosition.creditCardDebt > 0) {
    opinion = "TELAJ would likely prioritize expensive consumer debt before stretching into new risk.";
  } else if (debtRatio > 0.6) {
    opinion = "Debt is a large share of the balance sheet, so resilience and balance-sheet repair matter first.";
  } else if (calculateLiquidityMonths() < 3) {
    opinion = "Liquidity is still thin, so TELAJ would protect reserves before a bigger investment move.";
  }

  return { assets, debts, totalAssets, totalDebt, netWorth, debtRatio, opinion };
}

function allocatePercentages(rawBuckets) {
  const total = rawBuckets.reduce((sum, bucket) => sum + bucket.percent, 0);
  if (!total) {
    return rawBuckets;
  }

  const normalized = rawBuckets.map((bucket) => ({
    ...bucket,
    percent: Math.round((bucket.percent / total) * 100),
  }));

  const diff = 100 - normalized.reduce((sum, bucket) => sum + bucket.percent, 0);
  if (diff !== 0 && normalized.length) {
    normalized[0].percent += diff;
  }

  return normalized;
}

function getFinancialAllocationAdvice() {
  const liquidAssets = Number(state.liquidityDetails.liquidAssets || 0);
  const monthlyNeed = Number(state.liquidityDetails.monthlyNeed || 0);
  const reserveMonths = calculateLiquidityMonths();
  const position = getFinancialPosition();
  const unsecuredDebt = Number(state.financialPosition.creditCardDebt || 0) + Number(state.financialPosition.loans || 0);
  const mortgageDebt = Number(state.financialPosition.mortgageDebt || 0);
  const profiles = state.onboarding.profiles || {};
  const householdProfile = profiles.householdProfile || {};
  const behaviorProfile = profiles.behaviorProfile || {};
  const goalProfile = profiles.goalProfile || {};

  let reserveTargetMonths = 6;
  if (goalProfile.primaryGoal === "safety" || goalProfile.wealthFor === "children" || goalProfile.wealthFor === "multi-generational") {
    reserveTargetMonths = 9;
  } else if (householdProfile.propertyExposure || householdProfile.primaryResidenceStatus === "own-mortgage") {
    reserveTargetMonths = 8;
  }

  const reserveTargetAmount = monthlyNeed > 0 ? reserveTargetMonths * monthlyNeed : liquidAssets * 0.3;
  const reserveGap = Math.max(reserveTargetAmount - liquidAssets, 0);

  let buckets;
  let headline;
  let summary;
  let primaryAction;
  let secondaryAction;
  let growthSleeve;
  let watchout;
  let heroMove;
  let heroRationale;
  let reasons = [];

  if (liquidAssets <= 0) {
    buckets = allocatePercentages([{ label: "Emergency reserve", percent: 100, note: "No liquid capital has been mapped yet." }]);
    headline = "Map liquid capital before TELAJ commits you to an investment move";
    summary = "Without a clear liquid-cash figure, TELAJ should default to caution and build the reserve picture first.";
    primaryAction = "Confirm liquid cash and monthly financial need";
    secondaryAction = "Only invest after the reserve target is visible";
    growthSleeve = "No growth sleeve yet";
    watchout = "Investing from an unmapped balance sheet";
    heroMove = "Map the cash position before taking the next step";
    heroRationale = "TELAJ needs the liquid position first because every later allocation depends on it.";
    reasons = [
      "The balance sheet is still incomplete.",
      "Reserve math is impossible without liquid cash and monthly financial need.",
      "TELAJ should not manufacture certainty from missing data.",
    ];
  } else if (state.financialPosition.creditCardDebt > 0) {
    buckets = allocatePercentages([
      { label: "Debt payoff", percent: 45, note: "Expensive revolving debt usually deserves first claim on free capital." },
      { label: "Emergency reserve", percent: 35, note: "Keep your finances from falling back into the debt loop." },
      { label: "Treasury bonds", percent: 20, note: "Park the defensive sleeve where it stays stable and liquid." },
    ]);
    headline = "Use liquid capital to repair the balance sheet before investing aggressively";
    summary = `${formatEuro(liquidAssets)} is meaningful, but TELAJ sees expensive consumer debt on the balance sheet. The first move is balance-sheet repair, not chasing returns.`;
    primaryAction = "Pay down credit card debt first";
    secondaryAction = "Hold the remaining defense in cash and short Treasuries";
    growthSleeve = "Delay ETF growth until expensive debt is cleared";
    watchout = "Stretching into risk while revolving debt is still active";
    heroMove = "Reduce expensive debt before adding optional risk";
    heroRationale = "Paying down costly debt is a cleaner return than buying more market exposure while interest is compounding against you.";
    reasons = [
      "Revolving debt weakens every future allocation decision.",
      "A reserve buffer prevents re-borrowing after payoff.",
      "Treasury exposure keeps part of the capital liquid and defensive.",
    ];
  } else if (reserveMonths < reserveTargetMonths) {
    buckets = allocatePercentages([
      { label: "Emergency reserve", percent: 45, note: "Bring your finances closer to the reserve target first." },
      { label: "Treasury bonds", percent: 30, note: "Keep a defensive yield sleeve without sacrificing liquidity." },
      { label: "Broad ETFs", percent: 15, note: "Allow some growth, but only in a measured way." },
      { label: "Gold", percent: 10, note: "Add ballast instead of extra fragility." },
    ]);
    headline = "Strengthen the reserve base, then let a small portion work";
    summary = `With ${formatEuro(liquidAssets)} liquid and about ${reserveMonths.toFixed(1)} months of runway, TELAJ would still prioritize resilience before a bigger risk move.`;
    primaryAction = "Close the reserve gap first";
    secondaryAction = "Keep the defensive sleeve in short Treasuries";
    growthSleeve = "Only a small ETF sleeve until the reserve target is funded";
    watchout = "Acting fully invested while the reserve target is still short";
    heroMove = "Build the reserve before you stretch for returns";
    heroRationale = "Your finances are not under-protected, but they still need more runway before TELAJ leans into bigger exposure.";
    reasons = [
      `Reserve target is about ${formatEuro(reserveTargetAmount)} and the gap is still ${formatEuro(reserveGap)}.`,
      "Short Treasuries keep capital productive without locking the balance sheet up.",
      "A small ETF sleeve preserves momentum without compromising safety.",
    ];
  } else {
    buckets = [
      { label: "Emergency reserve", percent: 30, note: "Keep a real shock absorber in place." },
      { label: "Treasury bonds", percent: 25, note: "Fund defense and optionality with short-duration quality." },
      { label: "Broad ETFs", percent: 30, note: "Compounding should happen through a diversified core." },
      { label: "Gold", percent: 15, note: "Gold stays as a defensive hedge, not the entire plan." },
    ];

    if (goalProfile.primaryGoal === "growth" && behaviorProfile.disciplineScore >= 70) {
      buckets = [
        { label: "Broad ETFs", percent: 40, note: "Disciplined growth deserves a larger diversified core." },
        { label: "Treasury bonds", percent: 20, note: "Defense stays meaningful, but not dominant." },
        { label: "Gold", percent: 15, note: "Gold remains ballast rather than the main engine." },
        { label: "Emergency reserve", percent: 25, note: "Reserves remain intact even in growth mode." },
      ];
    } else if (goalProfile.primaryGoal === "safety" || householdProfile.propertyExposure || mortgageDebt > liquidAssets * 0.8 || unsecuredDebt > liquidAssets * 0.2) {
      buckets = [
        { label: "Emergency reserve", percent: 35, note: "Higher reserve because your finances carry more fixed obligations." },
        { label: "Treasury bonds", percent: 30, note: "Defensive income before aggressive reach." },
        { label: "Gold", percent: 15, note: "Gold stays as a hedge against macro stress." },
        { label: "Broad ETFs", percent: 20, note: "Growth is still present, just subordinate to stability." },
      ];
    }

    buckets = allocatePercentages(buckets);
    headline = "Use the liquid balance deliberately instead of letting it sit idle";
    summary = `With ${formatEuro(liquidAssets)} liquid, low expensive debt, and reserve coverage already in place, TELAJ would now split fresh capital between defense, compounding, and liquidity discipline.`;
    primaryAction = "Allocate the liquid balance in planned sleeves";
    secondaryAction = "Keep a standing emergency reserve instead of going fully invested";
    growthSleeve = "Broad ETFs as the growth core, with gold and Treasuries as defense";
    watchout = "Going all-in because the cash balance feels too large";
    heroMove = "Put the liquid capital to work in layers";
    heroRationale = "TELAJ sees enough reserve strength to let part of the cash compound, but it still wants defense and optionality in the mix.";
    reasons = [
      "A diversified ETF sleeve is the cleanest growth engine for long-term capital.",
      "Gold and Treasuries reduce the risk of regretting the move under stress.",
      "Keeping a dedicated reserve prevents the portfolio from becoming the emergency fund.",
    ];
  }

  const plan = buckets.map((bucket) => ({
    ...bucket,
    amount: liquidAssets * (bucket.percent / 100),
  }));

  const plainEnglish = liquidAssets
    ? `If ${formatEuro(liquidAssets)} is the liquid cash available today, TELAJ would currently split it as ${plan
        .map((bucket) => `${bucket.percent}% to ${bucket.label.toLowerCase()}`)
        .join(", ")}.`
    : "TELAJ needs the liquid position mapped before it can produce a real allocation call.";

  return {
    reserveMonths,
    reserveTargetMonths,
    reserveTargetAmount,
    reserveGap,
    headline,
    summary,
    primaryAction,
    secondaryAction,
    growthSleeve,
    watchout,
    heroMove,
    heroRationale,
    reasons,
    plan,
    plainEnglish,
    debtRatio: position.debtRatio,
  };
}

function getCurrentHouseholdMix() {
  const assets = [
    { label: "Liquid cash", value: Number(state.liquidityDetails.liquidAssets || 0), note: "Available reserve and optionality." },
    { label: "Investments", value: Number(state.financialPosition.investments || 0), note: "Brokerage or non-retirement market assets." },
    { label: "Retirement", value: Number(state.financialPosition.retirement || 0), note: "Long-duration retirement capital." },
    { label: "Real Estate", value: Number(state.financialPosition.realEstate || 0), note: "Property equity or estimated value bucket." },
    { label: "Business", value: Number(state.financialPosition.business || 0), note: "Operating or private business value." },
  ].filter((item) => item.value > 0);

  const total = assets.reduce((sum, item) => sum + item.value, 0);
  if (!total) {
    return [];
  }

  return assets.map((item) => ({
    ...item,
    percent: Math.round((item.value / total) * 100),
  }));
}

function polarPoint(cx, cy, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function pieSlice(cx, cy, radius, startAngle, endAngle, fill) {
  const start = polarPoint(cx, cy, radius, endAngle);
  const end = polarPoint(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `<path d="M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z" fill="${fill}"></path>`;
}

function financialPieChart(assets) {
  const total = assets.reduce((sum, item) => sum + item.value, 0);
  if (!total) {
    return `<div class="empty-chart">Add asset amounts to see the household map.</div>`;
  }

  let angle = 0;
  const slices = assets
    .map((item) => {
      const nextAngle = angle + (item.value / total) * 360;
      const path = pieSlice(90, 90, 74, angle, nextAngle, item.color);
      angle = nextAngle;
      return path;
    })
    .join("");

  return `
    <svg class="financial-pie" viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="90" cy="90" r="78" fill="#111214" stroke="#2c2e34" stroke-width="2"></circle>
      ${slices}
      <circle cx="90" cy="90" r="38" fill="#0a0a0b" stroke="#2c2e34" stroke-width="2"></circle>
      <text x="90" y="82" text-anchor="middle" class="pie-value">€${Math.round(total / 1000)}k</text>
      <text x="90" y="100" text-anchor="middle" class="pie-label">assets</text>
    </svg>
  `;
}

function calculatePropertyAppraisal() {
  const size = Number(state.propertyAppraisal.size || 0);
  const unit = state.propertyAppraisal.unit || "sqm";
  const address = state.propertyAppraisal.address || "";
  const normalizedSqm = unit === "sqft" ? size / 10.7639 : size;
  const base = estimatedPricePerSqm(address);
  const estimatedValue = normalizedSqm * base.price;
  const range = estimatedValue * 0.12;
  state.propertyAppraisal = {
    ...state.propertyAppraisal,
    estimatedValue,
    valueLow: Math.max(estimatedValue - range, 0),
    valueHigh: estimatedValue + range,
    pricePerSqm: base.price,
    note: base.note,
  };
  persistWealthInputs();
}

function renderMorningHero() {
  const signal = state.morningSignal;
  const riskClass = signal.risk.toLowerCase();
  const hero = document.getElementById("morning-hero");
  hero.innerHTML = `
    <div class="morning-layout">
      <div>
        <div class="signal-topline">
          <div class="signal-live"><span class="live-dot"></span> Daily boss fight</div>
          <div class="risk-chip ${riskClass}">Risk ${signal.risk}</div>
        </div>
        <div class="eyebrow">Morning signal</div>
        <h2 class="signal-title">${signal.move}</h2>
        <p class="signal-rationale">${signal.rationale}</p>
      </div>
      <div class="ring-row">
        <div class="confidence-ring" style="--ring-fill: ${signal.confidence}%">
          <div class="ring-center">
            <div class="ring-value">${signal.confidence}%</div>
            <div class="ring-label">${signal.confidenceLabel}</div>
          </div>
        </div>
        <div class="body-copy">
          <div class="micro-label">Why now</div>
          <div class="panel-copy">${signal.rationaleShort}</div>
          <div class="micro-label" style="margin-top: 14px;">Who this protects</div>
          <div class="panel-copy">${signal.whoFor}</div>
        </div>
      </div>
      <div class="action-row">
        <button class="action-button primary" id="signal-execute">Execute move</button>
        <button class="action-button" id="signal-simulate">Simulate first</button>
        <button class="ghost-button" id="signal-snooze">Ignore for today</button>
      </div>
      <div class="hero-footer">
        <div class="task-pill">Today: discipline beats urgency</div>
        <div class="task-pill">Data source: ${state.dataSource}</div>
      </div>
    </div>
  `;

  document.getElementById("signal-execute").addEventListener("click", () => {
    state.tasks[0].done = true;
    renderTasks();
    renderProgress();
  });
  document.getElementById("signal-simulate").addEventListener("click", () => setView("signals"));
  document.getElementById("signal-snooze").addEventListener("click", () => {
    const note = hero.querySelector(".hero-footer");
    note.innerHTML = `<div class="task-pill">Signal snoozed</div><div class="task-pill">TELAJ will keep the discipline streak intact if you review later.</div>`;
  });
}

function renderSystemHealth() {
  const panel = document.getElementById("system-health");
  const stats = Object.entries(state.systemHealth)
    .map(
      ([key, value]) => `
        <div class="stat-box">
          <div class="stat-label">${key}</div>
          <div class="stat-value ${value >= 75 ? "accent-text" : ""}">${value}/100</div>
        </div>
      `
    )
    .join("");
  panel.innerHTML = `
    <div class="eyebrow">System health</div>
    <h3>Financial system health</h3>
    <div class="stats-grid">${stats}</div>
  `;
}

function renderProfileMatrix() {
  const panel = document.getElementById("profile-matrix");
  if (!panel) {
    return;
  }
  const profiles = state.onboarding.profiles;
  if (!profiles?.householdProfile || !profiles?.behaviorProfile || !profiles?.goalProfile) {
    panel.innerHTML = `
      <div class="eyebrow">Life matrix</div>
      <h3>Profile not built yet</h3>
      <p class="body-copy">Finish onboarding to let TELAJ describe your financial profile, the behavior pattern, and the real goal structure.</p>
    `;
    return;
  }
  panel.innerHTML = `
    <div class="eyebrow">Life matrix</div>
    <h3>TELAJ profile engine</h3>
    <div class="profile-grid">
      <div class="profile-chip">
        <div class="micro-label">HouseholdProfile</div>
        <div class="profile-chip-title">${profiles.householdProfile.archetype}</div>
        <div class="panel-copy">Worth ${profiles.householdProfile.netWorthBand} | Liquidity ${profiles.householdProfile.liquidityProfile} | Core ${profiles.householdProfile.assetLocation}</div>
        <div class="panel-copy">Primary home ${profiles.householdProfile.primaryResidenceStatus} | Equity ${profiles.householdProfile.primaryHomeEquity}</div>
        <div class="panel-copy">Investment property ${profiles.householdProfile.propertyCount} | Type ${profiles.householdProfile.propertyType}</div>
      </div>
      <div class="profile-chip">
        <div class="micro-label">BehaviorProfile</div>
        <div class="profile-chip-title">${profiles.behaviorProfile.riskBehavior}</div>
        <div class="panel-copy">Spending ${profiles.behaviorProfile.spendingStyle} | Weakness ${profiles.behaviorProfile.weakness} | Discipline ${profiles.behaviorProfile.disciplineScore}/100</div>
      </div>
      <div class="profile-chip">
        <div class="micro-label">GoalProfile</div>
        <div class="profile-chip-title">${profiles.goalProfile.goalArchetype}</div>
        <div class="panel-copy">Goal ${profiles.goalProfile.primaryGoal} | Wealth for ${profiles.goalProfile.wealthFor} | Posture ${profiles.goalProfile.recommendedPosture}</div>
      </div>
      ${
        state.onboarding.intent?.analysis
          ? `
            <div class="profile-chip">
              <div class="micro-label">IntentLayer</div>
              <div class="profile-chip-title">${state.onboarding.intent.analysis.optimizeFor}</div>
              <div class="panel-copy">Watchout ${state.onboarding.intent.analysis.watchout} | Tags ${(state.onboarding.intent.analysis.priorityTags || []).join(", ") || "General planning"}</div>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderRailAccount() {
  if (!railAccount) {
    return;
  }
  if (!state.auth.authenticated) {
    railAccount.innerHTML = `
      <div class="eyebrow">Access</div>
      <h3>Signed out</h3>
      <div class="panel-copy">Enter TELAJ with a beta code, guest access, or an account.</div>
    `;
    return;
  }

  const sessionLabel = state.auth.guest ? "Guest session" : "Account session";
  const emailLabel = state.auth.email || (state.auth.guest ? "Anonymous beta guest" : "Email not available");
  railAccount.innerHTML = `
    <div class="eyebrow">Access</div>
    <div class="account-status-row">
      <h3>${sessionLabel}</h3>
      <div class="task-pill">${state.subscription.plan}</div>
    </div>
    <div class="account-email">${emailLabel}</div>
    <div class="panel-copy">${
      state.auth.guest
        ? "This is a beta guest session. Upgrade to an account later if you want durable cross-device access."
        : "You are signed in. TELAJ can keep your progress, preferences, and profile tied to this session."
    }</div>
    <button class="action-button" id="rail-logout">Log out</button>
  `;
  document.getElementById("rail-logout")?.addEventListener("click", async () => {
    await handleLogout();
  });
}

function renderRailFooter() {
  if (!railFooter) {
    return;
  }
  const deliveryStatus = state.subscriberPreferences.deliveryStatus || "Preferences only";
  const accessStatus = state.auth.authenticated
    ? state.auth.guest
      ? "Beta guest"
      : "Signed in"
    : "Locked";
  const regionLabel = MARKET_REGION_CONFIG[state.marketRegion]?.label || state.marketRegion;
  railFooter.innerHTML = `
    <div class="pill">LIVE STATUS</div>
    <div class="meta-line">Access <span>${accessStatus}</span></div>
    <div class="meta-line">Market region <span>${regionLabel}</span></div>
    <div class="meta-line">Financial sync <span>${state.syncStatus.financialPosition}</span></div>
    <div class="meta-line">Signal delivery <span>${deliveryStatus}</span></div>
  `;
}

function renderXpLevel() {
  const panel = document.getElementById("xp-level");
  const progress = Math.min((state.profile.xp / state.profile.nextLevelXp) * 100, 100);
  if (panel) {
    panel.innerHTML = `
      <div class="eyebrow">Progression</div>
      <h3>${state.profile.level}</h3>
      <div class="stat-value accent-text">${state.profile.xp} XP</div>
      <p class="body-copy">${state.profile.rank}</p>
      <div class="bar-track"><div class="bar-fill" style="width:${progress}%"></div></div>
      <p class="list-note">${state.profile.nextLevelXp - state.profile.xp} XP to Wealth Architect</p>
    `;
  }
  document.getElementById("rail-level").textContent = state.profile.level;
  document.getElementById("rail-streak").textContent = `${state.profile.streak} days`;
}

function renderSubscriberPreferences() {
  const panel = document.getElementById("subscriber-preferences");
  if (!panel) {
    return;
  }

  syncSubscriberEmailFromAuth();
  const prefs = state.subscriberPreferences;
  const inviteUrl = window.TELAJ_CONFIG?.discordInviteUrl || "";

  panel.innerHTML = `
    <div class="eyebrow">Delivery preferences</div>
    <h3>Collect subscribers and route the signal</h3>
    <p class="body-copy">Use this to decide how TELAJ should reach you later. Preferences are stored now; real email and Discord delivery can plug into this without changing the user flow.</p>
    <div class="subscriber-grid">
      <label class="input-field subscriber-span-2">
        <span class="micro-label">Contact email</span>
        <input id="subscriber-email" type="email" value="${prefs.contactEmail || ""}" placeholder="you@example.com" />
      </label>
      <label class="toggle-card">
        <input id="subscriber-signal-email" type="checkbox" ${prefs.signalEmailOptIn ? "checked" : ""} />
        <div>
          <div class="micro-label">Morning signal email</div>
          <div class="panel-copy">Receive the daily TELAJ call by email.</div>
        </div>
      </label>
      <label class="toggle-card">
        <input id="subscriber-weekly-digest" type="checkbox" ${prefs.weeklyDigestOptIn ? "checked" : ""} />
        <div>
          <div class="micro-label">Weekly digest</div>
          <div class="panel-copy">Get a slower summary of positioning and discipline.</div>
        </div>
      </label>
      <label class="toggle-card">
        <input id="subscriber-marketing" type="checkbox" ${prefs.marketingOptIn ? "checked" : ""} />
        <div>
          <div class="micro-label">Product updates</div>
          <div class="panel-copy">Allow launch notes, improvements, and educational updates.</div>
        </div>
      </label>
      <label class="toggle-card">
        <input id="subscriber-discord-optin" type="checkbox" ${prefs.discordOptIn ? "checked" : ""} />
        <div>
          <div class="micro-label">Discord alerts</div>
          <div class="panel-copy">Use Discord as a second signal channel when connected.</div>
        </div>
      </label>
      <label class="input-field subscriber-span-2">
        <span class="micro-label">Discord handle or note</span>
        <input id="subscriber-discord-handle" type="text" value="${prefs.discordHandle || ""}" placeholder="@yourname or 'joining later'" />
      </label>
    </div>
    <div class="insight-grid">
      <div class="insight-card">
        <div class="micro-label">Subscriber status</div>
        <div class="panel-copy">${prefs.deliveryStatus}</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">What TELAJ has now</div>
        <div class="panel-copy">${prefs.contactEmail ? `Email on file: ${prefs.contactEmail}` : "No contact email saved yet."}</div>
      </div>
    </div>
    <div class="property-action-row">
      <button class="action-button primary" id="subscriber-save">Save preferences</button>
      <button class="action-button" id="subscriber-discord-join">${inviteUrl ? "Join Discord" : "Discord invite pending"}</button>
    </div>
    <div class="legal-note">
      <div class="micro-label">Consent</div>
      <div class="panel-copy">Keep account access, signal emails, weekly digests, and product updates as separate opt-ins. This panel is the right place to store those permissions before wiring email delivery.</div>
    </div>
  `;

  document.getElementById("subscriber-save")?.addEventListener("click", () => {
    state.subscriberPreferences.contactEmail = document.getElementById("subscriber-email").value.trim();
    state.subscriberPreferences.signalEmailOptIn = Boolean(document.getElementById("subscriber-signal-email").checked);
    state.subscriberPreferences.weeklyDigestOptIn = Boolean(document.getElementById("subscriber-weekly-digest").checked);
    state.subscriberPreferences.marketingOptIn = Boolean(document.getElementById("subscriber-marketing").checked);
    state.subscriberPreferences.discordOptIn = Boolean(document.getElementById("subscriber-discord-optin").checked);
    state.subscriberPreferences.discordHandle = document.getElementById("subscriber-discord-handle").value.trim();

    const channels = [];
    if (state.subscriberPreferences.signalEmailOptIn) channels.push("daily signal email");
    if (state.subscriberPreferences.weeklyDigestOptIn) channels.push("weekly digest");
    if (state.subscriberPreferences.marketingOptIn) channels.push("product updates");
    if (state.subscriberPreferences.discordOptIn) channels.push("Discord alerts");

    state.subscriberPreferences.deliveryStatus = channels.length ? `Ready for ${channels.join(", ")}` : "Preferences only";
    persistSubscriberPreferences();
    renderSubscriberPreferences();
  });

  document.getElementById("subscriber-discord-join")?.addEventListener("click", () => {
    if (inviteUrl) {
      window.open(inviteUrl, "_blank", "noopener,noreferrer");
      return;
    }
    state.subscriberPreferences.deliveryStatus = "Discord invite URL not configured yet";
    persistSubscriberPreferences();
    renderSubscriberPreferences();
  });
}

function renderAllocationSnapshot() {
  const panel = document.getElementById("allocation-snapshot");
  const advice = getFinancialAllocationAdvice();
  panel.innerHTML = `
    <div class="eyebrow">Allocation</div>
    <h3>Position-based split</h3>
    <p class="body-copy">${advice.summary}</p>
    <div class="bar-stack">
      ${advice.plan
        .map(
          (item) => `
            <div class="allocation-row">
              <div class="row-label">${item.label}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${item.percent}%"></div></div>
              <div class="allocation-number">${item.percent}%</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderFinancialPosition() {
  const panel = document.getElementById("financial-position");
  if (!panel) {
    return;
  }

  const position = getFinancialPosition();
  const advice = getFinancialAllocationAdvice();
  const debtPressure =
    position.totalDebt === 0 ? "Clean" : position.debtRatio > 0.6 ? "Heavy" : position.debtRatio > 0.3 ? "Moderate" : "Controlled";

  panel.innerHTML = `
    <div class="eyebrow">Financial position</div>
    <h3>Put the financial position at the center of every move</h3>
    <div class="task-pill">${state.syncStatus.financialPosition}</div>
    <div class="panel-copy">${state.syncStatus.financialPositionDetail}</div>
    <div class="micro-label">Start here</div>
    <div class="input-stack financial-input-stack">
      <label class="input-field">
        <span class="micro-label">Liquid cash</span>
        <input id="fp-liquid" type="number" min="0" step="1000" value="${state.liquidityDetails.liquidAssets}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Monthly financial need</span>
        <input id="fp-monthly-need" type="number" min="0" step="100" value="${state.liquidityDetails.monthlyNeed}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Investments</span>
        <input id="fp-investments" type="number" min="0" step="1000" value="${state.financialPosition.investments}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Retirement</span>
        <input id="fp-retirement" type="number" min="0" step="1000" value="${state.financialPosition.retirement}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Real estate</span>
        <input id="fp-real-estate" type="number" min="0" step="1000" value="${state.financialPosition.realEstate}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Business</span>
        <input id="fp-business" type="number" min="0" step="1000" value="${state.financialPosition.business}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Credit card debt</span>
        <input id="fp-credit-card" type="number" min="0" step="100" value="${state.financialPosition.creditCardDebt}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Loans</span>
        <input id="fp-loans" type="number" min="0" step="100" value="${state.financialPosition.loans}" />
      </label>
      <label class="input-field input-span-2">
        <span class="micro-label">Mortgage debt</span>
        <input id="fp-mortgage" type="number" min="0" step="1000" value="${state.financialPosition.mortgageDebt}" />
      </label>
      <div class="property-action-row input-span-2">
        <button class="action-button primary" id="save-financial-position">Update position</button>
        <button class="action-button" id="financial-go-allocation">Use this in allocation</button>
        ${state.auth.authenticated ? `<button class="ghost-button" id="financial-refresh">Refresh from cloud</button>` : ""}
      </div>
    </div>
    <div class="section-spacer"></div>
    <div class="micro-label">Then see the map</div>
    <div class="financial-layout">
      <div class="financial-chart-wrap">
        ${financialPieChart(position.assets)}
      </div>
      <div class="financial-summary">
        <div class="stat-box">
          <div class="stat-label">Total assets</div>
          <div class="stat-value">${formatEuro(position.totalAssets)}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Total debt</div>
          <div class="stat-value">${formatEuro(position.totalDebt)}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Net worth</div>
          <div class="stat-value accent-text">${formatEuro(position.netWorth)}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Debt pressure</div>
          <div class="stat-value">${debtPressure}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Liquid runway</div>
          <div class="stat-value">${advice.reserveMonths ? `${advice.reserveMonths.toFixed(1)} months` : "Map expenses"}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Reserve target</div>
          <div class="stat-value">${state.liquidityDetails.monthlyNeed > 0 ? `${advice.reserveTargetMonths} months` : "Pending"}</div>
        </div>
      </div>
      <div class="financial-callout">
        <div class="financial-callout-card">
          <div class="micro-label">TELAJ capital call</div>
          <h4 class="financial-call-title">${advice.headline}</h4>
          <div class="financial-call-copy">${advice.plainEnglish}</div>
          <div class="task-pill">Primary: ${advice.primaryAction}</div>
        </div>
        <div class="financial-plan-grid">
          ${advice.plan
            .map(
              (bucket) => `
                <div class="financial-plan-card">
                  <div class="micro-label">${bucket.label}</div>
                  <div class="financial-plan-percent">${bucket.percent}%</div>
                  <div class="financial-plan-amount">${formatEuro(bucket.amount)}</div>
                  <div class="panel-copy">${bucket.note}</div>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="financial-reason-list">
          ${advice.reasons.map((item) => `<div class="financial-reason">${item}</div>`).join("")}
        </div>
        <div class="legal-note">
          <div class="micro-label">Disclaimer</div>
          <div class="panel-copy">This capital call is educational model guidance, not investment, legal, tax, or financial advice. Verify suitability for your own situation before acting.</div>
        </div>
      </div>
    </div>
    <p class="body-copy">${position.opinion}</p>
    <div class="financial-legend">
      ${position.assets
        .map(
          (item) => `
            <div class="legend-item">
              <span class="legend-swatch" style="background:${item.color}"></span>
              <span>${item.label}</span>
              <span class="legend-value">${formatEuro(item.value)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  document.getElementById("save-financial-position").addEventListener("click", async () => {
    state.liquidityDetails.liquidAssets = Number(document.getElementById("fp-liquid").value || 0);
    state.liquidityDetails.monthlyNeed = Number(document.getElementById("fp-monthly-need").value || 0);
    state.financialPosition.investments = Number(document.getElementById("fp-investments").value || 0);
    state.financialPosition.retirement = Number(document.getElementById("fp-retirement").value || 0);
    state.financialPosition.realEstate = Number(document.getElementById("fp-real-estate").value || 0);
    state.financialPosition.business = Number(document.getElementById("fp-business").value || 0);
    state.financialPosition.creditCardDebt = Number(document.getElementById("fp-credit-card").value || 0);
    state.financialPosition.loans = Number(document.getElementById("fp-loans").value || 0);
    state.financialPosition.mortgageDebt = Number(document.getElementById("fp-mortgage").value || 0);
    persistWealthInputs();
    await saveFinancialPositionToApi();
    renderAll();
  });
  document.getElementById("financial-go-allocation").addEventListener("click", () => setView("allocation"));
  document.getElementById("financial-refresh")?.addEventListener("click", async () => {
    await loadFinancialPositionFromApi();
    renderAll();
  });
}

function renderCashStatus() {
  const panel = document.getElementById("cash-status");
  const reserveMonths = calculateLiquidityMonths();
  const reserveTargetGap = Math.max(6 - reserveMonths, 0);
  const reserveStatus =
    reserveMonths >= 6 ? "Reserve target met" : `${reserveTargetGap.toFixed(1)} more months of reserves needed`;
  panel.innerHTML = `
    <div class="eyebrow">Reserve status</div>
    <h3>Cash buffer</h3>
    <div class="stat-value">${reserveMonths.toFixed(1)} months</div>
    <p class="body-copy">${reserveStatus}. TELAJ wants to know your actual liquid assets, not just a generic reserve label.</p>
    <div class="insight-grid">
      <div class="insight-card">
        <div class="micro-label">Recommendation</div>
        <div class="panel-copy">${state.recommendation.primaryAction}</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">Stress score</div>
        <div class="panel-copy">${reserveMonths >= 6 ? "Resilient" : reserveMonths >= 3 ? "Moderate" : "Thin"}</div>
      </div>
    </div>
    <div class="input-stack">
      <label class="input-field">
        <span class="micro-label">Liquid assets</span>
        <input id="liquid-assets-input" type="number" min="0" step="500" value="${state.liquidityDetails.liquidAssets}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Monthly financial need</span>
        <input id="monthly-need-input" type="number" min="0" step="100" value="${state.liquidityDetails.monthlyNeed}" />
      </label>
      <div class="action-row">
        <button class="action-button primary" id="save-liquidity">Update liquidity</button>
        <button class="ghost-button" id="go-allocation">Use this in allocation</button>
      </div>
    </div>
  `;
  document.getElementById("save-liquidity").addEventListener("click", async () => {
    state.liquidityDetails.liquidAssets = Number(document.getElementById("liquid-assets-input").value || 0);
    state.liquidityDetails.monthlyNeed = Number(document.getElementById("monthly-need-input").value || 0);
    persistWealthInputs();
    await saveFinancialPositionToApi();
    renderCashStatus();
    renderFinancialPosition();
  });
  document.getElementById("go-allocation").addEventListener("click", () => setView("allocation"));
}

function renderTasks() {
  const panel = document.getElementById("daily-tasks");
  panel.innerHTML = `
    <div class="eyebrow">Daily tasks</div>
    <h3>Today's priorities</h3>
    <div class="quest-list">
      ${state.tasks
        .map(
          (task) => `
            <div class="task-item">
              <button class="task-toggle ${task.done ? "is-done" : ""}" data-task="${task.id}" aria-label="Toggle ${task.title}"></button>
              <div>
                <div>${task.title}</div>
                <div class="task-copy">${task.done ? "Marked complete" : "Still open"}</div>
              </div>
              <div class="task-meta">${task.done ? "Complete" : "Open"}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  panel.querySelectorAll(".task-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find((item) => item.id === button.dataset.task);
      task.done = !task.done;
      renderTasks();
      renderProgress();
    });
  });
}

function renderWatchlist() {
  const panel = document.getElementById("watchlist");
  const intel = state.investmentIntel;
  panel.innerHTML = `
    <div class="eyebrow">Market tape</div>
    <div class="account-status-row">
      <h3>Live movers and top asset calls</h3>
      <label class="input-field region-selector">
        <span class="micro-label">Region</span>
        <select id="market-region-select">
          <option value="US" ${state.marketRegion === "US" ? "selected" : ""}>US</option>
          <option value="EU" ${state.marketRegion === "EU" ? "selected" : ""}>Europe</option>
        </select>
      </label>
    </div>
    <div class="panel-copy">${MARKET_REGION_CONFIG[state.marketRegion].label}. TELAJ changes the tape and signal set to match the selected market context.</div>
    <div class="ticker-tape">
      ${state.marketTape
        .map(
          (item) => `
            <div class="tape-item">
              <div class="row-label">${item.ticker}</div>
              <div class="tape-price">$${Number(item.price).toFixed(2)}</div>
              <div class="watch-badge ${item.trend}">${item.changePct > 0 ? "+" : ""}${Number(item.changePct).toFixed(1)}%</div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="section-spacer"></div>
    <div class="eyebrow">Top asset signals</div>
    <div class="highlight-list">
      ${intel.assetSignals
        .map(
          (item) => `
            <div class="highlight-item">
              <div class="watch-top">
                <div>
                  <div class="row-label">${item.ticker}</div>
                  <div class="highlight-title">${item.label}</div>
                </div>
                <div class="signal-badge ${item.signal.includes("avoid") ? "warn" : item.signal.includes("hold") ? "" : "good"}">${item.signal}</div>
              </div>
              <div class="panel-copy">${item.why}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  document.getElementById("market-region-select")?.addEventListener("change", (event) => {
    applyMarketRegion(event.target.value);
    renderWatchlist();
    renderSignalsView();
  });
}

function renderHistoryPreview() {
  const panel = document.getElementById("signal-history-preview");
  if (!panel) {
    return;
  }
  const first = state.history[0];
  panel.innerHTML = `
    <div class="eyebrow">Signal history</div>
    <h3>${first.title}</h3>
    <div class="history-meta">${first.date} | ${first.action} | ${first.outcome}</div>
    ${sparkline(first.spark)}
    <p class="body-copy">${first.impact}</p>
  `;
}

function renderAchievements() {
  const panel = document.getElementById("achievements");
  if (!panel) {
    return;
  }
  panel.innerHTML = `
    <div class="eyebrow">Achievements</div>
    <h3>Badges earned by discipline</h3>
    <div class="achievement-grid">
      ${state.badges
        .map(
          (badge) => `
            <div class="badge-card ${badge.earned ? "is-earned" : ""}">
              <div class="badge-label">${badge.earned ? "Earned" : "Locked"}</div>
              <div class="badge-name">${badge.name}</div>
              <div class="body-copy">${badge.note}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderLeaderboard() {
  const panel = document.getElementById("leaderboard");
  if (!panel) {
    return;
  }
  panel.innerHTML = `
    <div class="eyebrow">Leaderboard</div>
    <h3>Rank by discipline, not speculation</h3>
    <div class="leader-list">
      ${state.leaderboard
        .map(
          (item) => `
            <div class="leader-item">
              <div class="leader-rank">${item.rank}</div>
              <div>${item.name}</div>
              <div class="leader-score">${item.score}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAllocationView() {
  const householdMix = getCurrentHouseholdMix();
  document.getElementById("allocation-main").innerHTML = `
    <div class="eyebrow">Capital call</div>
    <h3>${state.recommendation.headline}</h3>
    <p class="body-copy">${state.recommendation.summary}</p>
    <div class="allocation-hero-actions">
      <div class="task-pill">Primary: ${state.recommendation.primaryAction}</div>
      <div class="task-pill">Avoid: ${state.recommendation.avoid}</div>
    </div>
    <div class="insight-grid">
      <div class="insight-card"><div class="micro-label">Primary action</div><div class="panel-copy">${state.recommendation.primaryAction}</div></div>
      <div class="insight-card"><div class="micro-label">Secondary action</div><div class="panel-copy">${state.recommendation.secondaryAction}</div></div>
      <div class="insight-card"><div class="micro-label">Growth sleeve</div><div class="panel-copy">${state.recommendation.growthSleeve}</div></div>
      <div class="insight-card"><div class="micro-label">Avoid</div><div class="panel-copy">${state.recommendation.avoid}</div></div>
    </div>
    <div class="property-action-row">
      <button class="action-button primary" id="allocation-go-home">View morning call</button>
      <button class="action-button" id="allocation-go-signals">Review signal history</button>
      <button class="ghost-button" id="allocation-go-cash">Check reserve status</button>
    </div>
  `;
  document.getElementById("allocation-bars").innerHTML = `
    <div class="eyebrow">Current financial mix</div>
    <h3>How the entered assets are actually positioned</h3>
    ${
      householdMix.length
        ? `
          <div class="bar-stack">
            ${householdMix
              .map(
                (item) => `
                  <div class="allocation-block">
                    <div class="allocation-row">
                      <div class="row-label">${item.label}</div>
                      <div class="bar-track"><div class="bar-fill" style="width:${item.percent}%"></div></div>
                      <div class="allocation-number">${item.percent}%</div>
                    </div>
                    <div class="list-note">${item.note} ${formatEuro(item.value)}.</div>
                  </div>
                `
              )
              .join("")}
          </div>
        `
        : `<div class="subpanel"><div class="panel-copy">Current financial mix is not mapped yet. Enter liquid cash and asset values in the Financial Position panel first.</div></div>`
    }
  `;
  document.getElementById("allocation-rules").innerHTML = `
    <div class="eyebrow">TELAJ logic</div>
    <h3>Why this portfolio posture makes sense</h3>
    <ul class="clean-list">
      ${state.rules.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
  document.getElementById("allocation-watchouts").innerHTML = `
    <div class="eyebrow">Guardrails</div>
    <h3>What can quietly break the plan</h3>
    <ul class="clean-list">
      ${state.watchouts.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
  document.getElementById("allocation-go-home").addEventListener("click", () => setView("home"));
  document.getElementById("allocation-go-signals").addEventListener("click", () => setView("signals"));
  document.getElementById("allocation-go-cash").addEventListener("click", () => {
    setView("home");
    const target = document.getElementById("cash-status");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function renderSignalsView() {
  const intel = state.investmentIntel;
  const marketState = intel.marketState;
  document.getElementById("signal-stats").innerHTML = `
    <div class="eyebrow">Market state</div>
    <h3>${intel.portfolioAction.title}</h3>
    <div class="task-pill">${MARKET_REGION_CONFIG[state.marketRegion].label}</div>
    <p class="body-copy">${marketState.summary}</p>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-label">Regime</div><div class="stat-value accent-text">${marketState.regime}</div></div>
      <div class="stat-box"><div class="stat-label">From month low</div><div class="stat-value">${marketState.distanceFromMonthLowPct}%</div></div>
      <div class="stat-box"><div class="stat-label">From month high</div><div class="stat-value">${marketState.distanceFromMonthHighPct}%</div></div>
      <div class="stat-box"><div class="stat-label">Volatility</div><div class="stat-value">${marketState.volatility}</div></div>
    </div>
    <div class="allocation-hero-actions">
      <div class="task-pill">Primary: ${intel.portfolioAction.primary}</div>
      <div class="task-pill">Avoid: ${intel.portfolioAction.avoid}</div>
    </div>
  `;
  document.getElementById("signal-history-list").innerHTML = `
    <div class="eyebrow">Top signals</div>
    <h3>What TELAJ thinks you should look at now</h3>
    <div class="history-list">
      ${intel.assetSignals
        .map(
          (item) => `
            <div class="history-item">
              <div class="history-top">
                <div>
                  <div class="row-label">${item.ticker} · ${item.label}</div>
                  <div>${item.signal.toUpperCase()}</div>
                </div>
                <div class="signal-badge ${item.signal.includes("avoid") ? "warn" : item.signal.includes("hold") ? "" : "good"}">${item.confidence}%</div>
              </div>
              <div class="panel-copy">${item.why}</div>
              <div class="history-meta">Risk: ${item.risk} Safer option: ${item.safer} Horizon: ${item.horizon}.</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  document.getElementById("signal-outcomes").innerHTML = `
    <div class="eyebrow">Research read</div>
    <h3>Why TELAJ thinks this</h3>
    <ul class="clean-list">
      ${intel.newsDrivers.map((item) => `<li>${item}</li>`).join("")}
      <li>The right signal can still be “do nothing” when the setup is weak or the household is under-protected.</li>
    </ul>
    <div class="section-spacer"></div>
    <div class="eyebrow">Outcome summary</div>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-label">YTD vs benchmark</div><div class="stat-value accent-text">${state.stats.ytd}</div><div class="list-note">Benchmark ${state.stats.benchmark}</div></div>
      <div class="stat-box"><div class="stat-label">Signals taken</div><div class="stat-value">${state.stats.signalsTaken}</div></div>
      <div class="stat-box"><div class="stat-label">Win rate</div><div class="stat-value">${state.stats.winRate}</div></div>
      <div class="stat-box"><div class="stat-label">Drawdowns avoided</div><div class="stat-value">4</div></div>
    </div>
  `;
}

function renderProgress() {
  const completed = state.tasks.filter((task) => task.done).length;
  const openTasks = state.tasks.filter((task) => !task.done);
  const completedTasks = state.tasks.filter((task) => task.done);
  const nextTask = openTasks[0];
  const lastAction = state.history[0];
  const consistencyLabel =
    state.profile.streak >= 21 ? "Strong" : state.profile.streak >= 7 ? "Building" : "Fragile";

  document.getElementById("progress-summary").innerHTML = `
    <div class="eyebrow">Consistency</div>
    <h3>${state.profile.streak}-day discipline streak</h3>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-label">Completed today</div><div class="stat-value accent-text">${completed}/${state.tasks.length}</div></div>
      <div class="stat-box"><div class="stat-label">Consistency</div><div class="stat-value">${consistencyLabel}</div></div>
      <div class="stat-box"><div class="stat-label">Next focus</div><div class="stat-value">${nextTask ? "1 task" : "Clear"}</div></div>
    </div>
    <p class="body-copy">TELAJ is tracking whether you follow through on calm, useful actions, not whether you stay busy.</p>
  `;

  document.getElementById("quest-board").innerHTML = `
    <div class="eyebrow">Today</div>
    <h3>What deserves attention now</h3>
    <div class="quest-list">
      ${state.tasks
        .map(
          (task) => `
            <div class="task-item">
              <div class="task-toggle ${task.done ? "is-done" : ""}" aria-hidden="true"></div>
              <div>
                <div>${task.title}</div>
                <div class="task-copy">${task.done ? "Already handled" : "Still needs attention"}</div>
              </div>
              <div class="task-meta">${task.done ? "Done" : "Next"}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  document.getElementById("badge-case").innerHTML = `
    <div class="eyebrow">Recent actions</div>
    <h3>How discipline is showing up</h3>
    <div class="history-list">
      ${state.history
        .slice(0, 3)
        .map(
          (item) => `
            <div class="history-item">
              <div class="history-top">
                <div>
                  <div class="row-label">${item.date}</div>
                  <div>${item.title}</div>
                </div>
                <div class="signal-badge ${item.quality === "good" ? "good" : item.quality === "warn" ? "warn" : ""}">${item.action}</div>
              </div>
              <div class="history-meta">${item.outcome} · ${item.impact}</div>
            </div>
          `
        )
        .join("")}
      ${
        completedTasks.length
          ? `
            <div class="subpanel">
              <div class="micro-label">Completed priorities</div>
              <div class="panel-copy">${completedTasks.map((task) => task.title).join(" · ")}</div>
            </div>
          `
          : ""
      }
    </div>
  `;

  document.getElementById("level-roadmap").innerHTML = `
    <div class="eyebrow">Discipline notes</div>
    <h3>How TELAJ wants you to operate</h3>
    <ul class="clean-list">
      <li>Do the small protective action before reaching for the exciting one.</li>
      <li>${nextTask ? `The next useful move is: ${nextTask.title}.` : "You cleared the current task list. Hold the line instead of inventing new moves."}</li>
      <li>${lastAction ? `Most recent logged action: ${lastAction.title.toLowerCase()} on ${lastAction.date}.` : "No recent actions logged yet."}</li>
      <li>Consistency matters more than checking TELAJ ten times a day.</li>
    </ul>
  `;
}

function renderRealEstate() {
  const engine = window.TelajRealEstateEngine;
  const intel = state.realEstateIntel || { markets: [], newsSignals: [], deals: [], taxEducation: { items: [] }, hero: null };
  const rankedMarkets = engine.rankMarkets(intel.markets || []);
  const marketSignals = engine.summarizeNews(intel.newsSignals || []);
  const topMarket = rankedMarkets[0];
  const filteredDeals = engine.findDeals(intel.deals || [], state.realEstateFilters || {});
  const addressAnalysis = engine.analyzeAddress(state.addressAnalyzer || {});
  const ownedPropertyDecision = engine.adviseOwnedProperty(state.holdAdvisor || {});

  document.getElementById("property-signal").innerHTML = `
    <div class="eyebrow">Hero insight</div>
    <h3>${intel.hero?.headline || state.property.signal}</h3>
    <p class="body-copy">${intel.hero?.note || state.property.note}</p>
    <div class="insight-grid">
      <div class="insight-card"><div class="micro-label">Best market now</div><div class="panel-copy">${topMarket ? topMarket.market : "No market signal loaded"}</div></div>
      <div class="insight-card"><div class="micro-label">Strategy fit</div><div class="panel-copy">${topMarket ? topMarket.strategyFit : "Review carefully"}</div></div>
      <div class="insight-card"><div class="micro-label">Opportunity / risk</div><div class="panel-copy">${topMarket ? `${topMarket.opportunityScore} / ${topMarket.riskScore}` : "Pending"}</div></div>
      <div class="insight-card"><div class="micro-label">TELAJ view</div><div class="panel-copy">${topMarket ? `Look for ${topMarket.strategyFit} before chasing overheated narratives.` : "Stay selective and data-driven."}</div></div>
    </div>
    <div class="property-action-row">
      <button class="action-button primary" id="property-go-deals">Open deal finder</button>
      <button class="action-button" id="property-go-address">Analyze an address</button>
      <button class="ghost-button" id="property-go-allocation">Back to allocation</button>
    </div>
  `;

  document.getElementById("market-radar").innerHTML = `
    <div class="eyebrow">Market radar</div>
    <h3>Rank attractive markets and explain why</h3>
    <div class="property-list">
      ${rankedMarkets
        .map(
          (market) => `
            <div class="subpanel">
              <div class="history-top">
                <div><div class="row-label">${market.market}</div><div>${market.strategyFit}</div></div>
                <div class="signal-badge ${market.riskScore >= 60 ? "warn" : "good"}">Opp ${market.opportunityScore}</div>
              </div>
              <div class="stats-grid">
                <div class="stat-box"><div class="stat-label">Risk</div><div class="stat-value">${market.riskScore}</div></div>
                <div class="stat-box"><div class="stat-label">Demand</div><div class="stat-value">${market.demandMomentum}</div></div>
                <div class="stat-box"><div class="stat-label">Supply</div><div class="stat-value">${market.supplyPressure}</div></div>
                <div class="stat-box"><div class="stat-label">Exitability</div><div class="stat-value">${market.exitability}</div></div>
              </div>
              <div class="panel-copy">${market.summary}</div>
              <div class="tag-row">${market.catalysts.map((item) => `<span class="task-pill">${item}</span>`).join("")}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  document.getElementById("news-market-signals").innerHTML = `
    <div class="eyebrow">News-to-market signals</div>
    <h3>Read recent news through a housing-demand lens</h3>
    <div class="history-list">
      ${marketSignals
        .map(
          (item) => `
            <div class="history-item">
              <div class="history-top">
                <div><div class="row-label">${item.market}</div><div>${item.headline}</div></div>
                <div class="signal-badge ${item.stance === "caution" ? "warn" : "good"}">${item.category}</div>
              </div>
              <div class="panel-copy">${item.plainEnglish}</div>
              <div class="history-meta">${item.caution} Confidence: ${item.confidence}.</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  document.getElementById("deal-finder").innerHTML = `
    <div class="eyebrow">Deal finder</div>
    <h3>Surface candidate deals by market and strategy</h3>
    <div class="input-stack">
      <label class="input-field"><span class="micro-label">Budget</span><input id="deal-budget" type="number" min="0" step="1000" value="${state.realEstateFilters.budget}" /></label>
      <label class="input-field"><span class="micro-label">Market</span><select id="deal-market"><option value="">Any market</option>${[...new Set((intel.deals || []).map((item) => item.market))].map((market) => `<option value="${market}" ${state.realEstateFilters.market === market ? "selected" : ""}>${market}</option>`).join("")}</select></label>
      <label class="input-field"><span class="micro-label">Strategy</span><select id="deal-strategy"><option value="">Any strategy</option>${["buy and hold", "small multifamily", "value add", "BRRRR-style", "build-to-rent", "wait / avoid"].map((item) => `<option value="${item}" ${state.realEstateFilters.strategy === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      <label class="input-field"><span class="micro-label">Property type</span><select id="deal-property-type"><option value="">Any type</option>${[...new Set((intel.deals || []).map((item) => item.propertyType))].map((item) => `<option value="${item}" ${state.realEstateFilters.propertyType === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      <label class="input-field"><span class="micro-label">Minimum cap rate</span><input id="deal-cap-rate" type="number" min="0" step="0.1" value="${state.realEstateFilters.minimumCapRate}" /></label>
      <label class="input-field"><span class="micro-label">Minimum monthly cash flow</span><input id="deal-cash-flow" type="number" step="50" value="${state.realEstateFilters.minimumCashFlow}" /></label>
      <div class="property-action-row input-span-2"><button class="action-button primary" id="deal-filter-run">Refresh ideas</button></div>
    </div>
    <div class="property-list">
      ${filteredDeals.length
        ? filteredDeals
            .map(
              (deal) => `
                <div class="subpanel">
                  <div class="history-top">
                    <div><div class="row-label">${deal.market}</div><div>${deal.address}</div></div>
                    <div class="signal-badge ${deal.score >= 70 ? "good" : deal.score >= 55 ? "warn" : "bad"}">Score ${deal.score}</div>
                  </div>
                  <div class="stats-grid">
                    <div class="stat-box"><div class="stat-label">Price</div><div class="stat-value">${formatEuro(deal.price)}</div></div>
                    <div class="stat-box"><div class="stat-label">Cap rate</div><div class="stat-value">${deal.capRate}%</div></div>
                    <div class="stat-box"><div class="stat-label">Cash flow</div><div class="stat-value">${formatEuro(deal.monthlyCashFlow)}</div></div>
                    <div class="stat-box"><div class="stat-label">Strategy</div><div class="stat-value">${deal.strategy}</div></div>
                  </div>
                  <div class="panel-copy">TELAJ thinks this is interesting because ${deal.positives[0].toLowerCase()}.</div>
                  <div class="tag-row">${deal.risks.map((item) => `<span class="task-pill">${item}</span>`).join("")}</div>
                </div>
              `
            )
            .join("")
        : `<div class="subpanel"><div class="panel-copy">No candidate deals match the current filter set. Relax the thresholds or change the market/strategy.</div></div>`}
    </div>
  `;

  document.getElementById("address-analyzer").innerHTML = `
    <div class="eyebrow">Address analyzer</div>
    <h3>Evaluate a property by address and assumptions</h3>
    <div class="input-stack">
      <label class="input-field input-span-2"><span class="micro-label">Address</span><input id="address-input" type="text" value="${state.addressAnalyzer.address}" placeholder="123 Main St, Columbus, OH" /></label>
      <label class="input-field"><span class="micro-label">Purchase price</span><input id="address-price" type="number" step="1000" value="${state.addressAnalyzer.purchasePrice}" /></label>
      <label class="input-field"><span class="micro-label">Expected rent</span><input id="address-rent" type="number" step="50" value="${state.addressAnalyzer.expectedRent}" /></label>
      <label class="input-field"><span class="micro-label">Down payment %</span><input id="address-down" type="number" step="1" value="${state.addressAnalyzer.downPaymentPct}" /></label>
      <label class="input-field"><span class="micro-label">Interest rate %</span><input id="address-rate" type="number" step="0.1" value="${state.addressAnalyzer.interestRatePct}" /></label>
      <label class="input-field"><span class="micro-label">Taxes / mo</span><input id="address-taxes" type="number" step="10" value="${state.addressAnalyzer.taxesMonthly}" /></label>
      <label class="input-field"><span class="micro-label">Insurance / mo</span><input id="address-insurance" type="number" step="10" value="${state.addressAnalyzer.insuranceMonthly}" /></label>
      <label class="input-field"><span class="micro-label">Repairs / mo</span><input id="address-repairs" type="number" step="10" value="${state.addressAnalyzer.repairsMonthly}" /></label>
      <label class="input-field"><span class="micro-label">Vacancy %</span><input id="address-vacancy" type="number" step="1" value="${state.addressAnalyzer.vacancyPct}" /></label>
      <label class="input-field"><span class="micro-label">Management %</span><input id="address-management" type="number" step="1" value="${state.addressAnalyzer.managementPct}" /></label>
      <label class="input-field"><span class="micro-label">Closing costs</span><input id="address-closing" type="number" step="1000" value="${state.addressAnalyzer.closingCosts}" /></label>
      <label class="input-field"><span class="micro-label">Renovation budget</span><input id="address-renovation" type="number" step="1000" value="${state.addressAnalyzer.renovationBudget}" /></label>
      <div class="property-action-row input-span-2"><button class="action-button primary" id="address-run">Run analysis</button></div>
    </div>
    <div class="insight-grid">
      <div class="insight-card"><div class="micro-label">Verdict</div><div class="panel-copy">${addressAnalysis.verdict}</div></div>
      <div class="insight-card"><div class="micro-label">Cap rate</div><div class="panel-copy">${addressAnalysis.capRate}%</div></div>
      <div class="insight-card"><div class="micro-label">Cash flow</div><div class="panel-copy">${formatEuro(addressAnalysis.monthlyCashFlow)} / mo</div></div>
      <div class="insight-card"><div class="micro-label">Cash-on-cash</div><div class="panel-copy">${addressAnalysis.cashOnCash}%</div></div>
      <div class="insight-card"><div class="micro-label">DSCR</div><div class="panel-copy">${addressAnalysis.dscr}</div></div>
      <div class="insight-card"><div class="micro-label">Stress case</div><div class="panel-copy">${formatEuro(addressAnalysis.stressCashFlow)} / mo</div></div>
    </div>
    <div class="panel-copy">${addressAnalysis.explanation}</div>
    <div class="summary-grid">
      <div class="profile-chip"><div class="micro-label">Top strengths</div><div class="panel-copy">${addressAnalysis.strengths.join(" ") || "No major strength yet."}</div></div>
      <div class="profile-chip"><div class="micro-label">Top risks</div><div class="panel-copy">${addressAnalysis.risks.join(" ") || "No major flagged risk yet."}</div></div>
    </div>
  `;

  document.getElementById("hold-advisor").innerHTML = `
    <div class="eyebrow">Hold / sell / refinance advisor</div>
    <h3>Compare owned-property scenarios</h3>
    <div class="input-stack">
      <label class="input-field input-span-2"><span class="micro-label">Address</span><input id="hold-address" type="text" value="${state.holdAdvisor.address}" placeholder="Owned property address" /></label>
      <label class="input-field"><span class="micro-label">Current value</span><input id="hold-value" type="number" step="1000" value="${state.holdAdvisor.currentValue}" /></label>
      <label class="input-field"><span class="micro-label">Mortgage balance</span><input id="hold-mortgage" type="number" step="1000" value="${state.holdAdvisor.mortgageBalance}" /></label>
      <label class="input-field"><span class="micro-label">Current rent or use value</span><input id="hold-rent" type="number" step="50" value="${state.holdAdvisor.currentRent}" /></label>
      <label class="input-field"><span class="micro-label">Monthly expenses</span><input id="hold-expenses" type="number" step="10" value="${state.holdAdvisor.monthlyExpenses}" /></label>
      <label class="input-field"><span class="micro-label">Estimated repairs</span><input id="hold-repairs" type="number" step="1000" value="${state.holdAdvisor.estimatedRepairs}" /></label>
      <label class="input-field"><span class="micro-label">Current rate %</span><input id="hold-rate" type="number" step="0.1" value="${state.holdAdvisor.currentRatePct}" /></label>
      <label class="input-field"><span class="micro-label">Expected sale price</span><input id="hold-sale" type="number" step="1000" value="${state.holdAdvisor.expectedSalePrice}" /></label>
      <label class="input-field input-span-2"><span class="micro-label">Exit costs %</span><input id="hold-exit" type="number" step="0.5" value="${state.holdAdvisor.exitCostsPct}" /></label>
      <div class="property-action-row input-span-2"><button class="action-button primary" id="hold-run">Compare scenarios</button></div>
    </div>
    <div class="insight-grid">
      <div class="insight-card"><div class="micro-label">Recommendation</div><div class="panel-copy">${ownedPropertyDecision.recommendation}</div></div>
      <div class="insight-card"><div class="micro-label">Equity</div><div class="panel-copy">${formatEuro(ownedPropertyDecision.equity)}</div></div>
      <div class="insight-card"><div class="micro-label">Keep</div><div class="panel-copy">${formatEuro(ownedPropertyDecision.keepScenario)} / mo</div></div>
      <div class="insight-card"><div class="micro-label">Refinance</div><div class="panel-copy">${formatEuro(ownedPropertyDecision.refinanceScenario)}</div></div>
      <div class="insight-card"><div class="micro-label">Sell & redeploy</div><div class="panel-copy">${formatEuro(ownedPropertyDecision.sellScenario)}</div></div>
      <div class="insight-card"><div class="micro-label">Decision score</div><div class="panel-copy">${ownedPropertyDecision.score}</div></div>
    </div>
    <div class="panel-copy">${ownedPropertyDecision.explanation}</div>
  `;

  document.getElementById("tax-education").innerHTML = `
    <div class="eyebrow">Tax-aware education</div>
    <h3>Educational only, not personal tax or legal advice</h3>
    <ul class="clean-list">
      ${(intel.taxEducation?.items || []).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <div class="legal-note">
      <div class="micro-label">Educational only</div>
      <div class="panel-copy">TELAJ can help frame questions around depreciation, refinance tradeoffs, entities, and sale friction, but you should verify those decisions with a licensed CPA or attorney.</div>
    </div>
  `;

  document.getElementById("property-go-deals").addEventListener("click", () => {
    document.getElementById("deal-finder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("property-go-address").addEventListener("click", () => {
    document.getElementById("address-analyzer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("property-go-allocation").addEventListener("click", () => setView("allocation"));

  document.getElementById("deal-filter-run").addEventListener("click", () => {
    state.realEstateFilters = {
      ...state.realEstateFilters,
      budget: Number(document.getElementById("deal-budget").value || 0),
      market: document.getElementById("deal-market").value,
      strategy: document.getElementById("deal-strategy").value,
      propertyType: document.getElementById("deal-property-type").value,
      minimumCapRate: Number(document.getElementById("deal-cap-rate").value || 0),
      minimumCashFlow: Number(document.getElementById("deal-cash-flow").value || 0),
    };
    renderRealEstate();
  });

  document.getElementById("address-run").addEventListener("click", () => {
    state.addressAnalyzer = {
      address: document.getElementById("address-input").value,
      purchasePrice: Number(document.getElementById("address-price").value || 0),
      expectedRent: Number(document.getElementById("address-rent").value || 0),
      downPaymentPct: Number(document.getElementById("address-down").value || 0),
      interestRatePct: Number(document.getElementById("address-rate").value || 0),
      taxesMonthly: Number(document.getElementById("address-taxes").value || 0),
      insuranceMonthly: Number(document.getElementById("address-insurance").value || 0),
      repairsMonthly: Number(document.getElementById("address-repairs").value || 0),
      vacancyPct: Number(document.getElementById("address-vacancy").value || 0),
      managementPct: Number(document.getElementById("address-management").value || 0),
      closingCosts: Number(document.getElementById("address-closing").value || 0),
      renovationBudget: Number(document.getElementById("address-renovation").value || 0),
    };
    renderRealEstate();
  });

  document.getElementById("hold-run").addEventListener("click", () => {
    state.holdAdvisor = {
      address: document.getElementById("hold-address").value,
      currentValue: Number(document.getElementById("hold-value").value || 0),
      mortgageBalance: Number(document.getElementById("hold-mortgage").value || 0),
      currentRent: Number(document.getElementById("hold-rent").value || 0),
      monthlyExpenses: Number(document.getElementById("hold-expenses").value || 0),
      estimatedRepairs: Number(document.getElementById("hold-repairs").value || 0),
      currentRatePct: Number(document.getElementById("hold-rate").value || 0),
      expectedSalePrice: Number(document.getElementById("hold-sale").value || 0),
      exitCostsPct: Number(document.getElementById("hold-exit").value || 0),
    };
    renderRealEstate();
  });
}

function bindNav() {
  if (navBound) {
    return;
  }
  navBound = true;

  navItems.forEach((item) => item.addEventListener("click", () => setView(item.dataset.section)));

  function jumpToFinancialPosition() {
    setView("home");
    window.requestAnimationFrame(() => {
      document.getElementById("financial-position")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.requestAnimationFrame(() => {
        document.getElementById("fp-liquid")?.focus();
      });
    });
  }

  function jumpToMorningSignal() {
    setView("home");
    window.requestAnimationFrame(() => {
      document.getElementById("morning-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document.getElementById("hero-execute").addEventListener("click", jumpToFinancialPosition);
  document.getElementById("hero-simulate").addEventListener("click", jumpToMorningSignal);
}

function renderAll() {
  try {
    applyProfilesToNarrative();
    renderRailAccount();
    renderRailFooter();
    renderMorningHero();
    renderSystemHealth();
    renderXpLevel();
    renderFinancialPosition();
    renderAllocationSnapshot();
    renderCashStatus();
    renderTasks();
    renderWatchlist();
    renderAllocationView();
    renderSignalsView();
    renderProgress();
    renderRealEstate();
    bindNav();
    setView(state.activeView);
  } catch (error) {
    console.error("TELAJ render failed.", error);
    showFatalShellError(error instanceof Error ? error.message : "Unknown render failure");
  }
}

async function bootstrap() {
  try {
    initSupabaseClient();
    loadMarketRegion();
    loadAuthState();
    loadSubscriberPreferences();
    loadOnboardingState();
    await loadMockApiState();
    let loadedFinancialPosition = false;
    if (supabaseClient) {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session?.user) {
          state.auth.authenticated = true;
          state.auth.guest = Boolean(data.session.user.is_anonymous);
          state.auth.email = data.session.user.email || "";
          syncSubscriberEmailFromAuth();
          loadedFinancialPosition = await loadFinancialPositionFromApi();
        }
      } catch (error) {
        console.warn("TELAJ auth session could not be restored.", error);
      }
    }
    if (!loadedFinancialPosition) {
      loadWealthInputs();
    }
    if (state.onboarding.completed && (!state.onboarding.profiles?.householdProfile || !state.onboarding.profiles?.behaviorProfile || !state.onboarding.profiles?.goalProfile)) {
      state.onboarding.profiles = deriveLifeMatrixProfiles();
      persistOnboardingState();
    }
    if (state.onboarding.completed && !state.onboarding.intent?.analysis) {
      state.onboarding.completed = false;
      state.onboarding.stage = "intent";
      persistOnboardingState();
    }
    persistAuthState();
    if (state.auth.authenticated && state.onboarding.completed) {
      renderAll();
    }
    renderAuthShell();
    renderOnboarding();
  } catch (error) {
    console.error("TELAJ bootstrap failed.", error);
    showFatalShellError(error instanceof Error ? error.message : "Unknown bootstrap failure");
  }
}

bootstrap();
