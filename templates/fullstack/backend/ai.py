"""All AI calls go through ask_json(). Order: demo cache -> Gemini (15s timeout, 1 retry) -> None.
On None the caller must fall back honestly (manual choice / "couldn't check automatically"),
never invent a result.

Env: GEMINI_API_KEY (free at aistudio.google.com), GEMINI_MODEL.
"""
import hashlib, json, os

MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


def cache_key(kind, inputs):
    """inputs: list of bytes (text.encode() or raw image bytes)."""
    return hashlib.sha256(kind.encode() + b"".join(inputs)).hexdigest()


def _mime(b):
    return "image/png" if b[:4] == b"\x89PNG" else "image/webp" if b[8:12] == b"WEBP" else "image/jpeg"


def _gemini(prompt, texts, images):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return None
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=key, http_options=types.HttpOptions(timeout=15000))  # ms
    parts = [types.Part.from_bytes(data=b, mime_type=_mime(b)) for b in images] + texts + [prompt]
    for _ in range(2):  # one retry
        try:
            r = client.models.generate_content(
                model=MODEL, contents=parts,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0))
            return json.loads(r.text)
        except Exception:
            continue
    return None


def ask_json(con, kind, prompt, valid, texts=(), images=()):
    """Return (dict, source) with source in {"cache", "gemini"}, or (None, None) if unavailable.
    valid(d) -> bool checks the shape, so a malformed answer never reaches the user."""
    texts, images = list(texts), list(images)
    key = cache_key(kind, [t.encode() for t in texts] + images)
    row = con.execute("SELECT response_json FROM ai_cache WHERE key=?", (key,)).fetchone()
    if row:
        return json.loads(row[0]), "cache"
    out = _gemini(prompt, texts, images)
    if not isinstance(out, dict) or not valid(out):
        return None, None
    con.execute("INSERT OR REPLACE INTO ai_cache VALUES (?,?)", (key, json.dumps(out)))
    con.commit()
    return out, "gemini"
