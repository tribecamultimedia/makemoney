const MASSIVE_API_BASE = process.env.MASSIVE_API_BASE || "https://api.massive.com";
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY || process.env.POLYGON_API_KEY || process.env.POLYGON_API_TOKEN;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const ASSET_ALIASES = {
  apple: { symbol: "AAPL", category: "single_stock", label: "Mega-cap quality" },
  aapl: { symbol: "AAPL", category: "single_stock", label: "Mega-cap quality" },
  tesla: { symbol: "TSLA", category: "single_stock", label: "High-volatility single stock" },
  tsla: { symbol: "TSLA", category: "single_stock", label: "High-volatility single stock" },
  nvidia: { symbol: "NVDA", category: "single_stock", label: "Momentum leadership stock" },
  nvda: { symbol: "NVDA", category: "single_stock", label: "Momentum leadership stock" },
  microsoft: { symbol: "MSFT", category: "single_stock", label: "Quality compounder" },
  msft: { symbol: "MSFT", category: "single_stock", label: "Quality compounder" },
  amazon: { symbol: "AMZN", category: "single_stock", label: "Large-cap platform stock" },
  amzn: { symbol: "AMZN", category: "single_stock", label: "Large-cap platform stock" },
  google: { symbol: "GOOGL", category: "single_stock", label: "Quality platform stock" },
  alphabet: { symbol: "GOOGL", category: "single_stock", label: "Quality platform stock" },
  googl: { symbol: "GOOGL", category: "single_stock", label: "Quality platform stock" },
  meta: { symbol: "META", category: "single_stock", label: "Large-cap growth stock" },
  spy: { symbol: "SPY", category: "broad_etf", label: "Broad ETF core" },
  "s&p": { symbol: "SPY", category: "broad_etf", label: "Broad ETF core" },
  "s&p 500": { symbol: "SPY", category: "broad_etf", label: "Broad ETF core" },
  etf: { symbol: "SPY", category: "broad_etf", label: "Broad ETF core" },
  vgk: { symbol: "VGK", category: "broad_etf", label: "European broad equity core" },
  eunl: { symbol: "EUNL", category: "broad_etf", label: "Global developed core" },
  qqq: { symbol: "QQQ", category: "high_beta", label: "High-beta growth" },
  nasdaq: { symbol: "QQQ", category: "high_beta", label: "High-beta growth" },
  gold: { symbol: "GLD", category: "gold", label: "Gold defense" },
  gld: { symbol: "GLD", category: "gold", label: "Gold defense" },
  sgld: { symbol: "GLD", category: "gold", label: "Gold defense" },
  silver: { symbol: "SLV", category: "commodity_proxy", label: "Silver proxy" },
  slv: { symbol: "SLV", category: "commodity_proxy", label: "Silver proxy" },
  oil: { symbol: "USO", category: "commodity_proxy", label: "Oil proxy" },
  brent: { symbol: "USO", category: "commodity_proxy", label: "Oil proxy" },
  wti: { symbol: "USO", category: "commodity_proxy", label: "Oil proxy" },
  treasury: { symbol: "SGOV", category: "reserve", label: "Treasury reserve sleeve" },
  treasuries: { symbol: "SGOV", category: "reserve", label: "Treasury reserve sleeve" },
  sgov: { symbol: "SGOV", category: "reserve", label: "Treasury reserve sleeve" },
  cash: { symbol: "SGOV", category: "reserve", label: "Treasury reserve sleeve" },
  "eurusd": { symbol: "C:EURUSD", category: "currency", label: "EUR/USD" },
  "gbpusd": { symbol: "C:GBPUSD", category: "currency", label: "GBP/USD" },
  "usdjpy": { symbol: "C:USDJPY", category: "currency", label: "USD/JPY" },
};

function normalizeQuery(raw) {
  return String(raw || "").trim().toLowerCase();
}

