const MASSIVE_API_BASE = process.env.MASSIVE_API_BASE || "https://api.massive.com";
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY || process.env.POLYGON_API_KEY || process.env.POLYGON_API_TOKEN;
const FINNHUB_API_BASE = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "";

const {
  getConfigError,
  getBearerToken,
  getSupabaseUser,
  insertAssetSignalTrack,
  getAssetSignalTracks,
} = require("./_supabase");

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

async function fetchFinnhubJson(path) {
  if (!FINNHUB_API_KEY) {
    return null;
  }
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${FINNHUB_API_BASE}${path}${separator}token=${encodeURIComponent(FINNHUB_API_KEY)}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Finnhub request failed: ${response.status} ${message}`);
  }
  return response.json();
}

function getFinnhubSymbol(symbol) {
  const normalized = String(symbol || "");
  if (normalized.startsWith("C:") && normalized.length >= 8) {
    const raw = normalized.replace(/^C:/, "");
    return `OANDA:${raw.slice(0, 3)}_${raw.slice(3)}`;
  }
  return normalized.replace(/^C:/, "");
}

async function fetchCurrentPrice(symbol) {
  let lastError = null;

  if (MASSIVE_API_KEY) {
    try {
      if (String(symbol).startsWith("C:")) {
        const snapshot = await fetchMassiveJson(`/v2/snapshot/locale/global/markets/forex/tickers/${encodeURIComponent(symbol)}`);
        const ticker = snapshot?.ticker;
        const day = ticker?.day || {};
        const lastQuote = ticker?.lastQuote || {};
        const price = Number(day.close ?? lastQuote.ask ?? lastQuote.bid ?? 0) || null;
        if (price) {
          return price;
        }
      } else {
        const snapshot = await fetchMassiveJson(`/v2/snapshot/locale/us/markets/stocks/tickers/${encodeURIComponent(symbol)}`);
        const ticker = snapshot?.ticker || {};
        const day = ticker?.day || {};
        const price = Number(day.close || day.lastTrade?.p || 0) || null;
        if (price) {
          return price;
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (FINNHUB_API_KEY) {
    try {
      const payload = await fetchFinnhubJson(`/quote?symbol=${encodeURIComponent(getFinnhubSymbol(symbol))}`);
      return Number(payload?.c || 0) || null;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  return null;
}

function buildTrackView(track, currentPrice) {
  const entryPrice = Number(track.entry_price || 0);
  const notional = Number(track.notional || 10000);
  const livePrice = Number(currentPrice || entryPrice || 0);
  const units = entryPrice > 0 ? notional / entryPrice : 0;
  const currentValue = units * livePrice;
  const pnl = currentValue - notional;
  const pnlPct = notional > 0 ? (pnl / notional) * 100 : 0;
  return {
    id: track.id,
    query: track.query,
    symbol: track.symbol,
    label: track.label,
    signal: track.signal,
    region: track.region,
    entryPrice,
    currentPrice: livePrice,
    notional,
    trackedAt: track.tracked_at,
    pnl,
    pnlPct,
    status: pnl >= 0 ? "winning" : "losing",
  };
}

module.exports = async function handler(req, res) {
  const configError = getConfigError();
  if (configError) {
    res.status(500).json({ error: configError });
    return;
  }

  const accessToken = getBearerToken(req);
  if (!accessToken) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const user = await getSupabaseUser(accessToken);

    if (req.method === "POST") {
      const symbol = String(req.body?.symbol || "").trim().toUpperCase();
      const query = String(req.body?.query || symbol).trim();
      const label = String(req.body?.label || "").trim();
      const signal = String(req.body?.signal || "").trim();
      const region = req.body?.region === "EU" ? "EU" : "US";
      const entryPrice = Number(req.body?.entryPrice || 0);
      const notional = Number(req.body?.notional || 10000);

      if (!symbol || !entryPrice) {
        res.status(400).json({ error: "symbol and entryPrice are required." });
        return;
      }

      const row = await insertAssetSignalTrack(accessToken, {
        user_id: user.id,
        query,
        symbol,
        label,
        region,
        signal,
        entry_price: entryPrice,
        notional,
      });

      res.status(200).json({
        tracked: buildTrackView(row, entryPrice),
      });
      return;
    }

    if (req.method === "GET") {
      const tracks = await getAssetSignalTracks(accessToken, user.id, 8);
      const enriched = await Promise.all(
        tracks.map(async (track) => {
          let currentPrice = null;
          try {
            currentPrice = await fetchCurrentPrice(track.symbol);
          } catch (error) {
            currentPrice = null;
          }
          return buildTrackView(track, currentPrice);
        })
      );

      const actionable = enriched.filter((item) => Number.isFinite(item.pnlPct));
      const successRate =
        actionable.length > 0
          ? (actionable.filter((item) => item.pnl >= 0).length / actionable.length) * 100
          : 0;

      res.status(200).json({
        tracks: enriched,
        summary: {
          trackedCount: enriched.length,
          successRate,
        },
      });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Asset track request failed" });
  }
};
