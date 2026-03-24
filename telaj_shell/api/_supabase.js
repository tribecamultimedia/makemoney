const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_PUBLIC_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getConfigError() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return "SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_ANON_PUBLIC_KEY) are required.";
  }
  return "";
}

function getServiceRoleConfigError() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.";
  }
  return "";
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
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

async function requestSupabaseAdmin(path, { method = "GET", body, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
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
    throw new Error(`Supabase admin request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function getFinancialPositionRecord(accessToken, userId) {
  const rows = await requestSupabase(`financial_positions?select=*&user_id=eq.${userId}&limit=1`, {
    accessToken,
  });
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function getLatestSignalAction(accessToken, userId) {
  const rows = await requestSupabase(
    `signal_actions?select=*&user_id=eq.${userId}&order=created_at.desc&limit=1`,
    { accessToken }
  );
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function getSignalActionForDecision(accessToken, userId, decisionKey) {
  const rows = await requestSupabase(
    `signal_actions?select=*&user_id=eq.${userId}&decision_key=eq.${encodeURIComponent(decisionKey)}&order=created_at.desc&limit=1`,
    { accessToken }
  );
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function insertSignalAction(accessToken, payload) {
  const rows = await requestSupabase("signal_actions", {
    method: "POST",
    accessToken,
    body: payload,
    prefer: "return=representation",
  });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

async function insertRecommendationHistory(accessToken, payload) {
  const rows = await requestSupabase("recommendation_history", {
    method: "POST",
    accessToken,
    body: payload,
    prefer: "return=representation",
  });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

module.exports = {
  getConfigError,
  getServiceRoleConfigError,
  getBearerToken,
  getSupabaseUser,
  requestSupabase,
  requestSupabaseAdmin,
  getFinancialPositionRecord,
  getLatestSignalAction,
  getSignalActionForDecision,
  insertSignalAction,
  insertRecommendationHistory,
};
