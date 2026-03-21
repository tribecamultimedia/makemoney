const defaultState = {
  activeView: "home",
  dataSource: "Embedded fallback",
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
};

const state = structuredClone(defaultState);

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

const mockEndpoints = {
  home: "./mock-api/home.json",
  allocation: "./mock-api/allocation.json",
  signals: "./mock-api/signals.json",
  progress: "./mock-api/progress.json",
  realEstate: "./mock-api/real-estate.json",
};

function mergeState(payload) {
  Object.assign(state, payload);
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
    const [home, allocation, signals, progress, realEstate] = await Promise.all([
      fetchJson(mockEndpoints.home),
      fetchJson(mockEndpoints.allocation),
      fetchJson(mockEndpoints.signals),
      fetchJson(mockEndpoints.progress),
      fetchJson(mockEndpoints.realEstate),
    ]);

    mergeState({
      morningSignal: home.morningSignal ?? state.morningSignal,
      systemHealth: home.systemHealth ?? state.systemHealth,
      profile: home.profile ?? state.profile,
      stats: home.stats ?? state.stats,
      allocation: home.allocation ?? state.allocation,
      watchlist: home.watchlist ?? state.watchlist,
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
  panel.innerHTML = `
    <div class="eyebrow">Allocation</div>
    <h3>Portfolio allocation</h3>
    <div class="bar-stack">
      ${state.allocation
        .map(
          (item) => `
            <div class="allocation-row">
              <div class="row-label">${item.label}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${item.weight}%"></div></div>
              <div class="allocation-number">${item.weight}%</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCashStatus() {
  const panel = document.getElementById("cash-status");
  panel.innerHTML = `
    <div class="eyebrow">Reserve status</div>
    <h3>Cash buffer</h3>
    <div class="stat-value">${state.stats.cashReserve}</div>
    <p class="body-copy">TELAJ would like this closer to 6 months before you add more stress or real-estate exposure.</p>
    <div class="insight-grid">
      <div class="insight-card">
        <div class="micro-label">Recommendation</div>
        <div class="panel-copy">${state.recommendation.primaryAction}</div>
      </div>
      <div class="insight-card">
        <div class="micro-label">Stress score</div>
        <div class="panel-copy">Moderate</div>
      </div>
    </div>
  `;
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
    <div class="eyebrow">Watchlist</div>
    <h3>Live-style ticker strip</h3>
    <div class="watchlist-list">
      ${state.watchlist
        .map(
          (item) => `
            <div class="watch-item">
              <div class="watch-top">
                <div>
                  <div class="row-label">${item.ticker}</div>
                  <div class="panel-copy">${item.signal}</div>
                </div>
                <div class="watch-badge ${item.trend}">${item.move}</div>
              </div>
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
    <div class="eyebrow">Main move</div>
    <h3>${state.recommendation.headline}</h3>
    <p class="body-copy">${state.recommendation.summary}</p>
    <div class="insight-grid">
      <div class="insight-card"><div class="micro-label">Primary action</div><div class="panel-copy">${state.recommendation.primaryAction}</div></div>
      <div class="insight-card"><div class="micro-label">Secondary action</div><div class="panel-copy">${state.recommendation.secondaryAction}</div></div>
      <div class="insight-card"><div class="micro-label">Growth sleeve</div><div class="panel-copy">${state.recommendation.growthSleeve}</div></div>
      <div class="insight-card"><div class="micro-label">Avoid</div><div class="panel-copy">${state.recommendation.avoid}</div></div>
    </div>
  `;
  document.getElementById("allocation-bars").innerHTML = document.getElementById("allocation-snapshot").innerHTML;
  document.getElementById("allocation-rules").innerHTML = `
    <div class="eyebrow">Rules</div>
    <h3>Allocation logic</h3>
    <ul class="clean-list">
      ${state.rules.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
  document.getElementById("allocation-watchouts").innerHTML = `
    <div class="eyebrow">Watchouts</div>
    <h3>Do not confuse activity with progress</h3>
    <ul class="clean-list">
      ${state.watchouts.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
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
  document.getElementById("property-signal").innerHTML = `
    <div class="eyebrow">Property signal</div>
    <h3>${state.property.signal}</h3>
    <p class="body-copy">${state.property.note}</p>
    <div class="action-row">
      <button class="action-button">Model property</button>
      <button class="action-button">Run vacancy stress</button>
      <button class="ghost-button">Keep preparing</button>
    </div>
  `;
  document.getElementById("property-metrics").innerHTML = `
    <div class="eyebrow">Readiness metrics</div>
    <h3>What TELAJ sees</h3>
    <div class="stats-grid">
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
    <div class="eyebrow">Checklist</div>
    <h3>Before real estate</h3>
    <ul class="clean-list">
      ${state.property.checklist.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function bindNav() {
  navItems.forEach((item) => item.addEventListener("click", () => setView(item.dataset.section)));
  document.getElementById("hero-execute").addEventListener("click", () => setView("home"));
  document.getElementById("hero-simulate").addEventListener("click", () => setView("signals"));
}

function renderAll() {
  renderMorningHero();
  renderSystemHealth();
  renderXpLevel();
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
  await loadMockApiState();
  renderAll();
}

bootstrap();
