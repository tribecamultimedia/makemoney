const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_PUBLIC_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

const TABLE_NAME = "financial_positions";

function getConfigError() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return "SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_ANON_PUBLIC_KEY) are required.";
  }
  return "";
}

async function getSupabaseUser(accessToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase auth lookup failed: ${response.status} ${message}`);
  }

  return response.json();
}

async function requestSupabase(path, { method = "GET", accessToken, body, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase REST request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

function normalizePayload(body, userId) {
  return {
    user_id: userId,
    liquid_cash: Number(body?.liquid_cash || 0),
    monthly_need: Number(body?.monthly_need || 0),
    investments: Number(body?.investments || 0),
    retirement: Number(body?.retirement || 0),
    real_estate: Number(body?.real_estate || 0),
    business_assets: Number(body?.business_assets || 0),
    credit_card_debt: Number(body?.credit_card_debt || 0),
    loans: Number(body?.loans || 0),
    mortgage_debt: Number(body?.mortgage_debt || 0),
    updated_at: new Date().toISOString(),
  };
}

module.exports = async function handler(req, res) {
  const configError = getConfigError();
  if (configError) {
    res.status(500).json({ error: configError });
    return;
  }

  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!accessToken) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  let user;
  try {
    user = await getSupabaseUser(accessToken);
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : "Auth failed" });
    return;
  }

  if (req.method === "GET") {
    try {
      const rows = await requestSupabase(
        `${TABLE_NAME}?select=*&user_id=eq.${user.id}&limit=1`,
        { accessToken }
      );
      res.status(200).json({ position: Array.isArray(rows) ? rows[0] || null : null });
      return;
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Load failed" });
      return;
    }
  }

  if (req.method === "POST") {
    try {
      const record = normalizePayload(req.body, user.id);
      const rows = await requestSupabase(`${TABLE_NAME}?on_conflict=user_id`, {
        method: "POST",
        accessToken,
        body: record,
        prefer: "resolution=merge-duplicates,return=representation",
      });
      res.status(200).json({ position: Array.isArray(rows) ? rows[0] || record : record });
      return;
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Save failed" });
      return;
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