function tokenize(text) {
  return normalizeQuery(text)
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function levenshtein(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  const dp = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[left.length][right.length];
}

function fuzzyScore(query, candidate) {
  const normalizedQuery = normalizeQuery(query);
  const normalizedCandidate = normalizeQuery(candidate);
  if (!normalizedQuery || !normalizedCandidate) {
    return 0;
  }
  if (normalizedQuery === normalizedCandidate) {
    return 1;
  }
  if (normalizedCandidate.includes(normalizedQuery) || normalizedQuery.includes(normalizedCandidate)) {
    return 0.92;
  }
  const queryTokens = tokenize(normalizedQuery);
  const candidateTokens = tokenize(normalizedCandidate);
  const overlap = queryTokens.filter((token) => candidateTokens.includes(token)).length;
  const tokenScore = queryTokens.length ? overlap / queryTokens.length : 0;
  const editDistance = levenshtein(normalizedQuery, normalizedCandidate);
  const editScore = 1 - editDistance / Math.max(normalizedQuery.length, normalizedCandidate.length, 1);
  return Math.max(0, Math.min(1, tokenScore * 0.55 + editScore * 0.45));
}

function resolveAsset(query) {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return null;
  }
  if (ASSET_ALIASES[normalized]) {
    return {
      ...ASSET_ALIASES[normalized],
      matchedOn: normalized,
      matchScore: 1,
    };
  }

  const candidates = Object.entries(ASSET_ALIASES)
    .map(([alias, asset]) => ({
      alias,
      asset,
      score: Math.max(fuzzyScore(normalized, alias), fuzzyScore(normalized, asset.symbol), fuzzyScore(normalized, asset.label)),
    }))
    .sort((a, b) => b.score - a.score);

  if (candidates[0] && candidates[0].score >= 0.72) {
    return {
      ...candidates[0].asset,
      matchedOn: candidates[0].alias,
      matchScore: Number(candidates[0].score.toFixed(2)),
    };
  }

  if (/^[a-z]{1,5}$/.test(normalized)) {
    return {
      symbol: normalized.toUpperCase(),
      category: "single_stock",
      label: "Single stock",
      matchedOn: normalized,
      matchScore: 0.7,
    };
  }
  if (/^[a-z]{6}$/.test(normalized)) {
    return {
      symbol: `C:${normalized.toUpperCase()}`,
      category: "currency",
      label: `${normalized.slice(0, 3).toUpperCase()}/${normalized.slice(3).toUpperCase()}`,
      matchedOn: normalized,
      matchScore: 0.7,
    };
  }
  return {
    symbol: normalized.toUpperCase(),
    category: "unknown",
    label: "Unmapped asset",
    matchedOn: normalized,
    matchScore: 0.4,
  };
}

function getRegionBias(region) {
  return region === "EU"
    ? {
        regime: "selective european accumulation",
        broad: "add slowly",
        gold: "hold",
        reserve: "hold",
        highBeta: "review carefully",
      }
    : {
        regime: "defensive accumulation",
        broad: "add slowly",
        gold: "buy",
        reserve: "hold",
        highBeta: "avoid",
      };
}

function formatPercent(value) {
  const n = Number(value || 0);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function summarizeNewsHeuristic(headlines, asset) {
  if (!headlines.length) {
    return `${asset.label} does not have a live news summary right now, so TELAJ is leaning more on price action and portfolio role than headline flow.`;
  }
  return `Recent context: ${headlines.slice(0, 2).join(" | ")}. TELAJ treats headlines as context, not as proof.`;
}

async function maybeSummarizeWithModel(asset, quote, headlines, region) {
  const headlineText = headlines.filter(Boolean).slice(0, 3).join(" | ");
  if (!headlineText) {
    return "";
  }

  const prompt = [
    "You are TELAJ, a calm wealth operating system.",
    "Write one short paragraph explaining the market context for this asset.",
    "Do not use hype. Do not give legal, tax, or investment disclaimers.",
    "Mention that headlines are context, not certainty.",
    `Region: ${region}`,
    `Asset: ${asset.symbol} / ${asset.label}`,
    `Last price: ${quote?.price ?? "unknown"}`,
    `Day change: ${quote?.changePct ?? "unknown"}%`,
    `Headlines: ${headlineText}`,
  ].join("\n");

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: "You are TELAJ. Return a single short paragraph in plain English.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      });
      if (response.ok) {
        const payload = await response.json();
        return payload?.choices?.[0]?.message?.content?.trim() || "";
      }
    } catch (error) {
      console.warn("TELAJ asset-check OpenAI summary failed.", error);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      });
      if (response.ok) {
        const payload = await response.json();
        return payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      }
    } catch (error) {
      console.warn("TELAJ asset-check Gemini summary failed.", error);
    }
  }

  return "";
}

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

