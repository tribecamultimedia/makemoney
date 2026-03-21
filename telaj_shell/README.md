# TELAJ Shell

Static TELAJ product shell for drag-and-drop deployment on Netlify.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `mock-api/home.json`
- `mock-api/allocation.json`
- `mock-api/signals.json`
- `mock-api/progress.json`
- `mock-api/real-estate.json`

## Deploy

1. Open Netlify.
2. Use the manual drag-and-drop deploy flow.
3. Upload the contents of this folder, or zip this folder and upload it.

## Notes

- This is a static shell only.
- It does not replace the current Streamlit app.
- It is meant to visualize the TELAJ product direction while the backend and API layers are still being extracted.
- The shell now loads endpoint-shaped mock JSON files from `mock-api/`.
- Later, those URLs can be replaced with real TELAJ API routes without changing the UI structure.
