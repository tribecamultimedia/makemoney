const EMBEDDING_DIMENSIONS = 1536;
const DEFAULT_CHUNK_SIZE = 1200;
const DEFAULT_CHUNK_OVERLAP = 120;

function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function estimateTokenCount(value) {
  return Math.max(1, Math.ceil(String(value || "").trim().split(/\s+/).filter(Boolean).length * 1.35));
}

function splitIntoParagraphs(text) {
  return normalizeWhitespace(text)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function chunkDocumentText(text, options = {}) {
  const targetSize = Number(options.chunkSize || DEFAULT_CHUNK_SIZE);
  const overlap = Number(options.chunkOverlap || DEFAULT_CHUNK_OVERLAP);
  const paragraphs = splitIntoParagraphs(text);
  const chunks = [];
  let buffer = "";

  function pushChunk(content) {
    const clean = normalizeWhitespace(content);
    if (!clean) {
      return;
    }
    const chunkIndex = chunks.length;
    chunks.push({
      chunkIndex,
      content: clean,
      tokenCount: estimateTokenCount(clean),
      pageRef: "",
      sectionLabel: chunkIndex === 0 ? "opening" : `section-${chunkIndex + 1}`,
    });
  }

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (candidate.length <= targetSize) {
      buffer = candidate;
      continue;
    }
    if (buffer) {
      pushChunk(buffer);
      const overlapSeed = buffer.slice(Math.max(0, buffer.length - overlap)).trim();
      buffer = overlapSeed ? `${overlapSeed}\n\n${paragraph}` : paragraph;
      if (buffer.length <= targetSize) {
        continue;
      }
    }

    let remaining = paragraph;
    while (remaining.length > targetSize) {
      pushChunk(remaining.slice(0, targetSize));
      remaining = remaining.slice(Math.max(targetSize - overlap, 1)).trim();
    }
    buffer = remaining;
  }

  if (buffer) {
    pushChunk(buffer);
  }

  return chunks;
}

async function generateEmbeddingStub(content) {
  if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    return null;
  }
  void content;
  return null;
}

async function prepareChunkRows({ documentId, userId, rawText }) {
  const chunks = chunkDocumentText(rawText);
  const rows = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbeddingStub(chunk.content);
    rows.push({
      document_id: documentId,
      user_id: userId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      token_count: chunk.tokenCount,
      page_ref: chunk.pageRef,
      section_label: chunk.sectionLabel,
      embedding,
    });
  }
  return rows;
}

function normalizeVaultIngestPayload(body = {}) {
  const rawText = normalizeWhitespace(body.rawText || body.text || "");
  return {
    title: String(body.title || body.fileName || "Untitled document").trim(),
    fileName: String(body.fileName || "document.pdf").trim(),
    docType: String(body.docType || body.category || "other").trim() || "other",
    source: String(body.source || "vault-upload").trim() || "vault-upload",
    status: String(body.status || "received").trim() || "received",
    storagePath: String(body.storagePath || body.digitalLocation || "").trim(),
    rawText,
    summary: String(body.summary || body.extractedSummary || "").trim(),
    extractedFacts: Array.isArray(body.extractedFacts)
      ? body.extractedFacts.filter(Boolean)
      : Array.isArray(body.extracted_facts)
        ? body.extracted_facts.filter(Boolean)
        : [],
  };
}

module.exports = {
  EMBEDDING_DIMENSIONS,
  chunkDocumentText,
  normalizeVaultIngestPayload,
  prepareChunkRows,
};
