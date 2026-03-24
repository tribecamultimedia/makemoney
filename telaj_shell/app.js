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
  homeApi: {
    loading: false,
    error: "",
    whereIStand: null,
    biggestIssue: null,
    todayMove: null,
    actionPlan: null,
    performanceSummary: null,
  },
  sound: {
    enabled: false,
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
    stage: "profile",
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
      statusText: "",
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
  assetCheck: {
    query: "",
    result: null,
    loading: false,
    error: "",
  },
  assetTracks: {
    items: [],
    summary: {
      trackedCount: 0,
      successRate: 0,
    },
  },
  marketRegime: {
    live: false,
    region: "US",
    regime: "",
    riskLevel: "",
    summary: "",
    features: [],
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
  assetLedger: {
    items: [],
  },
  recurringExpenses: {
    items: [],
  },
  familyVault: {
    documents: [],
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
const SOUND_PREFERENCE_STORAGE_KEY = "telaj-sound-enabled-v1";
const ONBOARDING_PROFILE_FIELDS = [
  "exactAge",
  "countryName",
  "marketFocus",
  "householdRole",
  "dependentsCount",
  "healthConstraint",
  "monthlyIncomeAmount",
  "monthlyNeedAmount",
  "liquidAssetsAmount",
  "investmentsAmount",
  "retirementAmount",
  "realEstateAmount",
  "businessAssetsAmount",
  "creditCardDebtAmount",
  "loansAmount",
  "mortgageDebtAmount",
];
const questionBank = [
  {
    id: "userCountry",
    category: "Market setup",
    prompt: "Where are you based right now?",
    helper: "TELAJ should know where you live or operate so the language, context, and future planning start in the right place.",
    options: [
      { value: "us", title: "United States", note: "US-based personal or business finances." },
      { value: "europe", title: "Europe", note: "EU, UK, or Europe-based planning context." },
      { value: "international", title: "International", note: "Cross-border or multi-country context." },
      { value: "other", title: "Other region", note: "Outside the US and Europe for now." },
    ],
  },
  {
    id: "marketFocus",
    category: "Market setup",
    prompt: "Which market should TELAJ optimize for first?",
    helper: "You may live in one place and invest in another. TELAJ should know which market deserves the main decision engine.",
    options: [
      { value: "US", title: "US markets", note: "US equities, rates, and market context first." },
      { value: "EU", title: "European markets", note: "European equities, ECB context, and euro reserve framing." },
      { value: "GLOBAL", title: "Global first", note: "Keep the framing broad, then narrow later." },
    ],
  },
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
const effectsApi = window.TELAJEffects || {};
const soundEngine = effectsApi.TelajSoundEngine ? new effectsApi.TelajSoundEngine() : null;
const DEFAULT_BETA_INVITE_CODES = ["TELAJ-BETA-7Q2M9X"];
const FINANCIAL_POSITION_ENDPOINT = "/api/financial-position";
const ASSET_CHECK_ENDPOINT = "/api/asset-check";
const ASSET_TRACK_ENDPOINT = "/api/asset-track";
const HOME_ENDPOINT = "/api/home";
const SIGNAL_ACTION_ENDPOINT = "/api/signal-action";
const MARKET_REGIME_ENDPOINT = "/api/market-regime";
const MARKET_FOCUS_TO_REGION = {
  US: "US",
  EU: "EU",
  GLOBAL: "US",
};

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

function getCanonicalAppUrl() {
  const configured = String(window.TELAJ_CONFIG?.appUrl || "").trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return "https://telaj.com";
}

function loadSoundPreference() {
  try {
    state.sound.enabled = window.localStorage.getItem(SOUND_PREFERENCE_STORAGE_KEY) === "true";
  } catch (error) {
    state.sound.enabled = false;
  }
  soundEngine?.setEnabled(state.sound.enabled);
  soundEngine?.registerInteractionUnlock();
}

function persistSoundPreference() {
  window.localStorage.setItem(SOUND_PREFERENCE_STORAGE_KEY, state.sound.enabled ? "true" : "false");
  soundEngine?.setEnabled(state.sound.enabled);
}

function playButtonSound(kind) {
  soundEngine?.playButtonTap(kind);
}

function applyTypewriterEffect(element, text, options = {}) {
  if (!element || !effectsApi.typeText) {
    if (element && typeof text === "string") {
      element.textContent = text;
    }
    return;
  }
  effectsApi.typeText(element, text, {
    soundEngine,
    soundEnabled: state.sound.enabled,
    ...options,
  });
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

function renderLoadingOverlay(message = "Loading TELAJ...") {
  let overlay = document.getElementById("telaj-loading-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "telaj-loading-overlay";
    overlay.className = "loading-overlay";
    overlay.innerHTML = `
      <div class="loading-overlay-backdrop"></div>
      <div class="loading-overlay-card" role="status" aria-live="polite">
        <div class="loading-spinner" aria-hidden="true"></div>
        <div class="micro-label">TELAJ</div>
        <div class="loading-overlay-message" id="telaj-loading-message"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  overlay.hidden = false;
  const messageNode = document.getElementById("telaj-loading-message");
  if (messageNode) {
    messageNode.textContent = message;
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById("telaj-loading-overlay");
  if (overlay) {
    overlay.hidden = true;
  }
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
  state.onboarding.stage = "profile";
  state.homeApi = structuredClone(defaultState.homeApi);
  state.activeView = "home";
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
  renderAuthShell();
  renderOnboarding();
  authShell.classList.add("is-active");
  appShell.classList.add("is-hidden");
  onboardingShell.classList.remove("is-active");
  onboardingShell.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "auto" });
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

function syncMarketRegionFromOnboarding() {
  const focus = state.onboarding.answers?.marketFocus;
  const mappedRegion = MARKET_FOCUS_TO_REGION[focus];
  if (mappedRegion) {
    applyMarketRegion(mappedRegion);
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

function capitalizeWords(value) {
  return String(value || "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
      stage:
        parsed.stage === "complete"
          ? "complete"
          : parsed.stage === "intent"
            ? "intent"
            : parsed.stage === "profile"
              ? "profile"
              : "questions",
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
              statusText: typeof parsed.intent.statusText === "string" ? parsed.intent.statusText : "",
            }
          : structuredClone(defaultState.onboarding.intent),
    };
    if (!isOnboardingProfileComplete()) {
      state.onboarding.completed = false;
      state.onboarding.stage = "profile";
      state.onboarding.currentStep = 0;
    } else {
      syncProfileAnswersToState();
    }
    const firstMissing = getFirstMissingQuestionIndex();
    if (isOnboardingProfileComplete() && firstMissing >= 0) {
      state.onboarding.completed = false;
      state.onboarding.stage = "questions";
      state.onboarding.currentStep = firstMissing;
    } else if (isOnboardingProfileComplete() && !state.onboarding.intent?.analysis) {
      state.onboarding.completed = false;
      state.onboarding.stage = "intent";
    } else if (state.onboarding.completed) {
      state.onboarding.stage = "complete";
    }
    syncMarketRegionFromOnboarding();
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
    if (parsed.assetLedger?.items) {
      state.assetLedger = {
        ...state.assetLedger,
        items: Array.isArray(parsed.assetLedger.items) ? parsed.assetLedger.items : [],
      };
    }
    if (parsed.recurringExpenses?.items) {
      state.recurringExpenses = {
        ...state.recurringExpenses,
        items: Array.isArray(parsed.recurringExpenses.items) ? parsed.recurringExpenses.items : [],
      };
    }
    if (parsed.familyVault?.documents) {
      state.familyVault = {
        ...state.familyVault,
        documents: Array.isArray(parsed.familyVault.documents) ? parsed.familyVault.documents : [],
      };
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
      assetLedger: state.assetLedger,
      recurringExpenses: state.recurringExpenses,
      familyVault: state.familyVault,
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

async function fetchAuthedJson(url) {
  if (!state.auth.authenticated) {
    return null;
  }
  const token = await getAccessToken();
  if (!token) {
    return null;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status}`);
  }
  return response.json();
}

async function loadHomeDecisionState() {
  if (!state.auth.authenticated) {
    state.homeApi = {
      ...state.homeApi,
      loading: false,
      error: "",
      whereIStand: null,
      biggestIssue: null,
      todayMove: null,
      actionPlan: null,
      performanceSummary: null,
    };
    return false;
  }

  state.homeApi.loading = true;
  state.homeApi.error = "";

  try {
    const homePayload = await fetchAuthedJson(HOME_ENDPOINT);

    state.homeApi = {
      ...state.homeApi,
      loading: false,
      error: "",
      whereIStand: homePayload?.whereIStand || null,
      biggestIssue: homePayload?.biggestIssue || null,
      todayMove: homePayload?.todayMove || null,
      actionPlan: homePayload?.actionPlan || null,
      performanceSummary: homePayload?.performanceSummary || null,
    };
    await loadAssetTracks();
    return true;
  } catch (error) {
    console.warn("TELAJ home decision routes failed, keeping local fallback rendering.", error);
    state.homeApi.loading = false;
    state.homeApi.error = error instanceof Error ? error.message : "TELAJ could not load the decision layer.";
    return false;
  }
}

async function recordTodayMoveAction(action) {
  if (!state.auth.authenticated) {
    return null;
  }
  const token = await getAccessToken();
  if (!token) {
    return null;
  }
  const response = await fetch(SIGNAL_ACTION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) {
    throw new Error(`Signal action failed: ${response.status}`);
  }
  return response.json();
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
  state.assetLedger = {
    ...state.assetLedger,
    items: Array.isArray(normalized.asset_ledger ?? normalized.assetLedger) ? (normalized.asset_ledger ?? normalized.assetLedger) : state.assetLedger.items,
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
        asset_ledger: Array.isArray(state.assetLedger.items) ? state.assetLedger.items : [],
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

async function requestAssetCheck(query) {
  const normalized = String(query || "").trim();
  if (!normalized) {
    return null;
  }

  try {
    const response = await fetch(ASSET_CHECK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: normalized,
        region: state.marketRegion,
      }),
    });

    if (!response.ok) {
      throw new Error(`Asset check failed: ${response.status}`);
    }

    const payload = await response.json();
    if (payload?.analysis) {
      state.assetCheck.error = "";
      return payload.analysis;
    }
  } catch (error) {
    console.warn("TELAJ asset-check route unavailable, using local fallback.", error);
    state.assetCheck.error = error instanceof Error ? error.message : "Live route unavailable";
  }

  return evaluateAssetCheck(normalized);
}

async function loadAssetTracks() {
  if (!state.auth.authenticated) {
    state.assetTracks = {
      items: [],
      summary: {
        trackedCount: 0,
        successRate: 0,
      },
    };
    return null;
  }
  try {
    const payload = await fetchAuthedJson(ASSET_TRACK_ENDPOINT);
    if (payload?.tracks) {
      state.assetTracks = {
        items: payload.tracks,
        summary: payload.summary || {
          trackedCount: payload.tracks.length,
          successRate: 0,
        },
      };
      return payload;
    }
  } catch (error) {
    console.warn("TELAJ could not load asset tracks.", error);
  }
  return null;
}

async function trackAssetSignal() {
  const result = state.assetCheck.result;
  if (!result || !state.auth.authenticated || !result.currentPrice) {
    return null;
  }
  const token = await getAccessToken();
  if (!token) {
    return null;
  }
  const response = await fetch(ASSET_TRACK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: state.assetCheck.query,
      symbol: result.symbol || result.ticker,
      label: result.label,
      signal: result.signal,
      region: state.marketRegion,
      entryPrice: result.currentPrice,
      notional: 10000,
    }),
  });
  if (!response.ok) {
    throw new Error(`Asset track failed: ${response.status}`);
  }
  const payload = await response.json();
  await loadAssetTracks();
  return payload?.tracked || null;
}

async function loadMarketRegime() {
  try {
    const response = await fetch(`${MARKET_REGIME_ENDPOINT}?region=${encodeURIComponent(state.marketRegion)}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Market regime failed: ${response.status}`);
    }
    const payload = await response.json();
    if (payload?.marketRegime) {
      state.marketRegime = payload.marketRegime;
      return payload.marketRegime;
    }
  } catch (error) {
    console.warn("TELAJ market regime route unavailable, using local fallback.", error);
    state.marketRegime = {
      live: false,
      region: state.marketRegion,
      regime: state.investmentIntel.marketState.regime,
      riskLevel: state.investmentIntel.marketState.riskLevel,
      summary: state.investmentIntel.marketState.summary,
      features: [],
    };
  }
  return state.marketRegime;
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
    if (!state.marketRegime?.regime) {
      state.marketRegime = {
        live: false,
        region: state.marketRegion,
        regime: state.investmentIntel.marketState.regime,
        riskLevel: state.investmentIntel.marketState.riskLevel,
        summary: state.investmentIntel.marketState.summary,
        features: [],
      };
    }
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

