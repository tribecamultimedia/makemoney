const defaultState = {
  activeView: "home",
  dataSource: "Embedded fallback",
  auth: {
    authenticated: false,
    mode: "gate",
    guest: false,
    email: "",
    error: "",
    info: "",
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
      "Volatility is elevated, your cash reserve is still below target, and the model would rather strengthen the household than stretch into another position too early.",
    risk: "medium",
    whoFor: "Family cash stability",
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
  highlightedSignals: [
    {
      ticker: "GLD",
      label: "Defensive add",
      note: "Gold is the cleaner defensive sleeve if the household still needs ballast.",
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
    summary: "TELAJ is not against investing. It wants the household to be harder to destabilize before you push further into risk.",
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
    "Do not let one asset dominate the family system",
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
    liquidAssets: 18000,
    monthlyNeed: 4200,
  },
  financialPosition: {
    investments: 42000,
    retirement: 28000,
    realEstate: 0,
    business: 0,
    creditCardDebt: 3500,
    loans: 12000,
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
};

const state = structuredClone(defaultState);
const AUTH_STORAGE_KEY = "telaj-auth-v1";
const ONBOARDING_STORAGE_KEY = "telaj-onboarding-v1";
const WEALTH_INPUTS_STORAGE_KEY = "telaj-wealth-inputs-v1";
const questionBank = [
  {
    id: "netWorthBand",
    category: "Balance sheet",
    prompt: "Roughly how much are you worth today?",
    helper: "TELAJ starts with a rough net-worth band so the advice fits the real scale of the household.",
    options: [
      { value: "under-50k", title: "Under 50k", note: "Early-stage or still building the base." },
      { value: "50k-250k", title: "50k-250k", note: "The household has started to build real capital." },
      { value: "250k-1m", title: "250k-1m", note: "Meaningful capital allocation decisions matter now." },
      { value: "1m-plus", title: "1m+", note: "Preservation, optimization, and structure matter more." },
    ],
  },
  {
    id: "liquidity",
    category: "Balance sheet",
    prompt: "How much of your wealth is actually liquid?",
    helper: "Liquidity matters because the household needs flexibility, not just headline net worth.",
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
    helper: "A low fixed mortgage and an expensive mortgage create very different household decisions.",
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
    helper: "TELAJ should adapt recommendations to your real earning power, not pretend every household has the same capacity.",
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
      { value: "fragile", title: "Fragile", note: "The household needs more protection first." },
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
      { value: "mild", title: "Some constraints", note: "There is some uncertainty or family burden." },
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
      { value: "legacy", title: "Legacy", note: "Multi-decade wealth and family continuity." },
    ],
  },
  {
    id: "wealthFor",
    category: "Goals",
    prompt: "Who is this wealth for?",
    helper: "TELAJ should understand whether this is personal, household, or family capital.",
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
let supabaseClient = null;

const mockEndpoints = {
  familyDashboard: "./mock-api/family-dashboard.json",
  allocation: "./mock-api/allocation.json",
  signals: "./mock-api/signals.json",
  progress: "./mock-api/progress.json",
  realEstate: "./mock-api/real-estate.json",
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
      info: state.auth.info,
    })
  );
}

function getAuthAvailability() {
  return Boolean(initSupabaseClient());
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
      return;
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
  } catch (error) {
    console.warn("TELAJ wealth inputs could not be restored.", error);
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

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function loadMockApiState() {
  try {
    const [familyDashboard, allocation, signals, progress, realEstate] = await Promise.all([
      fetchJson(mockEndpoints.familyDashboard),
      fetchJson(mockEndpoints.allocation),
      fetchJson(mockEndpoints.signals),
      fetchJson(mockEndpoints.progress),
      fetchJson(mockEndpoints.realEstate),
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
      ? "Business and investment property household"
      : answers.assetLocation === "primary-home"
        ? "Home-equity-led household"
      : answers.ownedAssets === "mixed"
      ? "Multi-asset household"
      : answers.ownedAssets === "property"
        ? "Property-centered household"
        : answers.ownedAssets === "investments"
          ? "Investment-led household"
          : "Liquidity-led household";
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
      "TELAJ sees a household that needs more room to absorb life, debt, or income pressure before taking on more exposure.";
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
    state.morningSignal.move = "Prepare the household before forcing the next property move";
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
    state.property.note = "TELAJ sees property relevance, but it wants stronger household resilience before a bigger move.";
  }

  if (householdProfile.propertyExposure && goalProfile.propertyIntent !== "none") {
    state.property.signal = "Real estate matters, but only if liquidity and stress still work";
    state.property.note = "The property decision should serve the household system, not become the system.";
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
      "TELAJ sees a primary household with a higher-cost mortgage, which can matter more than chasing another asset too early.";
    state.recommendation.primaryAction = "Review mortgage pressure and household liquidity";
    state.recommendation.secondaryAction = "Delay optional risk until the home balance sheet is stronger";
  }

  if (intent?.optimizeFor === "property readiness") {
    state.recommendation.secondaryAction = "Translate the goal into a property-readiness plan, not an impulse move";
    state.property.signal = "Property intent is real, but TELAJ wants readiness over urgency";
  } else if (intent?.optimizeFor === "durable cash flow") {
    state.recommendation.headline = "Build reliable cash flow without weakening the household core";
    state.recommendation.growthSleeve = "Favor durable ETF and cash-flow assets over concentrated bets";
  } else if (intent?.optimizeFor === "reserve strength") {
    state.morningSignal.move = "Protect the household buffer before reaching for the next idea";
  }

  if (intent?.watchout === "Speculation risk" || intent?.watchout === "Speed pressure") {
    state.recommendation.avoid = "Fast, narrative-driven moves that break the household plan";
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
          <h1 class="onboarding-title">Map the family balance sheet before anything else.</h1>
          <p class="onboarding-copy">TELAJ should understand what the household owns, where the capital sits, how much is owed, and only then how the person behaves under stress.</p>
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
  authShell.classList.add("is-active");
  appShell.classList.add("is-hidden");
  onboardingShell.classList.remove("is-active");
  onboardingShell.innerHTML = "";

  authShell.innerHTML = `
    <div class="auth-card">
      <div class="auth-head">
        <div>
          <div class="eyebrow">TELAJ ACCESS</div>
          <h1 class="onboarding-title">Choose how you want to enter TELAJ.</h1>
          <p class="onboarding-copy">Use guest mode to start quickly, or create an account so your household profile follows you across devices.</p>
        </div>
        <div class="auth-status">${supabaseReady ? "Supabase ready" : "Guest mode ready"}</div>
      </div>
      <div class="auth-options">
        <button class="auth-option ${mode === "guest" ? "is-selected" : ""}" id="auth-guest">
          <div class="answer-title">Continue as guest</div>
          <div class="answer-note">Fastest path. Good for trying TELAJ before creating a permanent account.</div>
        </button>
        <button class="auth-option ${mode === "signup" ? "is-selected" : ""}" id="auth-signup">
          <div class="answer-title">Create account</div>
          <div class="answer-note">Use email and password so TELAJ can save your profile more permanently.</div>
        </button>
        <button class="auth-option ${mode === "login" ? "is-selected" : ""}" id="auth-login">
          <div class="answer-title">Log in</div>
          <div class="answer-note">Return to your saved TELAJ household, intent profile, and balance-sheet data.</div>
        </button>
      </div>
      <div class="social-auth">
        <button class="social-button" id="auth-google" ${supabaseReady ? "" : "disabled"}>
          <span class="social-label">Continue with Google</span>
          <span class="social-note">Use your Gmail identity</span>
        </button>
        <button class="social-button" id="auth-github" ${supabaseReady ? "" : "disabled"}>
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
              <div class="micro-label">Guest mode</div>
              <div class="panel-copy">Guest mode lets you start immediately. Later you can upgrade to a permanent account without rebuilding the household profile.</div>
            </div>
          `
      }
      <div class="auth-feedback">
        ${state.auth.error ? `<div class="auth-error">${state.auth.error}</div>` : ""}
        ${state.auth.info ? `<div class="auth-info">${state.auth.info}</div>` : ""}
        ${!supabaseReady ? `<div class="auth-info">Supabase public config is not set yet, so email login is disabled and guest mode will use local preview access.</div>` : ""}
      </div>
      <div class="onboarding-actions">
        <div class="task-pill">${supabaseReady ? "Auth provider connected" : "Preview auth shell"}</div>
        <button class="action-button primary" id="auth-continue">${
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
    } else {
      state.auth.authenticated = true;
      state.auth.guest = true;
      state.auth.info = "Guest preview session started.";
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
  renderAuthShell();
  renderOnboarding();
}

async function handleOAuth(provider) {
  state.auth.error = "";
  state.auth.info = "";
  const client = initSupabaseClient();

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
        <textarea id="intent-notes" class="intent-textarea" placeholder="Example: I want to protect my family, stop making rushed decisions, and know when real estate actually makes sense for us. I care more about avoiding a big mistake than chasing the fastest return.">${notes}</textarea>
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

  let opinion = "The household can focus on disciplined long-term allocation.";
  if (state.financialPosition.creditCardDebt > 0) {
    opinion = "TELAJ would likely prioritize expensive consumer debt before stretching into new risk.";
  } else if (debtRatio > 0.6) {
    opinion = "Debt is a large share of the household picture, so resilience and balance-sheet repair matter first.";
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
    primaryAction = "Confirm liquid cash and monthly household need";
    secondaryAction = "Only invest after the reserve target is visible";
    growthSleeve = "No growth sleeve yet";
    watchout = "Investing from an unmapped balance sheet";
    heroMove = "Map the cash position before taking the next step";
    heroRationale = "TELAJ needs the liquid position first because every later allocation depends on it.";
    reasons = [
      "The balance sheet is still incomplete.",
      "Reserve math is impossible without liquid cash and household need.",
      "TELAJ should not manufacture certainty from missing data.",
    ];
  } else if (state.financialPosition.creditCardDebt > 0) {
    buckets = allocatePercentages([
      { label: "Debt payoff", percent: 45, note: "Expensive revolving debt usually deserves first claim on free capital." },
      { label: "Emergency reserve", percent: 35, note: "Keep the household from falling back into the debt loop." },
      { label: "Treasury bonds", percent: 20, note: "Park the defensive sleeve where it stays stable and liquid." },
    ]);
    headline = "Use liquid capital to repair the balance sheet before investing aggressively";
    summary = `${formatEuro(liquidAssets)} is meaningful, but TELAJ sees expensive consumer debt on the household. The first move is balance-sheet repair, not chasing returns.`;
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
      { label: "Emergency reserve", percent: 45, note: "Bring the household closer to its reserve target first." },
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
    heroRationale = "The household is not under-protected, but it still needs more runway before TELAJ leans into bigger exposure.";
    reasons = [
      `Reserve target is about ${formatEuro(reserveTargetAmount)} and the gap is still ${formatEuro(reserveGap)}.`,
      "Short Treasuries keep capital productive without locking the household up.",
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
        { label: "Emergency reserve", percent: 35, note: "Higher reserve because the household carries more fixed obligations." },
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
      "A diversified ETF sleeve is the cleanest growth engine for household capital.",
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
    : "TELAJ needs the liquid position mapped before it can produce a household allocation call.";

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
  const profiles = state.onboarding.profiles;
  if (!profiles?.householdProfile || !profiles?.behaviorProfile || !profiles?.goalProfile) {
    panel.innerHTML = `
      <div class="eyebrow">Life matrix</div>
      <h3>Profile not built yet</h3>
      <p class="body-copy">Finish onboarding to let TELAJ describe the household, the behavior pattern, and the real goal structure.</p>
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

function renderXpLevel() {
  const panel = document.getElementById("xp-level");
  const progress = Math.min((state.profile.xp / state.profile.nextLevelXp) * 100, 100);
  panel.innerHTML = `
    <div class="eyebrow">Progression</div>
    <h3>${state.profile.level}</h3>
    <div class="stat-value accent-text">${state.profile.xp} XP</div>
    <p class="body-copy">${state.profile.rank}</p>
    <div class="bar-track"><div class="bar-fill" style="width:${progress}%"></div></div>
    <p class="list-note">${state.profile.nextLevelXp - state.profile.xp} XP to Wealth Architect</p>
  `;
  document.getElementById("rail-level").textContent = state.profile.level;
  document.getElementById("rail-streak").textContent = `${state.profile.streak} days`;
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
    <h3>Put the household position at the center of every move</h3>
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
    <div class="section-spacer"></div>
    <div class="micro-label">Update the household map</div>
    <div class="input-stack">
      <label class="input-field">
        <span class="micro-label">Liquid cash</span>
        <input id="fp-liquid" type="number" min="0" step="1000" value="${state.liquidityDetails.liquidAssets}" />
      </label>
      <label class="input-field">
        <span class="micro-label">Monthly household need</span>
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
      </div>
    </div>
  `;

  document.getElementById("save-financial-position").addEventListener("click", () => {
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
    renderAll();
  });
  document.getElementById("financial-go-allocation").addEventListener("click", () => setView("allocation"));
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
        <span class="micro-label">Monthly household need</span>
        <input id="monthly-need-input" type="number" min="0" step="100" value="${state.liquidityDetails.monthlyNeed}" />
      </label>
      <div class="action-row">
        <button class="action-button primary" id="save-liquidity">Update liquidity</button>
        <button class="ghost-button" id="go-allocation">Use this in allocation</button>
      </div>
    </div>
  `;
  document.getElementById("save-liquidity").addEventListener("click", () => {
    state.liquidityDetails.liquidAssets = Number(document.getElementById("liquid-assets-input").value || 0);
    state.liquidityDetails.monthlyNeed = Number(document.getElementById("monthly-need-input").value || 0);
    persistWealthInputs();
    renderCashStatus();
  });
  document.getElementById("go-allocation").addEventListener("click", () => setView("allocation"));
}

function renderTasks() {
  const panel = document.getElementById("daily-tasks");
  panel.innerHTML = `
    <div class="eyebrow">Daily tasks</div>
    <h3>Discipline quests</h3>
    <div class="quest-list">
      ${state.tasks
        .map(
          (task) => `
            <div class="task-item">
              <button class="task-toggle ${task.done ? "is-done" : ""}" data-task="${task.id}" aria-label="Toggle ${task.title}"></button>
              <div>
                <div>${task.title}</div>
                <div class="task-copy">${task.xp} XP</div>
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
  panel.innerHTML = `
    <div class="eyebrow">Market tape</div>
    <h3>Live movers and highlighted signals</h3>
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
    <div class="eyebrow">Highlighted signals</div>
    <div class="highlight-list">
      ${state.highlightedSignals
        .map(
          (item) => `
            <div class="highlight-item">
              <div class="watch-top">
                <div>
                  <div class="row-label">${item.ticker}</div>
                  <div class="highlight-title">${item.label}</div>
                </div>
                <div class="signal-badge ${item.action.toLowerCase().includes("watch") ? "warn" : "good"}">${item.action}</div>
              </div>
              <div class="panel-copy">${item.note}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderHistoryPreview() {
  const panel = document.getElementById("signal-history-preview");
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
    <div class="eyebrow">Current mix</div>
    <h3>How the household is currently positioned</h3>
    <div class="bar-stack">
      ${state.allocation
        .map(
          (item) => `
            <div class="allocation-block">
              <div class="allocation-row">
                <div class="row-label">${item.label}</div>
                <div class="bar-track"><div class="bar-fill" style="width:${item.weight}%"></div></div>
                <div class="allocation-number">${item.weight}%</div>
              </div>
              <div class="list-note">${item.note}</div>
            </div>
          `
        )
        .join("")}
    </div>
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
  document.getElementById("signal-stats").innerHTML = `
    <div class="eyebrow">Signal stats</div>
    <h3>Outcome summary</h3>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-label">YTD vs benchmark</div><div class="stat-value accent-text">${state.stats.ytd}</div><div class="list-note">Benchmark ${state.stats.benchmark}</div></div>
      <div class="stat-box"><div class="stat-label">Signals taken</div><div class="stat-value">${state.stats.signalsTaken}</div></div>
      <div class="stat-box"><div class="stat-label">Win rate</div><div class="stat-value">${state.stats.winRate}</div></div>
      <div class="stat-box"><div class="stat-label">Drawdowns avoided</div><div class="stat-value">4</div></div>
    </div>
  `;
  document.getElementById("signal-history-list").innerHTML = `
    <div class="eyebrow">History</div>
    <h3>Signal log</h3>
    <div class="history-list">
      ${state.history
        .map(
          (item) => `
            <div class="history-item">
              <div class="history-top">
                <div>
                  <div class="row-label">${item.date}</div>
                  <div>${item.title}</div>
                </div>
                <div class="signal-badge ${item.quality}">${item.outcome}</div>
              </div>
              <div class="history-meta">${item.action} | ${item.impact}</div>
              ${sparkline(item.spark, item.quality === "good" ? "#27d17f" : item.quality === "bad" ? "#ff6b6b" : "#ffd166")}
            </div>
          `
        )
        .join("")}
    </div>
  `;
  document.getElementById("signal-outcomes").innerHTML = `
    <div class="eyebrow">Interpretation</div>
    <h3>Why this matters</h3>
    <ul class="clean-list">
      <li>Captured gains should be visible, but avoided damage matters more.</li>
      <li>TELAJ should celebrate discipline, not just green numbers.</li>
      <li>The right signal can be “do nothing” when the setup is weak.</li>
    </ul>
  `;
}

function renderProgress() {
  const completed = state.tasks.filter((task) => task.done).length;
  const totalXp = state.tasks.filter((task) => task.done).reduce((sum, task) => sum + task.xp, 0);
  document.getElementById("progress-summary").innerHTML = `
    <div class="eyebrow">Progress summary</div>
    <h3>${completed}/${state.tasks.length} quests complete</h3>
    <div class="stat-value accent-text">${totalXp} XP today</div>
    <p class="body-copy">${state.profile.streak}-day discipline streak. The system rewards consistency, not adrenaline.</p>
  `;
  document.getElementById("quest-board").innerHTML = document.getElementById("daily-tasks").innerHTML;
  document.getElementById("badge-case").innerHTML = document.getElementById("achievements").innerHTML;
  document.getElementById("level-roadmap").innerHTML = `
    <div class="eyebrow">Level path</div>
    <h3>Allocator journey</h3>
    <div class="level-list">
      <div class="task-item"><div class="leader-rank">1</div><div>Starter</div><div class="task-meta">Learn the system</div></div>
      <div class="task-item"><div class="leader-rank">2</div><div>Builder</div><div class="task-meta">Protect reserves</div></div>
      <div class="task-item"><div class="leader-rank">3</div><div>Strategist</div><div class="task-meta">Allocate calmly</div></div>
      <div class="task-item"><div class="leader-rank">4</div><div>Allocator</div><div class="task-meta">Balance growth and defense</div></div>
      <div class="task-item"><div class="leader-rank">5</div><div>Wealth Architect</div><div class="task-meta">Operate a full family system</div></div>
    </div>
  `;
}

function renderRealEstate() {
  calculatePropertyAppraisal();
  document.getElementById("property-signal").innerHTML = `
    <div class="eyebrow">Property decision</div>
    <h3>${state.property.signal}</h3>
    <p class="body-copy">${state.property.note}</p>
    <div class="insight-grid">
      <div class="insight-card">
        <div class="micro-label">TELAJ stance</div>
        <div class="panel-copy">Preparation before expansion</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">Why this matters</div>
        <div class="panel-copy">The household needs resilient liquidity, financing discipline, and vacancy tolerance before the next property move.</div>
      </div>
    </div>
    <div class="property-action-row">
      <button class="action-button primary" id="property-run-appraisal-top">Run appraisal</button>
      <button class="action-button" id="property-view-checklist-top">View checklist</button>
      <button class="ghost-button" id="property-go-allocation">Back to allocation</button>
    </div>
  `;
  document.getElementById("property-metrics").innerHTML = `
    <div class="eyebrow">Property posture</div>
    <h3>Readiness at a glance</h3>
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">Estimated value</div>
        <div class="stat-value">€${Math.round(state.propertyAppraisal.estimatedValue).toLocaleString()}</div>
      </div>
      ${state.property.metrics
        .map(
          (item) => `
            <div class="stat-box">
              <div class="stat-label">${item.label}</div>
              <div class="stat-value">${item.value}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  document.getElementById("property-checklist").innerHTML = `
    <div class="eyebrow">Property lab</div>
    <h3>Quick appraisal and readiness plan</h3>
    <p class="body-copy">Educational only. This is a rough heuristic, not a formal valuation or professional appraisal.</p>
    <div class="property-stack">
      <div class="subpanel">
        <div class="micro-label">Appraisal inputs</div>
        <div class="input-stack">
          <label class="input-field input-span-2">
            <span class="micro-label">Address / city</span>
            <input id="property-address" type="text" value="${state.propertyAppraisal.address}" placeholder="Via Roma 10, Milano or London, UK" />
          </label>
          <label class="input-field">
            <span class="micro-label">Size</span>
            <input id="property-size" type="number" min="0" step="1" value="${state.propertyAppraisal.size}" />
          </label>
          <label class="input-field">
            <span class="micro-label">Unit</span>
            <select id="property-unit">
              <option value="sqm" ${state.propertyAppraisal.unit === "sqm" ? "selected" : ""}>sq m</option>
              <option value="sqft" ${state.propertyAppraisal.unit === "sqft" ? "selected" : ""}>sq ft</option>
            </select>
          </label>
          <div class="property-action-row input-span-2">
            <button class="action-button primary" id="run-appraisal">Run appraisal</button>
            <button class="ghost-button" id="property-checklist-toggle">Jump to checklist</button>
          </div>
        </div>
      </div>
      <div class="subpanel">
        <div class="micro-label">Appraisal output</div>
        <div class="insight-grid">
          <div class="insight-card">
            <div class="micro-label">Estimated range</div>
            <div class="panel-copy">€${Math.round(state.propertyAppraisal.valueLow).toLocaleString()} to €${Math.round(state.propertyAppraisal.valueHigh).toLocaleString()}</div>
          </div>
          <div class="insight-card">
            <div class="micro-label">Price per sq m</div>
            <div class="panel-copy">€${Math.round(state.propertyAppraisal.pricePerSqm).toLocaleString()} / sq m</div>
          </div>
        </div>
        <div class="section-spacer"></div>
        <div class="micro-label">Appraisal note</div>
        <div class="panel-copy">${state.propertyAppraisal.note}</div>
      </div>
      <div class="subpanel" id="property-readiness-list">
        <div class="micro-label">Before the next property move</div>
        <ul class="clean-list">
          ${state.property.checklist.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
  document.getElementById("property-run-appraisal-top").addEventListener("click", () => {
    const target = document.getElementById("property-checklist");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  document.getElementById("property-view-checklist-top").addEventListener("click", () => {
    const target = document.getElementById("property-readiness-list");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  document.getElementById("property-go-allocation").addEventListener("click", () => setView("allocation"));
  document.getElementById("run-appraisal").addEventListener("click", () => {
    state.propertyAppraisal.address = document.getElementById("property-address").value;
    state.propertyAppraisal.size = Number(document.getElementById("property-size").value || 0);
    state.propertyAppraisal.unit = document.getElementById("property-unit").value;
    calculatePropertyAppraisal();
    renderRealEstate();
  });
  document.getElementById("property-checklist-toggle").addEventListener("click", () => {
    const target = document.getElementById("property-readiness-list");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function bindNav() {
  navItems.forEach((item) => item.addEventListener("click", () => setView(item.dataset.section)));
  document.getElementById("hero-execute").addEventListener("click", () => setView("home"));
  document.getElementById("hero-simulate").addEventListener("click", () => setView("signals"));
}

function renderAll() {
  applyProfilesToNarrative();
  renderMorningHero();
  renderSystemHealth();
  renderXpLevel();
  renderProfileMatrix();
  renderFinancialPosition();
  renderAllocationSnapshot();
  renderCashStatus();
  renderTasks();
  renderWatchlist();
  renderHistoryPreview();
  renderAchievements();
  renderLeaderboard();
  renderAllocationView();
  renderSignalsView();
  renderProgress();
  renderRealEstate();
  bindNav();
  setView(state.activeView);
}

async function bootstrap() {
  initSupabaseClient();
  loadAuthState();
  loadOnboardingState();
  loadWealthInputs();
  await loadMockApiState();
  if (supabaseClient) {
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        state.auth.authenticated = true;
        state.auth.guest = Boolean(data.session.user.is_anonymous);
        state.auth.email = data.session.user.email || "";
      }
    } catch (error) {
      console.warn("TELAJ auth session could not be restored.", error);
    }
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
}

bootstrap();
