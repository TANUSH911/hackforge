# ProofClose frontend
```
npm install
cp .env.example .env    # VITE_USE_MOCK=true (default) runs with no backend
npm run dev             # http://localhost:5173  (/ citizen, /officer engineer)
npm run build
```
Real backend: set `VITE_USE_MOCK=false`, `VITE_API_URL=http://localhost:8000` (default). `vercel.json` rewrites all paths to index.html so `/officer` loads.
