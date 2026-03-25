const {
  getBearerToken,
  getServiceRoleConfigError,
  getSupabaseUser,
  requestSupabaseAdmin,
} = require("./_supabase");
const {
  normalizeVaultIngestPayload,
  prepareChunkRows,
} = require("./services/document_ingest_service");

async function insertDocument(record) {
  const rows = await requestSupabaseAdmin("documents", {
    method: "POST",
    body: record,
    prefer: "return=representation",
  });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

async function insertDocumentJob(record) {
  const rows = await requestSupabaseAdmin("document_jobs", {
    method: "POST",
    body: record,
    prefer: "return=representation",
  });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

async function insertDocumentChunks(rows) {
  if (!rows.length) {
    return [];
  }
  const inserted = await requestSupabaseAdmin("document_chunks", {
    method: "POST",
    body: rows,
    prefer: "return=representation",
  });
  return Array.isArray(inserted) ? inserted : [];
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const configError = getServiceRoleConfigError();
  if (configError) {
    res.status(500).json({ error: configError });
    return;
  }

  const accessToken = getBearerToken(req);
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

  const payload = normalizeVaultIngestPayload(req.body);
  if (!payload.rawText) {
    res.status(400).json({ error: "rawText is required for vault ingest." });
    return;
  }

  const now = new Date().toISOString();

  try {
    // Canonical document row. The frontend still performs PDF parsing for now.
    const documentRecord = await insertDocument({
      user_id: user.id,
      title: payload.title,
      file_name: payload.fileName,
      doc_type: payload.docType,
      source: payload.source,
      status: "processing",
      storage_path: payload.storagePath,
      raw_text: payload.rawText,
      summary: payload.summary,
      extracted_facts: payload.extractedFacts,
      updated_at: now,
    });

    const startedJob = await insertDocumentJob({
      document_id: documentRecord.id,
      stage: "ingest",
      status: "processing",
      error: "",
    });

    const chunkRows = await prepareChunkRows({
      documentId: documentRecord.id,
      userId: user.id,
      rawText: payload.rawText,
    });

    await insertDocumentChunks(chunkRows);

    await requestSupabaseAdmin(`documents?id=eq.${documentRecord.id}`, {
      method: "PATCH",
      body: {
        status: "ready",
        updated_at: now,
      },
      prefer: "return=representation",
    });

    await requestSupabaseAdmin(`document_jobs?id=eq.${startedJob.id}`, {
      method: "PATCH",
      body: {
        status: "completed",
      },
      prefer: "return=representation",
    });

    res.status(200).json({
      documentId: documentRecord.id,
      chunkCount: chunkRows.length,
      status: "ready",
      embeddingStatus: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY ? "stubbed" : "disabled",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vault ingest failed";
    res.status(500).json({ error: message });
  }
};