async function fetchQuote(asset) {
  if (!MASSIVE_API_KEY) {
    return null;
  }

  if (asset.category === "currency") {
    const snapshot = await fetchMassiveJson(`/v2/snapshot/locale/global/markets/forex/tickers/${encodeURIComponent(asset.symbol)}`);
    const ticker = snapshot?.ticker;
    const day = ticker?.day || {};
    const lastQuote = ticker?.lastQuote || {};
    const price = Number(day.close ?? lastQuote.ask ?? lastQuote.bid ?? 0);
    const open = Number(day.open ?? 0);
    const changePct = open ? ((price - open) / open) * 100 : 0;
    return {
      price,
      changePct,
      source: "Live Massive forex snapshot",
    };
  }

  const [snapshot, previous] = await Promise.all([
    fetchMassiveJson(`/v2/snapshot/locale/us/markets/stocks/tickers/${encodeURIComponent(asset.symbol)}`),
    fetchMassiveJson(`/v2/aggs/ticker/${encodeURIComponent(asset.symbol)}/prev?adjusted=true`),
  ]);

  const ticker = snapshot?.ticker || {};
  const day = ticker?.day || {};
  const previousBar = previous?.results?.[0] || {};
  const price = Number(day.close ?? previousBar.c ?? 0);
  const open = Number(day.open ?? previousBar.o ?? 0);
  const changePct = open ? ((price - open) / open) * 100 : 0;

  return {
    price,
    changePct,
    source: "Live Massive market data",
  };
}

async function fetchRecentCandles(asset) {
  if (!MASSIVE_API_KEY) {
    return [];
  }
  try {
    if (asset.category === "currency") {
      const payload = await fetchMassiveJson(
        `/v2/aggs/ticker/${encodeURIComponent(asset.symbol)}/range/1/day/${new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10)}/${new Date().toISOString().slice(0, 10)}?adjusted=true&sort=asc&limit=12`
      );
      return (payload?.results || []).slice(-8).map((bar) => ({
        open: Number(bar.o || 0),
        high: Number(bar.h || 0),
        low: Number(bar.l || 0),
        close: Number(bar.c || 0),
        volume: Number(bar.v || 0),
        timestamp: bar.t || 0,
      }));
    }
    const payload = await fetchMassiveJson(
      `/v2/aggs/ticker/${encodeURIComponent(asset.symbol)}/range/1/day/${new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10)}/${new Date().toISOString().slice(0, 10)}?adjusted=true&sort=asc&limit=12`
    );
    return (payload?.results || []).slice(-8).map((bar) => ({
      open: Number(bar.o || 0),
      high: Number(bar.h || 0),
      low: Number(bar.l || 0),
      close: Number(bar.c || 0),
      volume: Number(bar.v || 0),
      timestamp: bar.t || 0,
    }));
  } catch (error) {
    console.warn("TELAJ candle lookup failed.", error);
    return [];
  }
}

async function fetchHeadlines(asset) {
  if (!MASSIVE_API_KEY || asset.category === "currency") {
    return [];
  }
  try {
    const payload = await fetchMassiveJson(`/v2/reference/news?ticker=${encodeURIComponent(asset.symbol)}&limit=3&order=desc&sort=published_utc`);
    return (payload?.results || [])
      .map((item) => item?.title)
      .filter(Boolean)
      .slice(0, 3);
  } catch (error) {
    console.warn("TELAJ asset-check news lookup failed.", error);
    return [];
  }
}

