# ProofClose backend

```
cd app/backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
set -a; [ -f ../.env ] && . ../.env; set +a      # optional: GEMINI_API_KEY etc.
.venv/bin/uvicorn main:app --port 8000
```
API at http://localhost:8000/api (health also at /health). DB seeds on start if missing; `RESEED=1` forces it.
Without `GEMINI_API_KEY` everything runs in fallback mode (`ai_source: "manual"`).

Render: build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`, set `RESEED=1` and `GEMINI_API_KEY`.
