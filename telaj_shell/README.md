# TELAJ Shell

Static TELAJ product shell for drag-and-drop deployment on Netlify.

## Files

- `index.html`
- `config.js`
- `config.example.js`
- `styles.css`
- `app.js`
- `mock-api/family-dashboard.json`
- `mock-api/allocation.json`
- `mock-api/signals.json`
- `mock-api/progress.json`
- `mock-api/real-estate.json`
- `mock-api/family-profile.json`
- `api/financial-position.js`
- `api/asset-check.js`
- `api/home.js`
- `api/vault-ingest.js`

## Deploy

1. Open Netlify.
2. Use the manual drag-and-drop deploy flow.
3. Upload the contents of this folder, or zip this folder and upload it.

## Configure Supabase

1. Open `config.example.js`.
2. Copy its values into `config.js`.
3. Set:
   - `supabaseUrl`
   - `supabaseAnonKey`
4. Redeploy the shell.

Use the Supabase:
- Project URL
- anon public key

Do not use the service role key in the frontend.

## Notes

- This is a static shell only.
- It does not replace the current Streamlit app.
- It is meant to visualize the TELAJ product direction while the backend and API layers are still being extracted.
- The shell now loads endpoint-shaped mock JSON files from `mock-api/`.
- Later, those URLs can be replaced with real TELAJ API routes without changing the UI structure.
- The TELAJ home screen now reads from a single dashboard payload:
  - `mock-api/family-dashboard.json`
- The Life Matrix onboarding currently derives `HouseholdProfile`, `BehaviorProfile`, and `GoalProfile` locally in the browser.
- `mock-api/family-profile.json` documents the future API shape for that derived profile layer.
- The intent step can now call a Vercel serverless route:
  - `/api/intent-analysis`
- The market-tape asset checker can now call:
  - `/api/asset-check`
- The first TELAJ backend brain endpoint is now available at:
  - `/api/home`
- Vault ingest now has a canonical backend route:
  - `/api/vault-ingest`
- Supported model env vars for Vercel:
  - `TELAJ_MODEL_PROVIDER`
    - `openai`
    - `gemini`
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL`
- If no provider key is available, the route falls back to TELAJ's local heuristic analysis.
- The auth shell reads Supabase frontend config from:
  - `config.js`
- The financial-position route needs backend env vars in Vercel:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- The vault-ingest route also needs:
  - `SUPABASE_SERVICE_ROLE_KEY`
- The live asset-check route can use:
  - `MASSIVE_API_KEY`
  - optional `MASSIVE_API_BASE`
- The required table/policies are defined in:
  - `../sql/financial_positions.sql`
  - `../sql/vault_documents.sql`

## Vault Ingest Flow

The current Vault UI still parses text-based PDFs in the browser with `pdf.js`.

The new backend route:
- accepts authenticated `POST /api/vault-ingest`
- receives parsed text plus metadata from the frontend
- writes a canonical row to `documents`
- chunks the raw text into `document_chunks`
- creates an ingest row in `document_jobs`
- leaves embeddings stubbed if no model key is configured

Expected payload shape:

```json
{
  "title": "Milan apartment deed",
  "fileName": "milan-deed.pdf",
  "docType": "property",
  "source": "uploaded-pdf",
  "storagePath": "",
  "rawText": "full parsed pdf text",
  "summary": "Short extracted summary",
  "extractedFacts": ["Owner: Mario Rossi", "Address: Via Roma 10"]
}
```

Response shape:

```json
{
  "documentId": "uuid",
  "chunkCount": 6,
  "status": "ready",
  "embeddingStatus": "disabled"
}
```

Follow-up steps for embeddings and retrieval:
- generate real embeddings server-side when a model key is configured
- add a `vault-search` route that queries `document_chunks`
- store uploaded files in Supabase Storage and save canonical `storage_path`
- add OCR for scanned image-only PDFs before ingest