function buildFeatures(asset, quote, candles) {
  const closes = candles.map((item) => Number(item.close || 0)).filter((value) => Number.isFinite(value) && value > 0);
  const firstClose = closes[0] || Number(quote?.price || 0);
  const lastClose = closes[closes.length - 1] || Number(quote?.price || 0);
  const candleChangePct = firstClose > 0 ? ((lastClose / firstClose) - 1) * 100 : Number(quote?.changePct || 0);
  const positiveCandles = candles.filter((bar) => bar.close >= bar.open).length;
  const candleWinRate = candles.length ? positiveCandles / candles.length : 0.5;
  const ranges = candles.map((bar) => {
    const base = Math.max(Number(bar.close || 0), 0.0001);
    return ((Number(bar.high || 0) - Number(bar.low || 0)) / base) * 100;
  });
  const volatilityPct = ranges.length ? ranges.reduce((sum, value) => sum + value, 0) / ranges.length : Math.abs(Number(quote?.changePct || 0));
  return {
    shortMomentumPct: candleChangePct,
    candleWinRate,
    volatilityPct,
    matchScore: Number(asset.matchScore || 0),
  };
}

function classifyModelScore(asset, quote, candles, region) {
  const features = buildFeatures(asset, quote, candles);
  const regionBias = region === "EU" ? 0.08 : 0.12;
  const categoryBias = {
    broad_etf: 0.22,
    reserve: 0.18,
    gold: 0.12,
    single_stock: -0.04,
    high_beta: -0.12,
    commodity_proxy: -0.08,
    currency: -0.14,
    unknown: -0.18,
  }[asset.category] ?? -0.1;

  const momentumScore = Math.max(-1, Math.min(1, features.shortMomentumPct / 4));
  const candleScore = (features.candleWinRate - 0.5) * 1.2;
  const volatilityPenalty = Math.max(0, (features.volatilityPct - 2.2) / 4.5);
  const score =
    0.5 +
    regionBias +
    categoryBias +
    momentumScore * 0.16 +
    candleScore * 0.12 -
    volatilityPenalty * 0.22 +
    (features.matchScore - 0.7) * 0.08;

  return {
    score: Math.max(0.05, Math.min(0.95, score)),
    features,
  };
}