function getOnboardingNumber(field, fallback = 0) {
  const raw = state.onboarding.answers?.[field];
  if (raw === "" || raw === null || raw === undefined) {
    return Number(fallback || 0);
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : Number(fallback || 0);
}

function isOnboardingProfileComplete() {
  const answers = state.onboarding.answers || {};
  return ONBOARDING_PROFILE_FIELDS.every((field) => {
    const value = answers[field];
    return value !== undefined && value !== null && value !== "";
  });
}

function syncProfileAnswersToState() {
  state.liquidityDetails.monthlyNeed = getOnboardingNumber("monthlyNeedAmount", state.liquidityDetails.monthlyNeed);
  state.liquidityDetails.liquidAssets = getOnboardingNumber("liquidAssetsAmount", state.liquidityDetails.liquidAssets);
  state.financialPosition.investments = getOnboardingNumber("investmentsAmount", state.financialPosition.investments);
  state.financialPosition.retirement = getOnboardingNumber("retirementAmount", state.financialPosition.retirement);
  state.financialPosition.realEstate = getOnboardingNumber("realEstateAmount", state.financialPosition.realEstate);
  state.financialPosition.business = getOnboardingNumber("businessAssetsAmount", state.financialPosition.business);
  state.financialPosition.creditCardDebt = getOnboardingNumber("creditCardDebtAmount", state.financialPosition.creditCardDebt);
  state.financialPosition.loans = getOnboardingNumber("loansAmount", state.financialPosition.loans);
  state.financialPosition.mortgageDebt = getOnboardingNumber("mortgageDebtAmount", state.financialPosition.mortgageDebt);
}

function deriveAgeBandFromAge(age) {
  if (!Number.isFinite(age) || age <= 0) return "unknown";
  if (age < 30) return "20s";
  if (age < 40) return "30s";
  if (age < 50) return "40s";
  return "50plus";
}

function deriveNetWorthBandFromValue(value) {
  if (value < 50000) return "under-50k";
  if (value < 250000) return "50k-250k";
  if (value < 1000000) return "250k-1m";
  return "1m-plus";
}

function deriveIncomeBandFromMonthly(monthlyIncome) {
  if (monthlyIncome < 2500) return "low";
  if (monthlyIncome < 7000) return "middle";
  if (monthlyIncome < 18000) return "high";
  return "very-high";
}

function deriveLiquidityProfileFromValues(liquidAssets, totalAssets) {
  const ratio = totalAssets > 0 ? liquidAssets / totalAssets : 0;
  if (ratio < 0.1) return "very-low";
  if (ratio < 0.25) return "moderate";
  if (ratio < 0.5) return "healthy";
  return "very-strong";
}

function deriveAssetLocationFromValues(values) {
  const buckets = [
    { key: "cash", value: values.liquidAssets },
    { key: "markets", value: values.investments + values.retirement },
    { key: "primary-home", value: values.realEstate },
    { key: "investment-property", value: values.businessAssets },
  ];
  return buckets.sort((a, b) => b.value - a.value)[0]?.key || "cash";
}

function deriveOwnedAssetsFromValues(values) {
  const active = [
    values.liquidAssets > 0 ? "cash" : null,
    values.investments + values.retirement > 0 ? "investments" : null,
    values.realEstate > 0 || values.businessAssets > 0 ? "property" : null,
  ].filter(Boolean);
  if (active.length >= 2) return "mixed";
  if (active.includes("property")) return "property";
  if (active.includes("investments")) return "investments";
  return "mostly-cash";
}

function getStructuredProfileInputs(answers) {
  const liquidAssets = Number(answers.liquidAssetsAmount || 0);
  const investments = Number(answers.investmentsAmount || 0);
  const retirement = Number(answers.retirementAmount || 0);
  const realEstate = Number(answers.realEstateAmount || 0);
  const businessAssets = Number(answers.businessAssetsAmount || 0);
  const creditCardDebt = Number(answers.creditCardDebtAmount || 0);
  const loans = Number(answers.loansAmount || 0);
  const mortgageDebt = Number(answers.mortgageDebtAmount || 0);
  const totalAssets = liquidAssets + investments + retirement + realEstate + businessAssets;
  const totalDebt = creditCardDebt + loans + mortgageDebt;
  return {
    exactAge: Number(answers.exactAge || 0),
    monthlyIncome: Number(answers.monthlyIncomeAmount || 0),
    monthlyNeed: Number(answers.monthlyNeedAmount || 0),
    liquidAssets,
    investments,
    retirement,
    realEstate,
    businessAssets,
    creditCardDebt,
    loans,
    mortgageDebt,
    totalAssets,
    totalDebt,
    netWorth: totalAssets - totalDebt,
  };
}

function getLifeMatrixQuestions() {
  const answers = state.onboarding.answers;
  const derivedOwnedAssets = deriveOwnedAssetsFromValues(getStructuredProfileInputs(answers));
  return questionBank.filter((question) => {
    if (["userCountry", "marketFocus", "netWorthBand", "liquidity", "assetLocation", "ageBand", "householdRole", "dependents", "ownedAssets", "incomeBand", "healthConstraint"].includes(question.id)) {
      return false;
    }
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
      return ["property", "mixed"].includes(derivedOwnedAssets) || ["existing", "active"].includes(answers.propertyIntent);
    }
    if (question.id === "propertyType") {
      return (
        (["property", "mixed"].includes(derivedOwnedAssets) || ["existing", "active"].includes(answers.propertyIntent)) &&
        Boolean(answers.propertyCount) &&
        answers.propertyCount !== "0"
      );
    }
    if (question.id === "propertyIntent" && derivedOwnedAssets === "mostly-cash" && answers.goal === "safety") {
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
  const structured = getStructuredProfileInputs(answers);
  const derivedOwnedAssets = deriveOwnedAssetsFromValues(structured);
  const derivedAssetLocation = deriveAssetLocationFromValues(structured);
  const derivedAgeBand = deriveAgeBandFromAge(structured.exactAge);
  const derivedNetWorthBand = deriveNetWorthBandFromValue(structured.netWorth);
  const derivedLiquidity = deriveLiquidityProfileFromValues(structured.liquidAssets, structured.totalAssets);
  const assetBase =
    derivedAssetLocation === "investment-property"
      ? "Business and investment property profile"
      : derivedAssetLocation === "primary-home"
        ? "Home-equity-led profile"
      : derivedOwnedAssets === "mixed"
      ? "Multi-asset profile"
      : derivedOwnedAssets === "property"
        ? "Property-centered profile"
        : derivedOwnedAssets === "investments"
          ? "Investment-led profile"
          : "Liquidity-led profile";
  const propertyExposure = ["property", "mixed"].includes(derivedOwnedAssets) || ["existing", "active"].includes(answers.propertyIntent);
  const archetype =
    answers.householdRole === "parent" || answers.householdRole === "multi"
      ? "Family Stabilizer"
      : deriveIncomeBandFromMonthly(structured.monthlyIncome) === "very-high" && answers.spendingStyle === "spender"
        ? "High Earner, Low Friction Control"
        : answers.goal === "legacy"
          ? "Legacy Builder"
          : "Independent Builder";
  return {
    userCountry: answers.countryName ?? answers.userCountry ?? "unknown",
    marketFocus: answers.marketFocus ?? "US",
    age: structured.exactAge || null,
    ageBand: derivedAgeBand,
    householdRole: answers.householdRole ?? "unknown",
    dependents: answers.dependentsCount ?? answers.dependents ?? "0",
    incomeBand: deriveIncomeBandFromMonthly(structured.monthlyIncome),
    monthlyIncome: structured.monthlyIncome,
    incomeStability: answers.incomeStability ?? "unknown",
    healthConstraint: answers.healthConstraint ?? "prefer-not",
    netWorthBand: derivedNetWorthBand,
    netWorth: structured.netWorth,
    assetLocation: derivedAssetLocation,
    ownedAssets: derivedOwnedAssets,
    assetBase,
    liabilityPressure: answers.liabilities ?? "unknown",
    liquidityProfile: derivedLiquidity,
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
  const structured = getStructuredProfileInputs(answers);
  const derivedLiquidity = deriveLiquidityProfileFromValues(structured.liquidAssets, structured.totalAssets);
  const goalArchetype =
    answers.goal === "legacy"
      ? "Long-duration family builder"
      : answers.goal === "safety"
        ? "Capital protector"
        : answers.goal === "income"
          ? "Cash-flow builder"
          : "Compounder";
  const recommendedPosture =
    answers.goal === "safety" || answers.liabilities === "heavy" || derivedLiquidity === "very-low"
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

  if (!isOnboardingProfileComplete() || state.onboarding.stage === "profile") {
    renderProfileStage();
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
      if (question.id === "marketFocus") {
        syncMarketRegionFromOnboarding();
      }
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

function renderProfileStage() {
  const answers = state.onboarding.answers || {};
  onboardingShell.classList.add("is-active");
  appShell.classList.add("is-hidden");
  onboardingShell.innerHTML = `
    <div class="onboarding-card">
      <div class="onboarding-head">
        <div>
          <div class="eyebrow">TELAJ PROFILE</div>
          <h1 class="onboarding-title">Complete your profile before TELAJ gives opinions.</h1>
          <p class="onboarding-copy">Enter the real profile once: age, country, income, liquidity, assets, and debts. TELAJ should optimize from exact values, not decade buckets and rough guesses.</p>
        </div>
        <div class="onboarding-step">Profile | exact inputs first</div>
      </div>
      <div class="question-stage">
        <div class="micro-label">Identity</div>
        <div class="input-stack">
          <label class="input-field">
            <span class="micro-label">Age</span>
            <input id="profile-age" type="number" min="18" max="120" step="1" value="${answers.exactAge ?? ""}" placeholder="80" />
          </label>
          <label class="input-field">
            <span class="micro-label">Country</span>
            <input id="profile-country" type="text" value="${answers.countryName ?? ""}" placeholder="Italy" />
          </label>
          <label class="input-field">
            <span class="micro-label">Market focus</span>
            <select id="profile-market-focus">
              <option value="US" ${answers.marketFocus === "US" ? "selected" : ""}>US</option>
              <option value="EU" ${answers.marketFocus === "EU" ? "selected" : ""}>Europe</option>
              <option value="GLOBAL" ${answers.marketFocus === "GLOBAL" ? "selected" : ""}>Global</option>
            </select>
          </label>
          <label class="input-field">
            <span class="micro-label">Household</span>
            <select id="profile-household-role">
              <option value="single" ${answers.householdRole === "single" ? "selected" : ""}>Single</option>
              <option value="couple" ${answers.householdRole === "couple" ? "selected" : ""}>Couple</option>
              <option value="parent" ${answers.householdRole === "parent" ? "selected" : ""}>Parent household</option>
              <option value="multi" ${answers.householdRole === "multi" ? "selected" : ""}>Multi-generational</option>
            </select>
          </label>
          <label class="input-field">
            <span class="micro-label">Dependents</span>
            <input id="profile-dependents" type="number" min="0" step="1" value="${answers.dependentsCount ?? "0"}" />
          </label>
          <label class="input-field">
            <span class="micro-label">Health / caregiving constraint</span>
            <select id="profile-health">
              <option value="none" ${answers.healthConstraint === "none" ? "selected" : ""}>No major issue</option>
              <option value="mild" ${answers.healthConstraint === "mild" ? "selected" : ""}>Some constraints</option>
              <option value="significant" ${answers.healthConstraint === "significant" ? "selected" : ""}>Significant</option>
              <option value="prefer-not" ${answers.healthConstraint === "prefer-not" ? "selected" : ""}>Prefer not to say</option>
            </select>
          </label>
        </div>
        <div class="section-spacer"></div>
        <div class="micro-label">Cash flow</div>
        <div class="input-stack">
          <label class="input-field">
            <span class="micro-label">Monthly income</span>
            <input id="profile-income" type="number" min="0" step="100" value="${answers.monthlyIncomeAmount ?? ""}" placeholder="4000" />
          </label>
          <label class="input-field">
            <span class="micro-label">Monthly need</span>
            <input id="profile-need" type="number" min="0" step="100" value="${answers.monthlyNeedAmount ?? ""}" placeholder="2500" />
          </label>
        </div>
        <div class="section-spacer"></div>
        <div class="micro-label">Assets and debts</div>
        <div class="input-stack">
          <label class="input-field"><span class="micro-label">Liquid cash</span><input id="profile-liquid" type="number" min="0" step="1000" value="${answers.liquidAssetsAmount ?? "0"}" placeholder="150000" /></label>
          <label class="input-field"><span class="micro-label">Investments</span><input id="profile-investments" type="number" min="0" step="1000" value="${answers.investmentsAmount ?? "0"}" /></label>
          <label class="input-field"><span class="micro-label">Retirement</span><input id="profile-retirement" type="number" min="0" step="1000" value="${answers.retirementAmount ?? "0"}" /></label>
          <label class="input-field"><span class="micro-label">Real estate</span><input id="profile-real-estate" type="number" min="0" step="1000" value="${answers.realEstateAmount ?? "0"}" /></label>
          <label class="input-field"><span class="micro-label">Business assets</span><input id="profile-business" type="number" min="0" step="1000" value="${answers.businessAssetsAmount ?? "0"}" /></label>
          <label class="input-field"><span class="micro-label">Credit card debt</span><input id="profile-credit-card" type="number" min="0" step="100" value="${answers.creditCardDebtAmount ?? "0"}" /></label>
          <label class="input-field"><span class="micro-label">Loans</span><input id="profile-loans" type="number" min="0" step="1000" value="${answers.loansAmount ?? "0"}" /></label>
          <label class="input-field"><span class="micro-label">Mortgage debt</span><input id="profile-mortgage" type="number" min="0" step="1000" value="${answers.mortgageDebtAmount ?? "0"}" /></label>
        </div>
      </div>
      <div class="onboarding-actions">
        <div class="task-pill">TELAJ will use these exact values as the base profile.</div>
        <button class="action-button primary" id="profile-continue">Continue</button>
      </div>
    </div>
  `;

  document.getElementById("profile-continue")?.addEventListener("click", () => {
    state.onboarding.answers.exactAge = document.getElementById("profile-age")?.value.trim() || "";
    state.onboarding.answers.countryName = document.getElementById("profile-country")?.value.trim() || "";
    state.onboarding.answers.userCountry = state.onboarding.answers.countryName;
    state.onboarding.answers.marketFocus = document.getElementById("profile-market-focus")?.value || "US";
    state.onboarding.answers.householdRole = document.getElementById("profile-household-role")?.value || "single";
    state.onboarding.answers.dependentsCount = document.getElementById("profile-dependents")?.value || "0";
    state.onboarding.answers.dependents = state.onboarding.answers.dependentsCount;
    state.onboarding.answers.healthConstraint = document.getElementById("profile-health")?.value || "none";
    state.onboarding.answers.monthlyIncomeAmount = document.getElementById("profile-income")?.value || "0";
    state.onboarding.answers.monthlyNeedAmount = document.getElementById("profile-need")?.value || "0";
    state.onboarding.answers.liquidAssetsAmount = document.getElementById("profile-liquid")?.value || "0";
    state.onboarding.answers.investmentsAmount = document.getElementById("profile-investments")?.value || "0";
    state.onboarding.answers.retirementAmount = document.getElementById("profile-retirement")?.value || "0";
    state.onboarding.answers.realEstateAmount = document.getElementById("profile-real-estate")?.value || "0";
    state.onboarding.answers.businessAssetsAmount = document.getElementById("profile-business")?.value || "0";
    state.onboarding.answers.creditCardDebtAmount = document.getElementById("profile-credit-card")?.value || "0";
    state.onboarding.answers.loansAmount = document.getElementById("profile-loans")?.value || "0";
    state.onboarding.answers.mortgageDebtAmount = document.getElementById("profile-mortgage")?.value || "0";

    if (!isOnboardingProfileComplete()) {
      return;
    }

    syncProfileAnswersToState();
    syncMarketRegionFromOnboarding();
    state.onboarding.stage = "questions";
    state.onboarding.currentStep = 0;
    persistWealthInputs();
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
          <h1 class="onboarding-title">TELAJ tells you what to do next with your cash, debt, and investments.</h1>
          <p class="onboarding-copy"><span id="auth-hero-copy"></span></p>
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
          <div class="answer-note">Fastest way to see your financial position and today's recommended next move.</div>
        </button>
        <button class="auth-option ${mode === "signup" ? "is-selected" : ""}" id="auth-signup" ${betaUnlocked ? "" : "disabled"}>
          <div class="answer-title">Create account</div>
          <div class="answer-note">Save your financial position, decision history, and market context across devices.</div>
        </button>
        <button class="auth-option ${mode === "login" ? "is-selected" : ""}" id="auth-login" ${betaUnlocked ? "" : "disabled"}>
          <div class="answer-title">Log in</div>
          <div class="answer-note">Return to your financial map, next-move plan, and TELAJ guidance.</div>
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
              <div class="auth-form-actions">
                <div class="task-pill">${state.subscription.plan} · ${state.subscription.status}</div>
                <button class="action-button primary" id="auth-submit" ${betaUnlocked ? "" : "disabled"}>${
                  mode === "signup" ? "Create account" : "Log in"
                }</button>
              </div>
            </div>
          `
          : `
            <div class="auth-note">
              <div class="micro-label">What TELAJ does</div>
              <div class="panel-copy">Map your cash, debt, and investments once. TELAJ then tells you the single smartest next move, instead of making you interpret another finance dashboard.</div>
              <div class="panel-copy">Choose guest access to enter immediately after acknowledging the disclaimer.</div>
            </div>
          `
      }
      <div class="auth-feedback">
        ${state.auth.error ? `<div class="auth-error">${state.auth.error}</div>` : ""}
        ${state.auth.info ? `<div class="auth-info">${state.auth.info}</div>` : ""}
        ${!supabaseReady ? `<div class="auth-info">Supabase public config is not set yet, so email login is disabled and guest mode will use local preview access.</div>` : ""}
        ${requiresBetaInvite() && !betaUnlocked ? `<div class="auth-info">Beta access is required before TELAJ entry is enabled.</div>` : ""}
      </div>
      <div class="auth-primary-row">
        <label class="legal-ack compact-legal-ack">
          <input id="legal-accept" type="checkbox" ${state.auth.legalAccepted ? "checked" : ""} />
          <span>
            I understand TELAJ provides educational information and model-based guidance only.
          </span>
        </label>
      </div>
      <div class="auth-legal-links">
        <button class="ghost-button" id="open-disclaimer">View disclaimer</button>
        <div class="panel-copy">Privacy and cookies use essential storage only at this stage.</div>
      </div>
    </div>
    <div class="modal-shell" id="disclaimer-modal" hidden>
      <div class="modal-backdrop" data-close-modal="true"></div>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
        <div class="modal-head">
          <div>
            <div class="eyebrow">TELAJ DISCLAIMER</div>
            <h2 id="disclaimer-title">Educational use only</h2>
          </div>
          <button class="ghost-button" id="close-disclaimer" type="button">Close</button>
        </div>
        <div class="modal-body">
          <div class="legal-note">
            <div class="micro-label">Important</div>
            <div class="panel-copy">TELAJ is not a broker, not an investment adviser, and not a fiduciary. Signals, scenarios, and allocation examples are informational only and do not guarantee future results.</div>
          </div>
          <div class="legal-note">
            <div class="micro-label">Responsibility</div>
            <div class="panel-copy">TELAJ does not provide investment, tax, legal, accounting, or financial advice. You remain responsible for your own decisions and for verifying suitability with licensed professionals where needed.</div>
          </div>
          <div class="legal-note">
            <div class="micro-label">Privacy and cookies</div>
            <div class="panel-copy">TELAJ uses essential browser storage and session data to keep you signed in, remember your progress, and save financial inputs. If analytics or marketing tracking are added later, TELAJ should ask for separate consent before using them.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  applyTypewriterEffect(
    document.getElementById("auth-hero-copy"),
    "Built for self-directed professionals. Map your finances once, then get one clear next move in plain English.",
    {
      key: "auth-hero-copy:v1",
      speed: 18,
      delay: 360,
      cursor: false,
    }
  );

  document.getElementById("auth-guest")?.addEventListener("click", () => {
    state.auth.mode = "guest";
    state.auth.error = "";
    state.auth.info = "";
    if (state.auth.legalAccepted && hasBetaAccess()) {
      handleAuthContinue();
      return;
    }
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
  authShell.querySelectorAll("#legal-accept").forEach((input) =>
    input.addEventListener("change", (event) => {
      state.auth.legalAccepted = Boolean(event.target.checked);
      state.auth.error = "";
      persistAuthState();
      renderAuthShell();
    })
  );
  const disclaimerModal = document.getElementById("disclaimer-modal");
  const closeDisclaimer = () => {
    disclaimerModal.hidden = true;
  };
  document.getElementById("open-disclaimer")?.addEventListener("click", () => {
    disclaimerModal.hidden = false;
  });
  document.getElementById("close-disclaimer")?.addEventListener("click", closeDisclaimer);
  disclaimerModal?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
      closeDisclaimer();
    }
  });
  document.getElementById("beta-unlock")?.addEventListener("click", () => {
    const betaCode = document.getElementById("beta-code")?.value || "";
    unlockBetaAccess(betaCode);
  });
  document.getElementById("auth-submit")?.addEventListener("click", async () => {
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

  renderLoadingOverlay(
    state.auth.mode === "signup"
      ? "Creating your TELAJ account..."
      : state.auth.mode === "login"
        ? "Loading your TELAJ session..."
        : "Entering TELAJ..."
  );

  try {
  if (state.auth.mode === "guest") {
    if (client) {
      const { data, error } = await client.auth.signInAnonymously();
      if (error) {
        state.auth.error = error.message;
        hideLoadingOverlay();
        renderAuthShell();
        return;
      }
      state.auth.authenticated = true;
      state.auth.guest = true;
      state.auth.email = data?.user?.email || "";
      state.auth.info = "Guest session started.";
      await loadFinancialPositionFromApi();
      await loadHomeDecisionState();
    } else {
      state.auth.authenticated = true;
      state.auth.guest = true;
      state.auth.info = "Guest preview session started.";
      state.syncStatus.financialPosition = "Local browser only";
    }
    persistAuthState();
    hideLoadingOverlay();
    renderAuthShell();
    renderOnboarding();
    return;
  }

  const email = document.getElementById("auth-email")?.value?.trim() || "";
  const password = document.getElementById("auth-password")?.value || "";
  state.auth.email = email;

  if (!client) {
    state.auth.error = "Supabase is not configured yet. Add the public URL and anon key to enable account auth.";
    hideLoadingOverlay();
    renderAuthShell();
    return;
  }
  if (!email || !password) {
    state.auth.error = "Email and password are required.";
    hideLoadingOverlay();
    renderAuthShell();
    return;
  }

  const result =
    state.auth.mode === "signup"
      ? await client.auth.signUp({ email, password })
      : await client.auth.signInWithPassword({ email, password });

  if (result.error) {
    state.auth.error = result.error.message;
    hideLoadingOverlay();
    renderAuthShell();
    return;
  }

  state.auth.authenticated = true;
  state.auth.guest = false;
  state.auth.info = state.auth.mode === "signup" ? "Account created. Continue into TELAJ." : "Logged in.";
  persistAuthState();
  await loadFinancialPositionFromApi();
  await loadHomeDecisionState();
  hideLoadingOverlay();
  renderAuthShell();
  renderOnboarding();
  } catch (error) {
    hideLoadingOverlay();
    throw error;
  }
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

  renderLoadingOverlay(`Connecting ${provider}...`);
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getCanonicalAppUrl(),
    },
  });

  if (error) {
    state.auth.error = error.message;
    hideLoadingOverlay();
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
  const statusText = state.onboarding.intent?.statusText || (analysis ? "Recommendation ready." : "Write freely, then analyze.");

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
        <div class="intent-status-line"><span id="intent-status-text"></span></div>
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
              <div class="panel-copy"><span id="intent-heard-text"></span></div>
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

  applyTypewriterEffect(document.getElementById("intent-status-text"), statusText, {
    key: `intent-status:${statusText}`,
    speed: 18,
    delay: 280,
    cursor: false,
  });
  if (analysis?.heard) {
    applyTypewriterEffect(document.getElementById("intent-heard-text"), analysis.heard, {
      key: `intent-heard:${analysis.heard}`,
      speed: 19,
      delay: 380,
      cursor: false,
    });
  }

  document.getElementById("intent-back")?.addEventListener("click", () => {
    state.onboarding.stage = "questions";
    state.onboarding.currentStep = Math.max(0, getLifeMatrixQuestions().length - 1);
    persistOnboardingState();
    renderOnboarding();
  });

  document.getElementById("intent-analyze")?.addEventListener("click", async () => {
    const nextNotes = document.getElementById("intent-notes").value.trim();
    state.onboarding.intent.notes = nextNotes;
    state.onboarding.intent.statusText = "Analyzing your position...";
    persistOnboardingState();
    renderIntentStage();
    renderLoadingOverlay("Analyzing your position...");
    try {
      state.onboarding.intent.analysis = await analyzeIntent(nextNotes, state.onboarding.profiles);
      state.onboarding.intent.confirmed = false;
      state.onboarding.intent.statusText = "Recommendation ready.";
      persistOnboardingState();
      hideLoadingOverlay();
      renderIntentStage();
    } catch (error) {
      hideLoadingOverlay();
      throw error;
    }
  });

  document.getElementById("intent-enter")?.addEventListener("click", async () => {
    state.onboarding.intent.notes = document.getElementById("intent-notes").value.trim();
    renderLoadingOverlay("Preparing your TELAJ recommendation...");
    try {
      state.onboarding.intent.analysis = await analyzeIntent(state.onboarding.intent.notes, state.onboarding.profiles);
      state.onboarding.intent.confirmed = Boolean(state.onboarding.intent.analysis);
      state.onboarding.completed = true;
      state.onboarding.stage = "complete";
      persistOnboardingState();
      applyProfilesToNarrative();
      hideLoadingOverlay();
      renderOnboarding();
      renderAll();
    } catch (error) {
      hideLoadingOverlay();
      throw error;
    }
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

function createAssetLedgerItem(kind = "property") {
  const id = `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const defaults = {
    property: {
      category: "property",
      label: "Property",
      status: "not-rented",
      estimatedValue: 0,
      debt: 0,
      monthlyCost: 0,
      monthlyIncome: 0,
      note: "",
    },
    car: {
      category: "car",
      label: "Car",
      status: "owned",
      estimatedValue: 0,
      debt: 0,
      monthlyCost: 0,
      monthlyIncome: 0,
      note: "",
    },
    aircraft: {
      category: "aircraft",
      label: "Aircraft",
      status: "owned",
      estimatedValue: 0,
      debt: 0,
      monthlyCost: 0,
      monthlyIncome: 0,
      note: "",
    },
    liability: {
      category: "liability",
      label: "Liability",
      status: "active",
      estimatedValue: 0,
      debt: 0,
      monthlyCost: 0,
      monthlyIncome: 0,
      note: "",
    },
  };
  return {
    id,
    ...(defaults[kind] || defaults.property),
  };
}

function summarizeAssetLedger(items) {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems.reduce(
    (summary, item) => {
      const value = Number(item.estimatedValue || 0);
      const debt = Number(item.debt || 0);
      const monthlyCost = Number(item.monthlyCost || 0);
      const monthlyIncome = Number(item.monthlyIncome || 0);
      summary.monthlyCarryingCost += monthlyCost;
      summary.monthlyAssetIncome += monthlyIncome;
      summary.netItemCashDrag += monthlyCost - monthlyIncome;
      if (item.category === "property") {
        summary.propertyValue += value;
        summary.propertyDebt += debt;
      } else if (["car", "aircraft", "boat", "liability"].includes(item.category)) {
        summary.otherDebt += debt;
        summary.vehicleAndLuxuryValue += value;
      } else {
        summary.otherDebt += debt;
      }
      return summary;
    },
    {
      propertyValue: 0,
      propertyDebt: 0,
      otherDebt: 0,
      vehicleAndLuxuryValue: 0,
      monthlyCarryingCost: 0,
      monthlyAssetIncome: 0,
      netItemCashDrag: 0,
    }
  );
}

function classifyAssetLedgerItem(item) {
  const category = String(item?.category || "other").toLowerCase();
  const value = Number(item?.estimatedValue || 0);
  const debt = Number(item?.debt || 0);
  const monthlyCost = Number(item?.monthlyCost || 0);
  const monthlyIncome = Number(item?.monthlyIncome || 0);
  const monthlyNet = monthlyIncome - monthlyCost;
  const leverageRatio = value > 0 ? debt / value : debt > 0 ? 1 : 0;

  if (category === "liability") {
    return {
      key: "liability",
      label: "Liability drag",
      summary: "This item is behaving like a direct obligation, not a productive asset.",
      detail:
        monthlyCost > 0 || debt > 0
          ? `It is costing about ${formatEuro(monthlyCost)} a month and carries ${formatEuro(debt)} of debt.`
          : "It does not create income and should be watched as a drag on flexibility.",
    };
  }

  if (["car", "aircraft", "boat"].includes(category)) {
    if (monthlyIncome > monthlyCost && monthlyIncome > 0) {
      return {
        key: "productive",
        label: "Productive asset",
        summary: "This item is at least covering its carrying cost right now.",
        detail: `It is net positive by about ${formatEuro(monthlyNet)} per month.`,
      };
    }
    return {
      key: "liability",
      label: "Liability drag",
      summary: "TELAJ sees this as a lifestyle or operating item with ongoing cost.",
      detail:
        monthlyCost > 0
          ? `It is draining about ${formatEuro(Math.max(monthlyCost - monthlyIncome, 0))} per month after any income.`
          : "It does not appear to produce income right now.",
    };
  }

  if (category === "property") {
    if (monthlyNet > 0 && leverageRatio <= 0.75) {
      return {
        key: "productive",
        label: "Productive asset",
        summary: "This property is currently adding cash flow to the system.",
        detail: `It is net positive by about ${formatEuro(monthlyNet)} per month.`,
      };
    }
    if (monthlyIncome <= 0 && monthlyCost > 0) {
      return {
        key: "liability",
        label: "Liability drag",
        summary: "This property is carrying cost without producing income.",
        detail: `It is draining about ${formatEuro(monthlyCost)} per month before major repairs or taxes.`,
      };
    }
    return {
      key: "neutral",
      label: "Neutral holding",
      summary: "This property is not clearly helping or hurting cash flow yet.",
      detail:
        leverageRatio > 0.75
          ? "Debt is still heavy relative to value, so TELAJ would monitor it closely."
          : "The item may still be strategically valuable, but the cash outcome is mixed.",
    };
  }

  if (monthlyNet > 0) {
    return {
      key: "productive",
      label: "Productive asset",
      summary: "This item is contributing more cash than it consumes.",
      detail: `It is net positive by about ${formatEuro(monthlyNet)} per month.`,
    };
  }

  if (monthlyCost > monthlyIncome || debt > 0) {
    return {
      key: "liability",
      label: "Liability drag",
      summary: "This item is consuming flexibility faster than it is producing value.",
      detail:
        monthlyCost > 0
          ? `It is draining about ${formatEuro(Math.max(monthlyCost - monthlyIncome, 0))} per month.`
          : `It carries ${formatEuro(debt)} of debt without visible income support.`,
    };
  }

  return {
    key: "neutral",
    label: "Neutral holding",
    summary: "This item looks mostly stable, but its role is not clearly productive yet.",
    detail: "TELAJ would keep it on the sheet, but not count on it for cash flow.",
  };
}

function createRecurringExpenseItem(kind = "household") {
  return {
    id: `expense-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    category: kind,
    label:
      kind === "subscription"
        ? "Subscription"
        : kind === "property"
          ? "Property carrying cost"
          : kind === "insurance"
            ? "Insurance"
            : "Recurring expense",
    amount: 0,
    frequency: "monthly",
    linkedAsset: "",
    required: true,
    note: "",
  };
}

function summarizeRecurringExpenses(items) {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems.reduce(
    (summary, item) => {
      const amount = Number(item.amount || 0);
      const monthlyEquivalent =
        item.frequency === "yearly" ? amount / 12 : item.frequency === "quarterly" ? amount / 3 : amount;
      summary.monthlyTotal += monthlyEquivalent;
      if (item.required) {
        summary.requiredMonthly += monthlyEquivalent;
      } else {
        summary.optionalMonthly += monthlyEquivalent;
      }
      summary.count += 1;
      return summary;
    },
    {
      count: 0,
      monthlyTotal: 0,
      requiredMonthly: 0,
      optionalMonthly: 0,
    }
  );
}

function createVaultDocument(kind = "property") {
  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    category: kind,
    title:
      kind === "property"
        ? "Property deed"
        : kind === "identity"
          ? "Identity document"
          : kind === "insurance"
            ? "Insurance policy"
            : "Critical document",
    owner: "",
    storageLocation: "",
    digitalLocation: "",
    critical: true,
    accessNote: "",
  };
}

function summarizeVault(documents) {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  return {
    total: safeDocuments.length,
    critical: safeDocuments.filter((item) => item.critical).length,
    missingLocation: safeDocuments.filter((item) => !item.storageLocation && !item.digitalLocation).length,
  };
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

function getHomeDecisionData() {
  const advice = getFinancialAllocationAdvice();
  const position = getFinancialPosition();
  const reserveMonths = calculateLiquidityMonths();
  const reserveTargetMonths = advice.reserveTargetMonths || (state.liquidityDetails.monthlyNeed > 0 ? 6 : 0);
  const reserveGap = Math.max((reserveTargetMonths || 0) - reserveMonths, 0);

  const whereIStand =
    state.homeApi.whereIStand || {
      balanceSheet: {
        totalAssets: position.totalAssets,
        totalDebt: position.totalDebt,
        netWorth: position.netWorth,
        opinion: position.opinion,
      },
      liquidityState: {
        reserveMonths,
        reserveTargetMonths,
        reserveGap,
        liquidityPosture: reserveMonths >= 6 ? "stable" : reserveMonths >= 3 ? "watchful" : "fragile",
        summary:
          reserveMonths >= 6
            ? "Your reserve coverage is in a healthier range. TELAJ can be more deliberate with the next dollar."
            : reserveMonths >= 3
              ? "Your reserve buffer exists, but it still deserves respect before extra risk."
              : "Your reserve coverage is still thin, so protection comes before ambition.",
      },
    };

  const biggestIssue =
    state.homeApi.biggestIssue || {
      biggestIssue: {
        headline: advice.headline,
        score: state.financialPosition.creditCardDebt > 0 ? 90 : reserveGap > 0 ? 78 : 58,
        reasons: advice.reasons,
      },
    };

  const todayMove =
    state.homeApi.todayMove || {
      todayMove: {
        headline: advice.headline,
        signal: advice.primaryAction,
        primaryAction: advice.primaryAction,
        why: advice.summary,
        whatCouldGoWrong: advice.watchout,
        saferOption: advice.secondaryAction,
        confidence: state.financialPosition.creditCardDebt > 0 ? 90 : reserveGap > 0 ? 82 : 74,
        timeHorizon: state.financialPosition.creditCardDebt > 0 ? "0-3 months" : reserveGap > 0 ? "1-6 months" : "3-12 months",
        reasons: advice.reasons,
      },
    };

  const actionPlan =
    state.homeApi.actionPlan || {
      actionPlan: {
        headline: advice.headline,
        summary: advice.summary,
        primaryAction: advice.primaryAction,
        secondaryAction: advice.secondaryAction,
        growthSleeve: advice.growthSleeve,
        watchout: advice.watchout,
        plainEnglish: advice.plainEnglish,
        reasons: advice.reasons,
        steps: advice.plan.slice(0, 3).map((item) => ({
          label: item.label,
          percent: item.percent,
          amount: item.amount,
          note: item.note,
        })),
      },
    };

  return {
    whereIStand,
    biggestIssue,
    todayMove,
    actionPlan,
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

function getRetirementPriorityAdvice() {
  const answers = state.onboarding.answers || {};
  const reserveMonths = calculateLiquidityMonths();
  const hasExpensiveDebt = Number(state.financialPosition.creditCardDebt || 0) > 0;
  const liquidCash = Number(state.liquidityDetails.liquidAssets || 0);
  const retirementAssets = Number(state.financialPosition.retirement || 0);
  const marketFocus = answers.marketFocus || state.marketRegion || "US";
  const userCountry = answers.userCountry || "other";
  const isUS = marketFocus === "US" || userCountry === "us";
  const regionLabel = isUS ? "US retirement wrappers" : "European pension priorities";

  if (liquidCash <= 0) {
    return {
      label: regionLabel,
      headline: "Finish mapping cash flow before TELAJ pushes retirement optimization",
      summary: "TELAJ should know your liquid position first, because retirement advice only makes sense once reserve and debt pressure are clear.",
      priorities: [
        "Map liquid cash and monthly need first.",
        "Keep retirement optimization behind a visible reserve target.",
        "Do not confuse long-term wrappers with emergency liquidity.",
      ],
      watchout: "Using retirement accounts to feel productive while the balance sheet is still unclear.",
    };
  }

  if (hasExpensiveDebt || reserveMonths < 3) {
    return {
      label: regionLabel,
      headline: "Retirement wrappers matter, but repair and liquidity come first",
      summary: "TELAJ does not want to maximize retirement contributions while expensive debt or a thin reserve can still destabilize the whole system.",
      priorities: isUS
        ? [
            "Take only the minimum 401(k) employer match if available.",
            "Build reserve strength and reduce credit card drag before extra taxable or retirement reach.",
            "Delay aggressive Roth IRA funding until the balance sheet is steadier.",
          ]
        : [
            "Keep core pension contributions active if they are standard or employer-linked.",
            "Prioritize reserve strength and debt repair before stretching into optional pension wrappers.",
            "Use retirement products only after the liquidity base is real.",
          ],
      watchout: "Overfunding long-duration retirement wrappers while short-term fragility is still active.",
    };
  }

  if (isUS) {
    return {
      label: regionLabel,
      headline: "TELAJ would review 401(k) match and Roth IRA before extra taxable investing",
      summary: "Once reserve and debt are under control, the usual next-dollar order is employer match first, then retirement wrapper quality, then taxable brokerage exposure.",
      priorities: [
        "Capture the full 401(k) match before adding more optional taxable risk.",
        "Review whether Roth IRA or traditional tax treatment fits your income and time horizon better.",
        `Treat your current retirement base of ${formatEuro(retirementAssets)} as part of the long-duration sleeve, not separate from the main plan.`,
      ],
      watchout: "Buying more taxable ETFs while free employer match or cleaner retirement-tax treatment is still unused.",
    };
  }

  return {
    label: regionLabel,
    headline: "TELAJ would review pension funds and local retirement wrappers before extra taxable reach",
    summary: "For European users, retirement decisions are more jurisdiction-specific, but pension wrappers and employer-linked plans still deserve review before extra optional investing.",
    priorities: [
      "Check employer or occupational pension contributions first.",
      "Review whether local retirement wrappers or pension funds offer better long-term treatment than standard taxable investing.",
      `Treat the existing retirement sleeve of ${formatEuro(retirementAssets)} as long-duration capital that should be coordinated with ETFs, reserves, and property.`,
    ],
    watchout: "Ignoring country-specific pension advantages and going straight to generic taxable investing.",
  };
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
  const { todayMove, biggestIssue } = getHomeDecisionData();
  const move = todayMove.todayMove;
  const issue = biggestIssue.biggestIssue;
  const actionState = move.actionState || null;
  const priorBehavior = move.priorBehavior || null;
  const hero = document.getElementById("morning-hero");
  hero.innerHTML = `
    <div class="decision-hero-layout decision-hero-surface">
      <div class="decision-hero-head">
        <div class="signal-topline">
          <div class="signal-live"><span class="live-dot"></span> Today's move</div>
          <div class="task-pill">${move.confidence}% confidence</div>
        </div>
        ${priorBehavior?.message ? `<div class="decision-memory-line">${priorBehavior.message}</div>` : ""}
        <h2 class="signal-title"><span id="today-move-title"></span></h2>
        <p class="signal-rationale"><span id="today-move-why"></span></p>
      </div>
      <div class="decision-meta-line">
        <span>${move.confidence}% confidence</span>
        <span>·</span>
        <span>${move.timeHorizon}</span>
      </div>
      ${
        actionState
          ? `
            <div class="decision-action-state">
              <div class="task-pill">${capitalizeWords(actionState.status)}</div>
              <div class="panel-copy"><span id="today-move-status-text"></span></div>
            </div>
          `
          : `
            <div class="action-row home-hero-actions">
              <button class="action-button primary" id="signal-execute">Execute</button>
              <button class="action-button" id="signal-simulate">Simulate</button>
              <button class="ghost-button" id="signal-skip">Not now</button>
            </div>
          `
      }
      <details class="decision-details">
        <summary>See why TELAJ is leaning this way</summary>
        <div class="decision-summary-grid">
          <div class="decision-summary-card">
            <div class="micro-label">Why this matters</div>
            <h3><span id="today-move-issue"></span></h3>
            <div class="issue-score">Issue score ${issue.score}/100</div>
            <div class="decision-reason-list">
              ${(issue.reasons || []).slice(0, 3).map((reason) => `<div class="financial-reason">${reason}</div>`).join("")}
            </div>
          </div>
          <div class="decision-summary-card">
            <div class="micro-label">What could go wrong</div>
            <div class="panel-copy">${move.whatCouldGoWrong}</div>
          </div>
          <div class="decision-summary-card">
            <div class="micro-label">Safer option</div>
            <div class="panel-copy">${move.saferOption}</div>
          </div>
        </div>
      </details>
    </div>
  `;

  applyTypewriterEffect(document.getElementById("today-move-title"), move.signal || move.headline, {
    key: `today-move-title:${move.decisionKey || move.signal || move.headline}`,
    speed: 18,
    delay: 360,
  });
  applyTypewriterEffect(document.getElementById("today-move-why"), move.why, {
    key: `today-move-why:${move.decisionKey || move.signal || move.headline}`,
    speed: 20,
    delay: 520,
    cursor: false,
  });
  if (actionState?.message) {
    applyTypewriterEffect(document.getElementById("today-move-status-text"), actionState.message, {
      key: `today-move-status:${move.decisionKey || move.signal || move.headline}:${actionState.status}`,
      speed: 18,
      delay: 160,
      cursor: false,
    });
  }

  const decisionDetails = hero.querySelector(".decision-details");
  decisionDetails?.addEventListener("toggle", () => {
    if (decisionDetails.open) {
      applyTypewriterEffect(document.getElementById("today-move-issue"), issue.headline, {
        key: `today-move-issue:${move.decisionKey || move.signal || move.headline}`,
        speed: 18,
        delay: 120,
      });
    }
  });

  document.getElementById("signal-execute")?.addEventListener("click", async () => {
    try {
      playButtonSound("execute");
      const payload = await recordTodayMoveAction("execute");
      if (payload?.actionState) {
        state.homeApi.todayMove = {
          ...(state.homeApi.todayMove || {}),
          todayMove: {
            ...(state.homeApi.todayMove?.todayMove || move),
            actionState: payload.actionState,
            priorBehavior: null,
          },
        };
      }
      renderMorningHero();
    } catch (error) {
      console.warn("TELAJ could not record execute action.", error);
    }
  });
  document.getElementById("signal-simulate")?.addEventListener("click", async () => {
    try {
      playButtonSound("simulate");
      const payload = await recordTodayMoveAction("simulate");
      if (payload?.actionState) {
        state.homeApi.todayMove = {
          ...(state.homeApi.todayMove || {}),
          todayMove: {
            ...(state.homeApi.todayMove?.todayMove || move),
            actionState: payload.actionState,
            priorBehavior: null,
          },
        };
      }
      renderMorningHero();
      document.getElementById("allocation-snapshot")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.warn("TELAJ could not record simulate action.", error);
    }
  });
  document.getElementById("signal-skip")?.addEventListener("click", async () => {
    try {
      const payload = await recordTodayMoveAction("skip");
      if (payload?.actionState) {
        state.homeApi.todayMove = {
          ...(state.homeApi.todayMove || {}),
          todayMove: {
            ...(state.homeApi.todayMove?.todayMove || move),
            actionState: payload.actionState,
            priorBehavior: null,
          },
        };
      }
      renderMorningHero();
    } catch (error) {
      console.warn("TELAJ could not record skipped action.", error);
    }
  });
}

function renderSystemHealth() {
  const panel = document.getElementById("system-health");
  if (!panel) {
    return;
  }
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
    <h3>Decision context</h3>
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
        <div class="panel-copy">${profiles.householdProfile.userCountry} | Age ${profiles.householdProfile.age || "--"} | Income ${formatEuro(profiles.householdProfile.monthlyIncome || 0)} / mo</div>
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
    <div class="meta-line">Sound <button class="subtle-toggle" id="sound-toggle" type="button">${state.sound.enabled ? "On" : "Off"}</button></div>
  `;
  document.getElementById("sound-toggle")?.addEventListener("click", async () => {
    state.sound.enabled = !state.sound.enabled;
    persistSoundPreference();
    if (state.sound.enabled) {
      await soundEngine?.unlock?.();
      playButtonSound("simulate");
    }
    renderRailFooter();
  });
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
  const { actionPlan } = getHomeDecisionData();
  const plan = actionPlan.actionPlan;
  const steps = (plan.steps || []).slice(0, 3);
  panel.innerHTML = `
    <div class="eyebrow">Action plan</div>
    <h3 class="secondary-panel-title">Next 3 steps</h3>
    <div class="minimal-step-list">
      ${steps
        .map(
          (step, index) => `
            <div class="minimal-step">
              <div class="minimal-step-index">${index + 1}</div>
              <div>
                <div class="minimal-step-title">${step.label}</div>
                <div class="panel-copy">${step.note}</div>
              </div>
              <div class="minimal-step-meta">${step.percent}%</div>
            </div>
          `
        )
        .join("")}
    </div>
    <div class="action-plan-risk">
      <div class="micro-label">Main risk</div>
      <div class="panel-copy">${plan.watchout}</div>
    </div>
  `;
}

function renderFinancialPosition() {
  const panel = document.getElementById("financial-position");
  if (!panel) {
    return;
  }

  const position = getFinancialPosition();
  const { whereIStand } = getHomeDecisionData();
  const balanceSheet = whereIStand.balanceSheet;
  const liquidityState = whereIStand.liquidityState;

  panel.innerHTML = `
    <div class="eyebrow">Your position</div>
    <h3 class="secondary-panel-title">Compact financial snapshot</h3>
    <div class="financial-summary minimal-balance-summary compact-position-grid">
      <div class="stat-box">
        <div class="stat-label">Net worth</div>
        <div class="stat-value accent-text">${formatEuro(balanceSheet.netWorth || 0)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Reserve</div>
        <div class="stat-value">${
          Number.isFinite(liquidityState.reserveMonths) && liquidityState.reserveMonths > 0
            ? `${Number(liquidityState.reserveMonths).toFixed(1)} months`
            : "Map expenses"
        }</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Liquidity posture</div>
        <div class="stat-value">${capitalizeWords(liquidityState.liquidityPosture || "unknown")}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Debt</div>
        <div class="stat-value">${formatEuro(balanceSheet.totalDebt || 0)}</div>
      </div>
    </div>
    <p class="body-copy position-summary-copy">${liquidityState.summary || balanceSheet.opinion || position.opinion}</p>
    <div class="position-utility-row">
      <div class="position-utility-copy">
        <div class="utility-meta utility-status">${state.syncStatus.financialPosition}</div>
        <div class="utility-meta utility-detail">${state.syncStatus.financialPositionDetail}</div>
      </div>
      <div class="position-utility-actions">
        ${state.auth.authenticated ? `<button class="ghost-button subtle-utility-button" id="financial-refresh">Sync from cloud</button>` : ""}
        <button class="action-button subtle-action-button" id="position-edit-toggle">Edit your numbers</button>
      </div>
    </div>
    <details class="position-editor" id="position-editor" ${state.syncStatus.financialPosition === "No cloud record yet" ? "open" : ""}>
      <summary>Financial inputs</summary>
      <div class="position-editor-intro">Update the numbers TELAJ uses to generate today's move.</div>
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
        <button class="action-button" id="financial-go-allocation">Refresh today's move</button>
      </div>
      </div>
    </details>
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

  document.getElementById("position-edit-toggle")?.addEventListener("click", () => {
    const editor = document.getElementById("position-editor");
    if (!(editor instanceof HTMLDetailsElement)) {
      return;
    }
    editor.open = !editor.open;
    if (editor.open) {
      document.getElementById("fp-liquid")?.focus();
      editor.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
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
    await loadHomeDecisionState();
    renderAll();
  });
  document.getElementById("financial-go-allocation").addEventListener("click", async () => {
    await loadHomeDecisionState();
    renderAll();
    document.getElementById("morning-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("financial-refresh")?.addEventListener("click", async () => {
    await loadFinancialPositionFromApi();
    await loadHomeDecisionState();
    renderAll();
  });
}

function renderCashStatus() {
  const panel = document.getElementById("cash-status");
  if (!panel) {
    return;
  }
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

function renderAssetsArea() {
  const ledgerPanel = document.getElementById("assets-ledger");
  const summaryPanel = document.getElementById("assets-balance-summary");
  if (!ledgerPanel || !summaryPanel) {
    return;
  }

  const position = getFinancialPosition();
  const reserveMonths = calculateLiquidityMonths();
  const ledgerItems = state.assetLedger.items || [];
  const ledgerSummary = summarizeAssetLedger(ledgerItems);
  const ledgerVerdicts = ledgerItems.map((item) => classifyAssetLedgerItem(item));
  const productiveCount = ledgerVerdicts.filter((item) => item.key === "productive").length;
  const liabilityCount = ledgerVerdicts.filter((item) => item.key === "liability").length;

  ledgerPanel.innerHTML = `
    <div class="eyebrow">Asset inputs</div>
    <h3>Tell TELAJ what you actually own and owe</h3>
    <div class="panel-copy">This is the source layer for TELAJ's decisions. Update assets, liabilities, and carrying costs here, then let the engine recalculate.</div>
    <div class="asset-save-bar">
      <div>
        <div class="micro-label">Save and recalculate</div>
        <div class="panel-copy">Save this asset record after changes so TELAJ can use the latest numbers.</div>
      </div>
      <div class="asset-save-actions">
        <button class="action-button primary" id="assets-save">Save to TELAJ</button>
        <button class="action-button" id="assets-refresh-decision">Refresh TELAJ decision</button>
      </div>
    </div>
    <div class="input-stack financial-input-stack">
      <label class="input-field">
        <span class="micro-label">Liquid cash</span>
        <input id="asset-liquid" type="number" min="0" step="1000" value="${state.liquidityDetails.liquidAssets}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Monthly financial need</span>
        <input id="asset-monthly-need" type="number" min="0" step="100" value="${state.liquidityDetails.monthlyNeed}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Investments</span>
        <input id="asset-investments" type="number" min="0" step="1000" value="${state.financialPosition.investments}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Retirement</span>
        <input id="asset-retirement" type="number" min="0" step="1000" value="${state.financialPosition.retirement}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Business assets</span>
        <input id="asset-business" type="number" min="0" step="1000" value="${state.financialPosition.business}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Credit card debt</span>
        <input id="asset-credit-card" type="number" min="0" step="100" value="${state.financialPosition.creditCardDebt}" />
      </label>
      <div class="insight-card">
        <div class="micro-label">Real estate from itemized ledger</div>
        <div class="panel-copy">${formatEuro(ledgerSummary.propertyValue)}</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">Mortgage debt from itemized ledger</div>
        <div class="panel-copy">${formatEuro(ledgerSummary.propertyDebt)}</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">Other debt from itemized ledger</div>
        <div class="panel-copy">${formatEuro(ledgerSummary.otherDebt)}</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">Monthly carrying cost</div>
        <div class="panel-copy">${formatEuro(ledgerSummary.monthlyCarryingCost)} / mo</div>
      </div>
    </div>
    <div class="section-spacer"></div>
    <div class="eyebrow">Itemized assets and liabilities</div>
    <div class="panel-copy">Record each property, car, aircraft or vessel, or costly liability with value, debt, and monthly cost so TELAJ understands what each item really carries.</div>
    <div class="property-action-row ledger-add-row">
      <button class="action-button" id="asset-add-property">Add property</button>
      <button class="action-button" id="asset-add-car">Add car</button>
      <button class="action-button" id="asset-add-aircraft">Add aircraft or vessel</button>
      <button class="ghost-button" id="asset-add-liability">Add liability</button>
    </div>
    <div class="asset-ledger-list">
      ${
        ledgerItems.length
          ? ledgerItems
              .map(
                (item, index) => {
                  const verdict = classifyAssetLedgerItem(item);
                  return `
                  <div class="asset-ledger-item" data-asset-index="${index}" data-asset-id="${item.id || ""}">
                    <div class="asset-ledger-head">
                      <div>
                        <div class="row-label">${item.label || "Unnamed item"}</div>
                        <div class="history-meta">${capitalizeWords(item.category)} · ${item.status || "active"}</div>
                      </div>
                      <button class="ghost-button asset-remove-button" data-remove-asset="${index}">Remove</button>
                    </div>
                    <div class="input-stack financial-input-stack">
                      <label class="input-field">
                        <span class="micro-label">Type</span>
                        <select class="asset-item-category">
                          <option value="property" ${item.category === "property" ? "selected" : ""}>Property</option>
                          <option value="car" ${item.category === "car" ? "selected" : ""}>Car</option>
                          <option value="aircraft" ${item.category === "aircraft" ? "selected" : ""}>Aircraft</option>
                          <option value="boat" ${item.category === "boat" ? "selected" : ""}>Vessel</option>
                          <option value="liability" ${item.category === "liability" ? "selected" : ""}>Liability</option>
                          <option value="other" ${item.category === "other" ? "selected" : ""}>Other</option>
                        </select>
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Name</span>
                        <input class="asset-item-label" type="text" value="${item.label || ""}" placeholder="Lake house, Porsche, Cessna, tax debt" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Status</span>
                        <input class="asset-item-status" type="text" value="${item.status || ""}" placeholder="not-rented, primary-home, financed, active" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Estimated value</span>
                        <input class="asset-item-value" type="number" min="0" step="1000" value="${Number(item.estimatedValue || 0)}" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Debt on this item</span>
                        <input class="asset-item-debt" type="number" min="0" step="1000" value="${Number(item.debt || 0)}" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Monthly cost</span>
                        <input class="asset-item-monthly-cost" type="number" min="0" step="50" value="${Number(item.monthlyCost || 0)}" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Monthly income</span>
                        <input class="asset-item-monthly-income" type="number" min="0" step="50" value="${Number(item.monthlyIncome || 0)}" />
                      </label>
                      <label class="input-field input-span-2">
                        <span class="micro-label">Notes</span>
                        <input class="asset-item-note" type="text" value="${item.note || ""}" placeholder="Property taxes, maintenance, hangar, insurance, HOA, no rental income" />
                      </label>
                    </div>
                    <div class="asset-verdict asset-verdict-${verdict.key}">
                      <div class="asset-verdict-head">
                        <span class="micro-label">TELAJ verdict</span>
                        <span class="asset-verdict-pill">${verdict.label}</span>
                      </div>
                      <div class="panel-copy">${verdict.summary}</div>
                      <div class="history-meta">${verdict.detail}</div>
                    </div>
                  </div>
                `
                }
              )
              .join("")
          : `<div class="subpanel"><div class="panel-copy">No itemized holdings yet. Add a property, car, aircraft or vessel, or liability so TELAJ can track its value and carrying cost.</div></div>`
      }
    </div>
    <div class="property-action-row asset-save-footer">
      <button class="action-button primary" id="assets-save-bottom">Save to TELAJ</button>
      <button class="ghost-button" id="assets-refresh-decision-bottom">Refresh TELAJ decision</button>
    </div>
  `;

  summaryPanel.innerHTML = `
    <div class="eyebrow">Balance sheet summary</div>
    <h3>What TELAJ sees right now</h3>
    <div class="stats-grid compact-position-grid">
      <div class="stat-box">
        <div class="stat-label">Net worth</div>
        <div class="stat-value">${formatEuro(position.netWorth)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Total assets</div>
        <div class="stat-value">${formatEuro(position.totalAssets)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Total debt</div>
        <div class="stat-value">${formatEuro(position.totalDebt)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Reserve</div>
        <div class="stat-value">${reserveMonths > 0 ? `${reserveMonths.toFixed(1)} months` : "Map expenses"}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Itemized cost</div>
        <div class="stat-value">${formatEuro(ledgerSummary.monthlyCarryingCost)} / mo</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Itemized income</div>
        <div class="stat-value">${formatEuro(ledgerSummary.monthlyAssetIncome)} / mo</div>
      </div>
    </div>
    <div class="section-spacer"></div>
    <div class="micro-label">Asset mix</div>
    <div class="financial-legend">
      ${position.assets.length
        ? position.assets
            .map(
              (item) => `
                <div class="legend-item">
                  <span class="legend-swatch" style="background:${item.color}"></span>
                  <span>${item.label}</span>
                  <span class="legend-value">${formatEuro(item.value)}</span>
                </div>
              `
            )
            .join("")
        : `<div class="panel-copy">No assets mapped yet. Start with liquid cash and investments.</div>`}
    </div>
    <div class="section-spacer"></div>
    <div class="micro-label">Itemized ledger view</div>
    <div class="financial-legend">
      <div class="legend-item"><span>Property value</span><span class="legend-value">${formatEuro(ledgerSummary.propertyValue)}</span></div>
      <div class="legend-item"><span>Property debt</span><span class="legend-value">${formatEuro(ledgerSummary.propertyDebt)}</span></div>
      <div class="legend-item"><span>Cars / aircraft / vessels / costly items</span><span class="legend-value">${formatEuro(ledgerSummary.vehicleAndLuxuryValue)}</span></div>
      <div class="legend-item"><span>Net monthly drag</span><span class="legend-value">${formatEuro(ledgerSummary.netItemCashDrag)} / mo</span></div>
      <div class="legend-item"><span>Productive items</span><span class="legend-value">${productiveCount}</span></div>
      <div class="legend-item"><span>Liability drags</span><span class="legend-value">${liabilityCount}</span></div>
    </div>
  `;

  const handleAssetsSave = async () => {
    state.assetLedger.items = Array.from(ledgerPanel.querySelectorAll(".asset-ledger-item")).map((row) => ({
      id: row.dataset.assetId || createAssetLedgerItem().id,
      category: row.querySelector(".asset-item-category")?.value || "property",
      label: row.querySelector(".asset-item-label")?.value.trim() || "Unnamed item",
      status: row.querySelector(".asset-item-status")?.value.trim() || "active",
      estimatedValue: Number(row.querySelector(".asset-item-value")?.value || 0),
      debt: Number(row.querySelector(".asset-item-debt")?.value || 0),
      monthlyCost: Number(row.querySelector(".asset-item-monthly-cost")?.value || 0),
      monthlyIncome: Number(row.querySelector(".asset-item-monthly-income")?.value || 0),
      note: row.querySelector(".asset-item-note")?.value.trim() || "",
    }));
    const nextLedgerSummary = summarizeAssetLedger(state.assetLedger.items);
    state.liquidityDetails.liquidAssets = Number(document.getElementById("asset-liquid").value || 0);
    state.liquidityDetails.monthlyNeed = Number(document.getElementById("asset-monthly-need").value || 0);
    state.financialPosition.investments = Number(document.getElementById("asset-investments").value || 0);
    state.financialPosition.retirement = Number(document.getElementById("asset-retirement").value || 0);
    state.financialPosition.realEstate = nextLedgerSummary.propertyValue;
    state.financialPosition.business = Number(document.getElementById("asset-business").value || 0);
    state.financialPosition.creditCardDebt = Number(document.getElementById("asset-credit-card").value || 0);
    state.financialPosition.loans = nextLedgerSummary.otherDebt;
    state.financialPosition.mortgageDebt = nextLedgerSummary.propertyDebt;
    persistWealthInputs();
    await saveFinancialPositionToApi();
    await loadHomeDecisionState();
    renderAll();
  };

  document.getElementById("assets-save")?.addEventListener("click", handleAssetsSave);
  document.getElementById("assets-save-bottom")?.addEventListener("click", handleAssetsSave);

  document.getElementById("asset-add-property")?.addEventListener("click", () => {
    state.assetLedger.items.push(createAssetLedgerItem("property"));
    persistWealthInputs();
    renderAssetsArea();
  });
  document.getElementById("asset-add-car")?.addEventListener("click", () => {
    state.assetLedger.items.push(createAssetLedgerItem("car"));
    persistWealthInputs();
    renderAssetsArea();
  });
  document.getElementById("asset-add-aircraft")?.addEventListener("click", () => {
    state.assetLedger.items.push(createAssetLedgerItem("aircraft"));
    persistWealthInputs();
    renderAssetsArea();
  });
  document.getElementById("asset-add-liability")?.addEventListener("click", () => {
    state.assetLedger.items.push(createAssetLedgerItem("liability"));
    persistWealthInputs();
    renderAssetsArea();
  });
  ledgerPanel.querySelectorAll("[data-remove-asset]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeAsset);
      state.assetLedger.items.splice(index, 1);
      persistWealthInputs();
      renderAssetsArea();
    });
  });

  const handleAssetsRefresh = async () => {
    await loadHomeDecisionState();
    renderAll();
    setView("home");
    document.getElementById("morning-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.getElementById("assets-refresh-decision")?.addEventListener("click", handleAssetsRefresh);
  document.getElementById("assets-refresh-decision-bottom")?.addEventListener("click", handleAssetsRefresh);
}

function renderExpensesArea() {
  const ledgerPanel = document.getElementById("expenses-ledger");
  const summaryPanel = document.getElementById("expenses-summary");
  if (!ledgerPanel || !summaryPanel) {
    return;
  }

  const items = state.recurringExpenses.items || [];
  const summary = summarizeRecurringExpenses(items);

  ledgerPanel.innerHTML = `
    <div class="eyebrow">Recurring expenses</div>
    <h3>Record the bills and subscriptions that quietly drain the system</h3>
    <div class="panel-copy">TELAJ should know the required monthly drag, the optional subscriptions, and which costs belong to a property or costly asset.</div>
    <div class="property-action-row ledger-add-row">
      <button class="action-button" id="expense-add-household">Add household bill</button>
      <button class="action-button" id="expense-add-subscription">Add subscription</button>
      <button class="action-button" id="expense-add-property">Add property cost</button>
      <button class="ghost-button" id="expense-add-insurance">Add insurance</button>
    </div>
    <div class="asset-ledger-list">
      ${
        items.length
          ? items
              .map(
                (item, index) => `
                  <div class="asset-ledger-item" data-expense-index="${index}" data-expense-id="${item.id || ""}">
                    <div class="asset-ledger-head">
                      <div>
                        <div class="row-label">${item.label || "Unnamed expense"}</div>
                        <div class="history-meta">${capitalizeWords(item.category)} · ${item.required ? "Required" : "Optional"}</div>
                      </div>
                      <button class="ghost-button asset-remove-button" data-remove-expense="${index}">Remove</button>
                    </div>
                    <div class="input-stack financial-input-stack">
                      <label class="input-field">
                        <span class="micro-label">Category</span>
                        <select class="expense-item-category">
                          <option value="household" ${item.category === "household" ? "selected" : ""}>Household</option>
                          <option value="subscription" ${item.category === "subscription" ? "selected" : ""}>Subscription</option>
                          <option value="property" ${item.category === "property" ? "selected" : ""}>Property</option>
                          <option value="insurance" ${item.category === "insurance" ? "selected" : ""}>Insurance</option>
                          <option value="debt" ${item.category === "debt" ? "selected" : ""}>Debt payment</option>
                          <option value="other" ${item.category === "other" ? "selected" : ""}>Other</option>
                        </select>
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Name</span>
                        <input class="expense-item-label" type="text" value="${item.label || ""}" placeholder="Property tax, Netflix, insurance, dock fee" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Amount</span>
                        <input class="expense-item-amount" type="number" min="0" step="10" value="${Number(item.amount || 0)}" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Frequency</span>
                        <select class="expense-item-frequency">
                          <option value="monthly" ${item.frequency === "monthly" ? "selected" : ""}>Monthly</option>
                          <option value="quarterly" ${item.frequency === "quarterly" ? "selected" : ""}>Quarterly</option>
                          <option value="yearly" ${item.frequency === "yearly" ? "selected" : ""}>Yearly</option>
                        </select>
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Linked asset</span>
                        <input class="expense-item-linked-asset" type="text" value="${item.linkedAsset || ""}" placeholder="Lake house, boat, family home" />
                      </label>
                      <label class="input-field toggle-card">
                        <span class="micro-label">Required</span>
                        <input class="expense-item-required" type="checkbox" ${item.required ? "checked" : ""} />
                      </label>
                      <label class="input-field input-span-2">
                        <span class="micro-label">Notes</span>
                        <input class="expense-item-note" type="text" value="${item.note || ""}" placeholder="Fixed, seasonal, family support, optional, tax-driven" />
                      </label>
                    </div>
                  </div>
                `
              )
              .join("")
          : `<div class="subpanel"><div class="panel-copy">No recurring expenses recorded yet. Add the most important bills and subscriptions so TELAJ can see the real monthly drag.</div></div>`
      }
    </div>
  `;

  summaryPanel.innerHTML = `
    <div class="eyebrow">Expense summary</div>
    <h3>What the family system costs to carry</h3>
    <div class="stats-grid compact-position-grid">
      <div class="stat-box"><div class="stat-label">Tracked items</div><div class="stat-value">${summary.count}</div></div>
      <div class="stat-box"><div class="stat-label">Monthly total</div><div class="stat-value">${formatEuro(summary.monthlyTotal)} / mo</div></div>
      <div class="stat-box"><div class="stat-label">Required</div><div class="stat-value">${formatEuro(summary.requiredMonthly)} / mo</div></div>
      <div class="stat-box"><div class="stat-label">Optional</div><div class="stat-value">${formatEuro(summary.optionalMonthly)} / mo</div></div>
    </div>
    <div class="section-spacer"></div>
    <div class="micro-label">TELAJ interpretation</div>
    <div class="panel-copy">
      ${
        summary.monthlyTotal > 0
          ? `TELAJ now sees about ${formatEuro(summary.monthlyTotal)} per month of recurring drag before optional new investing decisions.`
          : "TELAJ still needs the major recurring bills mapped before it can fully judge cash-flow pressure."
      }
    </div>
  `;

  document.getElementById("expense-add-household")?.addEventListener("click", () => {
    state.recurringExpenses.items.push(createRecurringExpenseItem("household"));
    persistWealthInputs();
    renderExpensesArea();
  });
  document.getElementById("expense-add-subscription")?.addEventListener("click", () => {
    state.recurringExpenses.items.push(createRecurringExpenseItem("subscription"));
    persistWealthInputs();
    renderExpensesArea();
  });
  document.getElementById("expense-add-property")?.addEventListener("click", () => {
    state.recurringExpenses.items.push(createRecurringExpenseItem("property"));
    persistWealthInputs();
    renderExpensesArea();
  });
  document.getElementById("expense-add-insurance")?.addEventListener("click", () => {
    state.recurringExpenses.items.push(createRecurringExpenseItem("insurance"));
    persistWealthInputs();
    renderExpensesArea();
  });
  ledgerPanel.querySelectorAll("[data-remove-expense]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeExpense);
      state.recurringExpenses.items.splice(index, 1);
      persistWealthInputs();
      renderExpensesArea();
    });
  });
  ledgerPanel.querySelectorAll(".expense-item-label, .expense-item-amount, .expense-item-linked-asset, .expense-item-note, .expense-item-category, .expense-item-frequency, .expense-item-required").forEach((input) => {
    const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(eventName, () => {
      state.recurringExpenses.items = Array.from(ledgerPanel.querySelectorAll(".asset-ledger-item")).map((row) => ({
        id: row.dataset.expenseId || createRecurringExpenseItem().id,
        category: row.querySelector(".expense-item-category")?.value || "household",
        label: row.querySelector(".expense-item-label")?.value.trim() || "Unnamed expense",
        amount: Number(row.querySelector(".expense-item-amount")?.value || 0),
        frequency: row.querySelector(".expense-item-frequency")?.value || "monthly",
        linkedAsset: row.querySelector(".expense-item-linked-asset")?.value.trim() || "",
        required: Boolean(row.querySelector(".expense-item-required")?.checked),
        note: row.querySelector(".expense-item-note")?.value.trim() || "",
      }));
      persistWealthInputs();
      renderExpensesArea();
    });
  });
}

function renderFamilyVault() {
  const docsPanel = document.getElementById("vault-documents");
  const summaryPanel = document.getElementById("vault-summary");
  if (!docsPanel || !summaryPanel) {
    return;
  }

  const documents = state.familyVault.documents || [];
  const summary = summarizeVault(documents);

  docsPanel.innerHTML = `
    <div class="eyebrow">Critical documents</div>
    <h3>Record where the important papers and files actually live</h3>
    <div class="panel-copy">This is the first TELAJ family vault pass: title deeds, insurance, wills, IDs, and other key continuity documents with location and access notes.</div>
    <div class="property-action-row ledger-add-row">
      <button class="action-button" id="vault-add-property">Add property document</button>
      <button class="action-button" id="vault-add-insurance">Add insurance</button>
      <button class="action-button" id="vault-add-identity">Add identity</button>
      <button class="ghost-button" id="vault-add-other">Add critical document</button>
    </div>
    <div class="asset-ledger-list">
      ${
        documents.length
          ? documents
              .map(
                (item, index) => `
                  <div class="asset-ledger-item" data-doc-index="${index}" data-doc-id="${item.id || ""}">
                    <div class="asset-ledger-head">
                      <div>
                        <div class="row-label">${item.title || "Untitled document"}</div>
                        <div class="history-meta">${capitalizeWords(item.category)} · ${item.critical ? "Critical" : "Reference"}</div>
                      </div>
                      <button class="ghost-button asset-remove-button" data-remove-doc="${index}">Remove</button>
                    </div>
                    <div class="input-stack financial-input-stack">
                      <label class="input-field">
                        <span class="micro-label">Category</span>
                        <select class="vault-doc-category">
                          <option value="property" ${item.category === "property" ? "selected" : ""}>Property</option>
                          <option value="insurance" ${item.category === "insurance" ? "selected" : ""}>Insurance</option>
                          <option value="identity" ${item.category === "identity" ? "selected" : ""}>Identity</option>
                          <option value="estate" ${item.category === "estate" ? "selected" : ""}>Estate</option>
                          <option value="tax" ${item.category === "tax" ? "selected" : ""}>Tax</option>
                          <option value="other" ${item.category === "other" ? "selected" : ""}>Other</option>
                        </select>
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Title</span>
                        <input class="vault-doc-title" type="text" value="${item.title || ""}" placeholder="Property deed, will, passport, insurance policy" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Owner / person</span>
                        <input class="vault-doc-owner" type="text" value="${item.owner || ""}" placeholder="Mother, father, family company" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Physical location</span>
                        <input class="vault-doc-storage" type="text" value="${item.storageLocation || ""}" placeholder="Home safe, lawyer, bank box" />
                      </label>
                      <label class="input-field">
                        <span class="micro-label">Digital location</span>
                        <input class="vault-doc-digital" type="text" value="${item.digitalLocation || ""}" placeholder="Drive folder, Dropbox, notary portal" />
                      </label>
                      <label class="input-field toggle-card">
                        <span class="micro-label">Critical</span>
                        <input class="vault-doc-critical" type="checkbox" ${item.critical ? "checked" : ""} />
                      </label>
                      <label class="input-field input-span-2">
                        <span class="micro-label">Access note</span>
                        <input class="vault-doc-access" type="text" value="${item.accessNote || ""}" placeholder="Who knows where it is and how the family should retrieve it" />
                      </label>
                    </div>
                  </div>
                `
              )
              .join("")
          : `<div class="subpanel"><div class="panel-copy">No family-vault documents recorded yet. Add the most important records so the family can find what matters if something happens.</div></div>`
      }
    </div>
  `;

  summaryPanel.innerHTML = `
    <div class="eyebrow">Vault summary</div>
    <h3>Continuity readiness</h3>
    <div class="stats-grid compact-position-grid">
      <div class="stat-box"><div class="stat-label">Tracked docs</div><div class="stat-value">${summary.total}</div></div>
      <div class="stat-box"><div class="stat-label">Critical docs</div><div class="stat-value">${summary.critical}</div></div>
      <div class="stat-box"><div class="stat-label">Missing location</div><div class="stat-value">${summary.missingLocation}</div></div>
    </div>
    <div class="section-spacer"></div>
    <div class="micro-label">TELAJ view</div>
    <div class="panel-copy">
      ${
        summary.total
          ? `${summary.critical} critical documents are recorded. ${summary.missingLocation ? `${summary.missingLocation} still need a clear physical or digital location.` : "The current set has a clear location recorded."}`
          : "TELAJ does not yet know where the family’s critical documents live."
      }
    </div>
  `;

  document.getElementById("vault-add-property")?.addEventListener("click", () => {
    state.familyVault.documents.push(createVaultDocument("property"));
    persistWealthInputs();
    renderFamilyVault();
  });
  document.getElementById("vault-add-insurance")?.addEventListener("click", () => {
    state.familyVault.documents.push(createVaultDocument("insurance"));
    persistWealthInputs();
    renderFamilyVault();
  });
  document.getElementById("vault-add-identity")?.addEventListener("click", () => {
    state.familyVault.documents.push(createVaultDocument("identity"));
    persistWealthInputs();
    renderFamilyVault();
  });
  document.getElementById("vault-add-other")?.addEventListener("click", () => {
    state.familyVault.documents.push(createVaultDocument("other"));
    persistWealthInputs();
    renderFamilyVault();
  });
  docsPanel.querySelectorAll("[data-remove-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeDoc);
      state.familyVault.documents.splice(index, 1);
      persistWealthInputs();
      renderFamilyVault();
    });
  });
  docsPanel.querySelectorAll(".vault-doc-category, .vault-doc-title, .vault-doc-owner, .vault-doc-storage, .vault-doc-digital, .vault-doc-critical, .vault-doc-access").forEach((input) => {
    const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(eventName, () => {
      state.familyVault.documents = Array.from(docsPanel.querySelectorAll(".asset-ledger-item")).map((row) => ({
        id: row.dataset.docId || createVaultDocument().id,
        category: row.querySelector(".vault-doc-category")?.value || "other",
        title: row.querySelector(".vault-doc-title")?.value.trim() || "Untitled document",
        owner: row.querySelector(".vault-doc-owner")?.value.trim() || "",
        storageLocation: row.querySelector(".vault-doc-storage")?.value.trim() || "",
        digitalLocation: row.querySelector(".vault-doc-digital")?.value.trim() || "",
        critical: Boolean(row.querySelector(".vault-doc-critical")?.checked),
        accessNote: row.querySelector(".vault-doc-access")?.value.trim() || "",
      }));
      persistWealthInputs();
      renderFamilyVault();
    });
  });
}

function renderTasks() {
  const panel = document.getElementById("daily-tasks");
  if (!panel) {
    return;
  }
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

function getAssetCheckFallback(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const regionIntel = state.investmentIntel;
  const broadSignal =
    regionIntel.assetSignals.find((item) => ["SPY", "VGK", "EUNL"].includes(item.ticker)) || regionIntel.assetSignals[0];
  const goldSignal = regionIntel.assetSignals.find((item) => item.label.toLowerCase().includes("gold"));
  const reserveSignal =
    regionIntel.assetSignals.find((item) => item.label.toLowerCase().includes("reserve")) ||
    regionIntel.assetSignals.find((item) => item.ticker === "SGOV" || item.ticker === "ERNE");
  const highBetaSignal = regionIntel.assetSignals.find((item) => item.label.toLowerCase().includes("high-beta"));

  if (["gold", "xau", "xauusd", "gld", "sgld"].includes(normalized)) {
    return goldSignal;
  }

  if (["spy", "s&p", "s&p 500", "etf", "broad etf", "index", "vgk", "eunl"].includes(normalized)) {
    return broadSignal;
  }

  if (["sgov", "erne", "treasury", "treasuries", "cash", "short bonds", "short duration"].includes(normalized)) {
    return reserveSignal;
  }

  if (["qqq", "nasdaq", "tech"].includes(normalized)) {
    return highBetaSignal;
  }

  if (["eurusd", "usd", "eur", "gbpusd", "jpy", "currency", "forex"].includes(normalized)) {
    return {
      ticker: normalized.toUpperCase(),
      label: "Currency trade",
      signal: "avoid",
      confidence: 63,
      why: "TELAJ is not built to make fast directional currency calls for the core portfolio. Currency trades are usually weaker than fixing allocation, reserves, or broad exposure.",
      risk: "Short-term FX moves can reverse quickly and are hard to size calmly.",
      safer: "Keep currency exposure tied to travel, business needs, or diversified funds rather than short-term speculation.",
      horizon: "0-3 months",
    };
  }

  if (["oil", "brent", "wti", "commodity", "commodities", "silver"].includes(normalized)) {
    return {
      ticker: normalized.toUpperCase(),
      label: "Cyclical commodity",
      signal: "review carefully",
      confidence: 58,
      why: "Commodity trades can be highly event-driven. TELAJ wants a clearer macro reason before treating them as a strong action call.",
      risk: "Commodities are volatile and often move on supply shocks rather than clean trend logic.",
      safer: "Use a smaller sleeve or stay with gold and broad ETFs unless you have a specific thesis.",
      horizon: "1-6 months",
    };
  }

  const stockMap = {
    aapl: {
      ticker: "AAPL",
      label: "Mega-cap quality",
      signal: "add slowly",
      confidence: 66,
      why: "Apple is usually better treated as a measured quality allocation than a fast trade. TELAJ prefers adding it gradually rather than chasing short-term moves.",
      risk: "A high-quality stock can still be expensive and underperform for long stretches.",
      safer: "Use it as a smaller sleeve around a broad ETF core instead of replacing the core.",
      horizon: "6-18 months",
    },
    apple: "aapl",
    tsla: {
      ticker: "TSLA",
      label: "High-volatility single stock",
      signal: "review carefully",
      confidence: 57,
      why: "Tesla can move on sentiment, execution, and macro conditions quickly. TELAJ does not want it treated like a core holding without a clear reason and position size.",
      risk: "The stock is volatile enough to distort discipline and portfolio sizing.",
      safer: "Keep single-stock exposure small and anchor the main plan in broad ETFs.",
      horizon: "1-12 months",
    },
    tesla: "tsla",
    nvda: {
      ticker: "NVDA",
      label: "Momentum leadership stock",
      signal: "add slowly",
      confidence: 64,
      why: "NVIDIA can justify attention, but TELAJ still prefers disciplined entries because crowded momentum can reverse violently.",
      risk: "High expectations make drawdowns sharper when momentum cools.",
      safer: "Use tranches or broad semiconductor exposure instead of a large one-shot buy.",
      horizon: "3-12 months",
    },
    nvidia: "nvda",
    msft: {
      ticker: "MSFT",
      label: "Quality compounder",
      signal: "add slowly",
      confidence: 68,
      why: "Microsoft fits better as a quality compounding sleeve than a trading vehicle. TELAJ likes measured exposure, not aggressive timing bets.",
      risk: "Even strong businesses can be poor short-term entries if bought without valuation discipline.",
      safer: "Build it as a modest sleeve alongside broad ETFs.",
      horizon: "6-18 months",
    },
    microsoft: "msft",
    meta: {
      ticker: "META",
      label: "Large-cap growth stock",
      signal: "review carefully",
      confidence: 60,
      why: "META can work, but TELAJ sees it as a concentrated growth bet rather than a core allocation.",
      risk: "Single-stock concentration and sentiment swings can overwhelm good fundamentals.",
      safer: "Prefer a broad ETF core unless you have a clear single-name thesis.",
      horizon: "3-12 months",
    },
    amazon: "amzn",
    amzn: {
      ticker: "AMZN",
      label: "Large-cap platform stock",
      signal: "add slowly",
      confidence: 63,
      why: "Amazon can fit a long-term growth sleeve, but TELAJ still wants broad exposure to do most of the heavy lifting.",
      risk: "Execution remains strong, but concentrated single-name bets add avoidable portfolio risk.",
      safer: "Use broad ETFs as the core and keep AMZN as a smaller add-on.",
      horizon: "6-18 months",
    },
    googl: {
      ticker: "GOOGL",
      label: "Quality platform stock",
      signal: "add slowly",
      confidence: 65,
      why: "Alphabet can fit a quality growth sleeve, but TELAJ prefers broad exposure first and individual names second.",
      risk: "Regulatory, AI competition, and sentiment swings can still hit returns.",
      safer: "Keep it as a small sleeve around a diversified core.",
      horizon: "6-18 months",
    },
    google: "googl",
    alphabet: "googl",
  };

  const mappedStock = stockMap[normalized];
  if (typeof mappedStock === "string") {
    return stockMap[mappedStock];
  }
  if (mappedStock) {
    return mappedStock;
  }

  const tapeMatch = state.marketTape.find((item) => item.ticker.toLowerCase() === normalized);
  if (tapeMatch) {
    const positive = tapeMatch.changePct >= 0;
    return {
      ticker: tapeMatch.ticker,
      label: "Market tape mover",
      signal: positive ? "watch" : "review carefully",
      confidence: 55,
      why: `${tapeMatch.ticker} is on the tape because it is moving, but TELAJ does not want to confuse movement with a full investment thesis.`,
      risk: "Fast movers can pull attention toward momentum chasing instead of disciplined allocation.",
      safer: "Use movers as research prompts, not as automatic buys.",
      horizon: "1-5 days",
    };
  }

  return null;
}

function evaluateAssetCheck(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const directMatch = state.investmentIntel.assetSignals.find((item) => {
    const ticker = item.ticker.toLowerCase();
    const label = item.label.toLowerCase();
    return ticker === normalized || label === normalized || label.includes(normalized) || normalized.includes(ticker);
  });

  if (directMatch) {
    return directMatch;
  }

  const fallback = getAssetCheckFallback(normalized);
  if (fallback) {
    return fallback;
  }

  return {
    ticker: normalized.toUpperCase(),
    label: "Unmapped asset",
    signal: "review carefully",
    confidence: 41,
    why: "TELAJ does not have a strong mapped signal for this asset yet, so it should not pretend to know more than it does.",
    risk: "Acting on a weak or unknown signal can turn this into speculation instead of disciplined allocation.",
    safer: "Stay with broad ETFs, gold, reserve assets, or a clearly researched idea until TELAJ has better coverage here.",
    horizon: "Unclear",
  };
}

function renderWatchlist() {
  const panel = document.getElementById("watchlist");
  if (!panel) {
    return;
  }
  const intel = state.investmentIntel;
  const assetResult = state.assetCheck.result;
  const liveRegime = state.marketRegime?.regime ? state.marketRegime : null;
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
    <div class="panel-copy">${liveRegime?.summary || MARKET_REGION_CONFIG[state.marketRegion].label}. TELAJ changes the tape and signal set to match the selected market context.</div>
    <div class="section-spacer"></div>
    <div class="eyebrow">Instant asset check</div>
    <div class="input-stack">
      <label class="input-field input-span-2">
        <span class="micro-label">Ticker or asset</span>
        <input id="asset-check-input" type="text" value="${state.assetCheck.query}" placeholder="SPY, gold, QQQ, treasury, EURUSD" />
      </label>
      <div class="property-action-row input-span-2">
        <button class="action-button primary" id="asset-check-run" ${state.assetCheck.loading ? "disabled" : ""}>${state.assetCheck.loading ? "Checking..." : "Get TELAJ call"}</button>
        <button class="ghost-button" id="asset-check-clear" ${state.assetCheck.loading ? "disabled" : ""}>Clear</button>
      </div>
    </div>
    ${
      assetResult
        ? `
          <div class="subpanel telaj-asset-card">
            <div class="telaj-asset-top">
              <div>
                <div class="row-label">TELAJ asset call</div>
                <h4 class="telaj-asset-name">${assetResult.ticker} · ${assetResult.label}</h4>
                <div class="telaj-asset-opinion">${assetResult.signal.toUpperCase()}</div>
              </div>
              <div class="signal-badge ${assetResult.signal.includes("avoid") ? "warn" : assetResult.signal.includes("hold") || assetResult.signal.includes("review") ? "" : "good"}">${assetResult.confidence}%</div>
            </div>
            <div class="telaj-asset-grid">
              <div class="telaj-asset-price-block">
                <div class="micro-label">Price</div>
                <div class="telaj-asset-price">${formatAssetCheckPrice(assetResult.currentPrice, assetResult.ticker)}</div>
                <div class="history-meta">${assetResult.priceLine || "Live price unavailable right now."}</div>
                ${
                  assetResult.liveError
                    ? `<div class="history-meta">Live data error: ${assetResult.liveError}</div>`
                    : ""
                }
                ${
                  assetResult.source
                    ? `<div class="history-meta">Source ${assetResult.source}</div>`
                    : ""
                }
              </div>
              <div class="telaj-asset-candles-block">
                <div class="micro-label">Recent price action</div>
                ${
                  Array.isArray(assetResult.candles) && assetResult.candles.length
                    ? `
                      <div class="mini-candle-strip telaj-candle-strip">
                        ${assetResult.candles
                          .map((bar) => {
                            const direction = bar.close >= bar.open ? "up" : "down";
                            const body = Math.max(8, Math.min(26, Math.round((Math.abs(bar.close - bar.open) / Math.max(bar.close, 0.0001)) * 180)));
                            const wick = Math.max(18, Math.min(38, Math.round(((bar.high - bar.low) / Math.max(bar.close, 0.0001)) * 160)));
                            return `<span class="mini-candle ${direction}" style="--body:${body}px; --wick:${wick}px"></span>`;
                          })
                          .join("")}
                      </div>
                      <div class="history-meta">Green means the asset finished the day higher. Yellow means it finished lower.</div>
                      <div class="panel-copy telaj-candle-summary">${describeRecentPriceAction(assetResult.candles)}</div>
                    `
                    : `<div class="history-meta">Recent candle data is not available yet.</div>`
                }
              </div>
            </div>
            <div class="telaj-asset-opinion-block">
              <div class="micro-label">TELAJ opinion</div>
              <div class="panel-copy">${assetResult.why}</div>
              ${
                assetResult.newsSummary
                  ? `<div class="history-meta">${assetResult.newsSummary}</div>`
                  : ""
              }
              <div class="history-meta">Match ${assetResult.matchScore || "--"} · Model ${assetResult.modelScore || "--"} · Risk ${assetResult.risk} · Safer option ${assetResult.safer} · Horizon ${assetResult.horizon}</div>
            </div>
            ${
              state.auth.authenticated && assetResult.currentPrice
                ? `<div class="property-action-row compact-track-row"><button class="action-button" id="asset-track-run">Track 10k paper</button><div class="history-meta">TELAJ will track what 10k would have done from this signal.</div></div>`
                : ""
            }
          </div>
        `
        : `
          <div class="subpanel">
            <div class="micro-label">How this works</div>
            <div class="panel-copy">Type a stock, ETF, commodity, or currency and TELAJ will give a quick call using the current region context, the live signal stack, and the asset-check route when available.</div>
          </div>
        `
    }
    ${state.assetCheck.error ? `<div class="history-meta">${state.assetCheck.error}. TELAJ used the local fallback.</div>` : ""}
    ${
      state.assetTracks.items.length
        ? `
          <div class="section-spacer"></div>
          <div class="eyebrow">Tracked signal outcomes</div>
          <div class="history-meta">Success rate ${Math.round(state.assetTracks.summary.successRate || 0)}% · ${state.assetTracks.summary.trackedCount} tracked ideas</div>
          <div class="history-list">
            ${state.assetTracks.items
              .slice(0, 4)
              .map(
                (item) => `
                  <div class="history-item">
                    <div class="history-top">
                      <div>
                        <div class="row-label">${item.symbol} · ${item.label}</div>
                        <div>${item.signal.toUpperCase()}</div>
                      </div>
                      <div class="signal-badge ${item.pnl >= 0 ? "good" : "warn"}">${item.pnl >= 0 ? "+" : ""}${item.pnlPct.toFixed(1)}%</div>
                    </div>
                    <div class="history-meta">If you had put 10k into ${item.symbol} on ${new Date(item.trackedAt).toLocaleDateString()}, it would now be ${item.pnl >= 0 ? "up" : "down"} ${Math.abs(item.pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}.</div>
                    <div class="history-meta">Entry ${item.entryPrice.toFixed(2)} · Current ${item.currentPrice.toFixed(2)} · Status ${item.status}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        `
        : ""
    }
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
    state.assetCheck.result = evaluateAssetCheck(state.assetCheck.query);
    loadMarketRegime().then(() => {
      renderWatchlist();
      renderSignalsView();
    });
    renderWatchlist();
  });
  document.getElementById("asset-check-run")?.addEventListener("click", async () => {
    state.assetCheck.query = document.getElementById("asset-check-input")?.value.trim() || "";
    state.assetCheck.loading = true;
    renderWatchlist();
    state.assetCheck.result = await requestAssetCheck(state.assetCheck.query);
    state.assetCheck.loading = false;
    renderWatchlist();
  });
  document.getElementById("asset-track-run")?.addEventListener("click", async () => {
    try {
      await trackAssetSignal();
      renderWatchlist();
    } catch (error) {
      console.warn("TELAJ could not track the paper asset signal.", error);
    }
  });
  document.getElementById("asset-check-clear")?.addEventListener("click", () => {
    state.assetCheck.query = "";
    state.assetCheck.result = null;
    state.assetCheck.error = "";
    renderWatchlist();
  });
  document.getElementById("asset-check-input")?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    state.assetCheck.query = event.target.value.trim();
    state.assetCheck.loading = true;
    renderWatchlist();
    state.assetCheck.result = await requestAssetCheck(state.assetCheck.query);
    state.assetCheck.loading = false;
    renderWatchlist();
  });
}

function formatAssetCheckPrice(value, ticker) {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) {
    return "Waiting for live price";
  }
  const precision = ticker && ticker.includes("/") ? 4 : price >= 1000 ? 0 : price >= 100 ? 2 : 4;
  return price.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

function describeRecentPriceAction(candles) {
  if (!Array.isArray(candles) || !candles.length) {
    return "Recent price action is not available yet.";
  }
  const upDays = candles.filter((bar) => Number(bar.close || 0) >= Number(bar.open || 0)).length;
  const downDays = candles.length - upDays;
  const firstClose = Number(candles[0]?.close || 0);
  const lastClose = Number(candles[candles.length - 1]?.close || 0);
  const movePct = firstClose > 0 ? ((lastClose - firstClose) / firstClose) * 100 : 0;
  const direction =
    movePct > 1
      ? "Price has been trending up overall."
      : movePct < -1
        ? "Price has been trending down overall."
        : "Price has been moving mostly sideways.";
  return `Last ${candles.length} daily sessions: ${upDays} up, ${downDays} down. ${direction}`;
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
  const retirementAdvice = getRetirementPriorityAdvice();
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
  document.getElementById("allocation-retirement").innerHTML = `
    <div class="eyebrow">Retirement priorities</div>
    <h3>${retirementAdvice.headline}</h3>
    <div class="task-pill">${retirementAdvice.label}</div>
    <p class="body-copy">${retirementAdvice.summary}</p>
    <ul class="clean-list">
      ${retirementAdvice.priorities.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <div class="section-spacer"></div>
    <div class="micro-label">Main watchout</div>
    <div class="panel-copy">${retirementAdvice.watchout}</div>
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
  const marketState = state.marketRegime?.regime
    ? {
        ...intel.marketState,
        regime: state.marketRegime.regime,
        riskLevel: state.marketRegime.riskLevel || intel.marketState.riskLevel,
        summary: state.marketRegime.summary || intel.marketState.summary,
      }
    : intel.marketState;
  const performanceSummary = state.homeApi.performanceSummary?.performanceSummary || null;
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
    ${
      performanceSummary?.hasLiveData
        ? `
          <div class="panel-copy">${performanceSummary.summary}</div>
          <div class="stats-grid">
            ${performanceSummary.metrics
              .map(
                (item) => `
                  <div class="stat-box">
                    <div class="stat-label">${item.label}</div>
                    <div class="stat-value accent-text">${item.value}</div>
                    <div class="list-note">${item.note}</div>
                  </div>
                `
              )
              .join("")}
          </div>
        `
        : `
          <div class="panel-copy">TELAJ does not have enough live execution history yet to show trusted performance numbers here. Static placeholders have been removed.</div>
        `
    }
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

  document.getElementById("hero-execute")?.addEventListener("click", jumpToFinancialPosition);
  document.getElementById("hero-simulate")?.addEventListener("click", jumpToMorningSignal);
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
    renderAssetsArea();
    renderExpensesArea();
    renderFamilyVault();
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
    loadSoundPreference();
    loadSubscriberPreferences();
    loadOnboardingState();
    await loadMockApiState();
    await loadMarketRegime();
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
          await loadHomeDecisionState();
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
