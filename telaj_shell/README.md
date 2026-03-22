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