function buildLiveOpinion(asset, quote, region, candles = []) {
  const bias = getRegionBias(region);
  const change = Number(quote?.changePct || 0);
  const model = classifyModelScore(asset, quote, candles, region);
  const baseConfidence = Math.round(model.score * 100);

  if (asset.category === "reserve") {
    return {
      signal: bias.reserve,
      confidence: Math.max(68, baseConfidence),
      why: "Short-duration reserve capital is still serving a defensive role better than forcing unnecessary risk.",
      risk: "Reserve assets protect capital more than they compound aggressively.",
      safer: "Keep them as ballast rather than expecting them to drive long-term growth.",
      horizon: "0-12 months",
      model,
    };
  }

  if (asset.category === "gold") {
    return {
      signal: bias.gold,
      confidence: Math.max(change > 1 ? 74 : 69, baseConfidence),
      why: "Gold still fits as a defensive hedge when macro conditions remain uneven and the portfolio needs ballast.",
      risk: "Gold can lag if real yields rise and risk appetite broadens cleanly.",
      safer: "Use it as a hedge sleeve rather than as the center of the portfolio.",
      horizon: "3-12 months",
      model,
    };
  }

  if (asset.category === "broad_etf") {
    const signal = model.score >= 0.68 ? "buy" : change <= -1 ? "buy" : bias.broad;
    return {
      signal,
      confidence: Math.max(change <= -1 ? 76 : 71, baseConfidence),
      why: "Broad exposure is still the cleaner way to add risk when TELAJ wants participation without concentration.",
      risk: "A better entry can appear later if market breadth weakens again.",
      safer: "Build the position in tranches instead of trying to perfectly time one entry.",
      horizon: "6-18 months",
      model,
    };
  }

  if (asset.category === "high_beta") {
    return {
      signal: model.score >= 0.62 ? "add slowly" : bias.highBeta,
      confidence: Math.max(58, baseConfidence),
      why: "High-beta growth still needs more selectivity than the core portfolio. TELAJ does not want momentum to replace discipline.",
      risk: "Crowded growth leadership can reverse quickly when momentum rolls over.",
      safer: "Prefer a broad ETF core before increasing concentrated beta.",
      horizon: "1-6 months",
      model,
    };
  }

  if (asset.category === "currency") {
    return {
      signal: model.score >= 0.62 ? "hold" : "review carefully",
      confidence: Math.max(52, baseConfidence),
      why: "TELAJ does not treat directional currency trades as a core allocation move unless there is a specific business or hedging reason.",
      risk: "FX moves can reverse quickly and are often driven by short-term macro surprises.",
      safer: "Keep currency decisions tied to travel, business needs, or hedging rather than short-term speculation.",
      horizon: "0-3 months",
      model,
    };
  }

  if (asset.category === "commodity_proxy") {
    return {
      signal: model.score >= 0.64 ? "add slowly" : "review carefully",
      confidence: Math.max(54, baseConfidence),
      why: "Commodity proxies can be useful, but they are more cyclical and event-driven than TELAJ’s core sleeves.",
      risk: "Supply shocks and macro swings can make commodity trades noisy and hard to size calmly.",
      safer: "Keep these as smaller tactical sleeves rather than core holdings.",
      horizon: "1-6 months",
      model,
    };
  }

  const signal = model.score >= 0.68 ? "add slowly" : change <= -2 ? "add slowly" : "review carefully";
  return {
    signal,
    confidence: Math.max(change <= -2 ? 62 : 57, baseConfidence),
    why: "TELAJ sees this as a single-name idea, not a core allocation. The bar for conviction should be higher than for broad ETFs.",
    risk: "Single-stock concentration can distort a calm portfolio plan very quickly.",
    safer: "Size individual names modestly and let diversified sleeves do most of the heavy lifting.",
    horizon: "1-12 months",
    model,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const query = req.body?.query;
  const region = req.body?.region === "EU" ? "EU" : "US";
  const asset = resolveAsset(query);

  if (!asset) {
    res.status(400).json({ error: "A ticker or asset name is required." });
    return;
  }

  let quote = null;
  let headlines = [];
  let candles = [];
  let liveError = "";

  try {
    quote = await fetchQuote(asset);
    headlines = await fetchHeadlines(asset);
    candles = await fetchRecentCandles(asset);
  } catch (error) {
    liveError = error instanceof Error ? error.message : "Live data unavailable";
  }

  const opinion = buildLiveOpinion(asset, quote, region, candles);
  const modelSummary = await maybeSummarizeWithModel(asset, quote, headlines, region);
  const newsSummary = modelSummary || summarizeNewsHeuristic(headlines, asset);

  res.status(200).json({
    analysis: {
      ticker: asset.symbol.replace(/^C:/, ""),
      label: asset.label,
      signal: opinion.signal,
      confidence: opinion.confidence,
      why: opinion.why,
      risk: opinion.risk,
      safer: opinion.safer,
      horizon: opinion.horizon,
      source: quote?.source || (MASSIVE_API_KEY ? "TELAJ fallback context" : "TELAJ fallback context"),
      priceLine: quote?.price ? `${asset.symbol.replace(/^C:/, "")} ${quote.price} · ${formatPercent(quote.changePct)} today` : "",
      newsSummary,
      live: Boolean(quote),
      liveError,
      region,
      regime: getRegionBias(region).regime,
      matchScore: asset.matchScore,
      matchedOn: asset.matchedOn,
      modelScore: Math.round((opinion.model?.score || 0.5) * 100),
      features: opinion.model?.features || null,
      candles,
    },
  });
};
