const MASSIVE_API_BASE = process.env.MASSIVE_API_BASE || "https://api.massive.com";
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY || process.env.POLYGON_API_KEY || process.env.POLYGON_API_TOKEN;

const REGIME_BASKETS = {
  US: ["SPY", "QQQ", "GLD", "SGOV"],
  EU: ["VGK", "EUNL", "GLD", "ERNE"],
};

async function fetchMassiveJson(path) {
  if (!MASSIVE_API_KEY) {
    return null;
  }
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${MASSIVE_API_BASE}${path}${separator}apiKey=${encodeURIComponent(MASSIVE_API_KEY)}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Massive request failed: ${response.status} ${message}`);
  }
  return response.json();
}

async function fetchTickerFeatures(symbol) {
  const payload = await fetchMassiveJson(
    `/v2/aggs/ticker/${encodeURIComponent(symbol)}/range/1/day/${new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10)}/${new Date().toISOString().slice(0, 10)}?adjusted=true&sort=asc&limit=40`
  );
  const bars = (payload?.results || []).map((bar) => ({
    close: Number(bar.c || 0),
    open: Number(bar.o || 0),
    high: Number(bar.h || 0),
    low: Number(bar.l || 0),
  }));
  const closes = bars.map((bar) => bar.close).filter((value) => value > 0);
  if (closes.length < 5) {
    return { symbol, momentum20: 0, winRate: 0.5, volatility: 0, aboveTrend: false };
  }
  const last = closes[closes.length - 1];
  const base = closes[Math.max(0, closes.length - 21)] || closes[0];
  const momentum20 = base > 0 ? ((last / base) - 1) * 100 : 0;
  const trendWindow = closes.slice(-20);
  const average = trendWindow.reduce((sum, value) => sum + value, 0) / trendWindow.length;
  const positiveBars = bars.slice(-8).filter((bar) => bar.close >= bar.open).length;
  const avgRange =
    bars.slice(-8).reduce((sum, bar) => sum + ((bar.high - bar.low) / Math.max(bar.close, 0.0001)) * 100, 0) /
    Math.max(bars.slice(-8).length, 1);
  return {
    symbol,
    momentum20,
    winRate: positiveBars / Math.max(Math.min(bars.length, 8), 1),
    volatility: avgRange,
    aboveTrend: last >= average,
  };
}

function classifyRegime(region, features) {
  const featureMap = Object.fromEntries(features.map((item) => [item.symbol, item]));
  const broad = featureMap[region === "EU" ? "VGK" : "SPY"] || features[0];
  const growth = featureMap[region === "EU" ? "EUNL" : "QQQ"] || features[1];
  const gold = featureMap.GLD || features[2];
  const reserve = featureMap[region === "EU" ? "ERNE" : "SGOV"] || features[3];

  const score =
    (broad.momentum20 > 0 ? 0.28 : -0.22) +
    (growth.momentum20 > 0 ? 0.18 : -0.18) +
    (broad.aboveTrend ? 0.12 : -0.12) +
    (growth.aboveTrend ? 0.08 : -0.08) +
    (gold.momentum20 > 0 ? -0.05 : 0.05) +
    (reserve.volatility < 0.6 ? 0.06 : -0.03) +
    (broad.volatility < 2.4 ? 0.1 : -0.1) +
    (growth.volatility < 3.0 ? 0.06 : -0.08);

  if (score >= 0.28) {
    return {
      regime: "risk-on expansion",
      riskLevel: "medium",
      summary: "Breadth and momentum are supportive enough that TELAJ can let diversified risk work, though not recklessly.",
    };
  }
  if (score >= 0.04) {
    return {
      regime: region === "EU" ? "selective european accumulation" : "defensive accumulation",
      riskLevel: "medium",
      summary: "The market is constructive, but TELAJ still wants measured adds instead of aggressive one-shot entries.",
    };
  }
  return {
    regime: "capital preservation",
    riskLevel: "high",
    summary: "Momentum and trend are not strong enough to justify aggressive risk. TELAJ prefers defense and optionality here.",
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const region = req.query?.region === "EU" ? "EU" : "US";
  if (!MASSIVE_API_KEY) {
    res.status(200).json({
      marketRegime: {
        live: false,
        region,
        regime: region === "EU" ? "selective european accumulation" : "defensive accumulation",
        riskLevel: "medium",
        summary: "Live market regime data is unavailable, so TELAJ is using the structured fallback regime.",
        features: [],
      },
    });
    return;
  }

  try {
    const symbols = REGIME_BASKETS[region];
    const features = await Promise.all(symbols.map((symbol) => fetchTickerFeatures(symbol)));
    const regime = classifyRegime(region, features);
    res.status(200).json({
      marketRegime: {
        live: true,
        region,
        ...regime,
        features,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Market regime load failed" });
  }
};
