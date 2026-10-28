"""API server. Run: .venv/bin/uvicorn main:app --port 8000   (see ../README.md)
Replace the `items` example with your endpoints from brief/contract.md."""
import os, sqlite3, sys
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import ai

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "db"))
import seed  # noqa: E402

if not seed.DB.exists() or os.environ.get("RESEED") == "1":
    seed.main()

app = FastAPI(title="HackForge app")
app.add_middleware(CORSMiddleware, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
                   allow_methods=["*"], allow_headers=["*"])
api = FastAPI()  # mounted at /api


def db():
    con = sqlite3.connect(seed.DB)
    con.row_factory = sqlite3.Row
    return con


def now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


@app.get("/health")
@api.get("/health")
def health():
    return {"ok": True, "ai": "on" if os.environ.get("GEMINI_API_KEY") else "demo-cache only"}


class ItemIn(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    body: str = Field(default="", max_length=2000)


@api.get("/items")
def list_items():
    with db() as con:
        return [dict(r) for r in con.execute("SELECT * FROM items ORDER BY id DESC")]


@api.get("/items/{item_id}")
def get_item(item_id: int):
    with db() as con:
        r = con.execute("SELECT * FROM items WHERE id=?", (item_id,)).fetchone()
    if not r:
        raise HTTPException(404, "Item not found")
    return dict(r)


@api.post("/items", status_code=201)
def create_item(item: ItemIn):
    with db() as con:
        cur = con.execute("INSERT INTO items (title, body, created_at) VALUES (?,?,?)",
                          (item.title, item.body, now()))
        new_id = cur.lastrowid
    return get_item(new_id)


LABEL_PROMPT = 'Label this item. Reply JSON only: {"label": one or two words, "reason": max 80 chars}.'


@api.post("/items/{item_id}/label")
def label_item(item_id: int):
    """Example AI endpoint: cache -> Gemini -> honest fallback."""
    item = get_item(item_id)
    with db() as con:
        out, source = ai.ask_json(
            con, "label", LABEL_PROMPT,
            valid=lambda d: isinstance(d.get("label"), str) and isinstance(d.get("reason"), str),
            texts=[f"{item['title']}\n{item['body']}"])
        if not out:
            return {"label": None, "reason": "Couldn't check automatically. Pick a label manually.",
                    "ai_source": "unavailable"}
        con.execute("UPDATE items SET label=? WHERE id=?", (out["label"][:40], item_id))
    return {**out, "ai_source": source}


app.mount("/api", api)
