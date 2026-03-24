const {
  getServiceRoleConfigError,
  requestSupabaseAdmin,
} = require("./_supabase");

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildPerformanceSummary({ ledgerRows, equityRows }) {
  if (!Array.isArray(equityRows) || equityRows.length === 0) {
    return {
      hasLiveData: false,
      summary: "TELAJ does not have enough live performance history yet.",
      metrics: [],
    };
  }

  const sortedEquity = [...equityRows].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const sortedLedger = Array.isArray(ledgerRows)
    ? [...ledgerRows].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];

  const startOfYear = new Date();
  startOfYear.setUTCMonth(0, 1);
  startOfYear.setUTCHours(0, 0, 0, 0);

  const ytdStartPoint =
    sortedEquity.find((row) => new Date(row.timestamp) >= startOfYear) || sortedEquity[0];
  const latestPoint = sortedEquity[sortedEquity.length - 1];
  const startEquity = toNumber(ytdStartPoint?.equity);
  const latestEquity = toNumber(latestPoint?.equity);
  const returnPct = startEquity > 0 ? ((latestEquity / startEquity) - 1) * 100 : 0;

  let runningPeak = 0;
  let maxDrawdownPct = 0;
  for (const row of sortedEquity) {
    const equity = toNumber(row.equity);
    runningPeak = Math.max(runningPeak, equity);
    if (runningPeak > 0) {
      const drawdownPct = Math.abs(((equity / runningPeak) - 1) * 100);
      maxDrawdownPct = Math.max(maxDrawdownPct, drawdownPct);
    }
  }

  const submittedSignals = sortedLedger.filter((row) => row.status === "submitted");
  let wins = 0;
  let evaluated = 0;
  for (const row of submittedSignals) {
    const before = sortedEquity.filter((point) => new Date(point.timestamp) <= new Date(row.timestamp));
    const after = sortedEquity.filter((point) => new Date(point.timestamp) > new Date(row.timestamp));
    if (!before.length || !after.length) {
      continue;
    }
    const beforeEquity = toNumber(before[before.length - 1].equity);
    const afterEquity = toNumber(after[0].equity);
    evaluated += 1;
    if (row.action === "BUY" && afterEquity >= beforeEquity) {
      wins += 1;
    } else if (row.action === "PROTECT" && afterEquity <= beforeEquity) {
      wins += 1;
    }
  }

  const winRatePct = evaluated > 0 ? (wins / evaluated) * 100 : 0;

  return {
    hasLiveData: true,
    updatedAt: latestPoint?.timestamp || null,
    summary: "These numbers come from TELAJ's live execution ledger and equity curve, not shell placeholders.",
    metrics: [
      {
        key: "engine_return",
        label: "Engine return",
        value: `${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(1)}%`,
        note: "Live from the equity curve since the start of the current year or first available point.",
      },
      {
        key: "signals_taken",
        label: "Signals taken",
        value: String(submittedSignals.length),
        note: "Submitted actions from the live trade ledger.",
      },
      {
        key: "win_rate",
        label: "Win rate",
        value: `${winRatePct.toFixed(1)}%`,
        note: "Evaluated from the next equity snapshot after each submitted action.",
      },
      {
        key: "max_drawdown",
        label: "Max drawdown",
        value: `${maxDrawdownPct.toFixed(1)}%`,
        note: "Worst peak-to-trough decline in the recorded equity curve.",
      },
    ],
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const configError = getServiceRoleConfigError();
  if (configError) {
    res.status(500).json({ error: configError });
    return;
  }

  try {
    const [ledgerRows, equityRows] = await Promise.all([
      requestSupabaseAdmin("trade_ledger?select=timestamp,action,status&order=timestamp.asc"),
      requestSupabaseAdmin("equity_curve?select=timestamp,equity&order=timestamp.asc"),
    ]);

    res.status(200).json({
      performanceSummary: buildPerformanceSummary({
        ledgerRows,
        equityRows,
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Performance load failed" });
  }
};
