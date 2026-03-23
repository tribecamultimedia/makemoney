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

function resolveAsset(query) {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return null;
  }
  if (ASSET_ALIASES[normalized]) {
    return ASSET_ALIASES[normalized];
  }
  if (/^[a-z]{1,5}$/.test(normalized)) {
    return {
      symbol: normalized.toUpperCase(),
      category: "single_stock",
      label: "Single stock",
    };
  }
  if (/^[a-z]{6}$/.test(normalized)) {
    return {
      symbol: `C:${normalized.toUpperCase()}`,
      category: "currency",
      label: `${normalized.slice(0, 3).toUpperCase()}/${normalized.slice(3).toUpperCase()}`,
    };
  }
  return {
    symbol: normalized.toUpperCase(),
    category: "unknown",
    label: "Unmapped asset",
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

function buildLiveOpinion(asset, quote, region) {
  const bias = getRegionBias(region);
  const change = Number(quote?.changePct || 0);

  if (asset.category === "reserve") {
    return {
      signal: bias.reserve,
      confidence: 78,
      why: "Short-duration reserve capital is still serving a defensive role better than forcing unnecessary risk.",
      risk: "Reserve assets protect capital more than they compound aggressively.",
      safer: "Keep them as ballast rather than expecting them to drive long-term growth.",
      horizon: "0-12 months",
    };
  }

  if (asset.category === "gold") {
    return {
      signal: bias.gold,
      confidence: change > 1 ? 74 : 69,
      why: "Gold still fits as a defensive hedge when macro conditions remain uneven and the portfolio needs ballast.",
      risk: "Gold can lag if real yields rise and risk appetite broadens cleanly.",
      safer: "Use it as a hedge sleeve rather than as the center of the portfolio.",
      horizon: "3-12 months",
    };
  }

  if (asset.category === "broad_etf") {
    const signal = change <= -1 ? "buy" : bias.broad;
    return {
      signal,
      confidence: change <= -1 ? 76 : 71,
      why: "Broad exposure is still the cleaner way to add risk when TELAJ wants participation without concentration.",
      risk: "A better entry can appear later if market breadth weakens again.",
      safer: "Build the position in tranches instead of trying to perfectly time one entry.",
      horizon: "6-18 months",
    };
  }

  if (asset.category === "high_beta") {
    return {
      signal: bias.highBeta,
      confidence: 66,
      why: "High-beta growth still needs more selectivity than the core portfolio. TELAJ does not want momentum to replace discipline.",
      risk: "Crowded growth leadership can reverse quickly when momentum rolls over.",
      safer: "Prefer a broad ETF core before increasing concentrated beta.",
      horizon: "1-6 months",
    };
  }

  if (asset.category === "currency") {
    return {
      signal: "review carefully",
      confidence: 58,
      why: "TELAJ does not treat directional currency trades as a core allocation move unless there is a specific business or hedging reason.",
      risk: "FX moves can reverse quickly and are often driven by short-term macro surprises.",
      safer: "Keep currency decisions tied to travel, business needs, or hedging rather than short-term speculation.",
      horizon: "0-3 months",
    };
  }

  if (asset.category === "commodity_proxy") {
    return {
      signal: "review carefully",
      confidence: 56,
      why: "Commodity proxies can be useful, but they are more cyclical and event-driven than TELAJ’s core sleeves.",
      risk: "Supply shocks and macro swings can make commodity trades noisy and hard to size calmly.",
      safer: "Keep these as smaller tactical sleeves rather than core holdings.",
      horizon: "1-6 months",
    };
  }

  const signal = change <= -2 ? "add slowly" : change >= 3 ? "review carefully" : "review carefully";
  return {
    signal,
    confidence: change <= -2 ? 62 : 57,
    why: "TELAJ sees this as a single-name idea, not a core allocation. The bar for conviction should be higher than for broad ETFs.",
    risk: "Single-stock concentration can distort a calm portfolio plan very quickly.",
    safer: "Size individual names modestly and let diversified sleeves do most of the heavy lifting.",
    horizon: "1-12 months",
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
  let liveError = "";

  try {
    quote = await fetchQuote(asset);
    headlines = await fetchHeadlines(asset);
  } catch (error) {
    liveError = error instanceof Error ? error.message : "Live data unavailable";
  }

  const opinion = buildLiveOpinion(asset, quote, region);
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
    },
  });
};
