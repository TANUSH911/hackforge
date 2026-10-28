"""All Gemini calls. Every function returns (result_dict, ai_source) or (None, None) on failure.
Order: sha256 cache -> Gemini (15s timeout, 1 retry) -> None (caller falls back to manual)."""
import hashlib, json, os

CATEGORIES = {"pothole", "garbage", "streetlight", "water_leak", "other"}
VERDICTS = {"fixed", "not_fixed", "unclear"}
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

CLASSIFY_PROMPT = ("You classify Bengaluru civic issue photos. Reply JSON only: "
                   '{"category": one of pothole|garbage|streetlight|water_leak|other, '
                   '"summary": one line, max 80 chars, describing the issue}.')
VERIFY_PROMPT = ("Image 1 is the BEFORE photo of a reported civic issue, image 2 is the AFTER photo an official "
                 "uploaded to close it. Is the issue fixed at the same spot? Reply JSON only: "
                 '{"verdict": fixed|not_fixed|unclear, "confidence": 0-1, "reason": max 100 chars}.')


def _mime(b):
    return "image/png" if b[:4] == b"\x89PNG" else "image/webp" if b[8:12] == b"WEBP" else "image/jpeg"


def _gemini(prompt, images):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return None
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=key, http_options=types.HttpOptions(timeout=15000))  # ms
    parts = [types.Part.from_bytes(data=b, mime_type=_mime(b)) for b in images] + [prompt]
    for _ in range(2):  # one retry
        try:
            r = client.models.generate_content(
                model=MODEL, contents=parts,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0))
            return json.loads(r.text)
        except Exception:
            continue
    return None


def _cached(con, kind, images, prompt, valid):
    key = hashlib.sha256(kind.encode() + b"".join(images)).hexdigest()
    row = con.execute("SELECT response_json FROM ai_cache WHERE key=?", (key,)).fetchone()
    if row:
        return json.loads(row[0]), "cache"
    out = _gemini(prompt, images)
    if not isinstance(out, dict) or not valid(out):
        return None, None
    con.execute("INSERT OR REPLACE INTO ai_cache (key, response_json) VALUES (?,?)", (key, json.dumps(out)))
    return out, "gemini"


def classify(con, photo):
    def ok(d):
        return d.get("category") in CATEGORIES and isinstance(d.get("summary"), str) and d["summary"].strip()
    out, src = _cached(con, "classify", [photo], CLASSIFY_PROMPT, ok)
    if out:
        out["summary"] = out["summary"].strip()[:80]
    return out, src


def verify(con, before, after):
    def ok(d):
        c = d.get("confidence")
        return (d.get("verdict") in VERDICTS and isinstance(c, (int, float)) and 0 <= c <= 1
                and isinstance(d.get("reason"), str))
    out, src = _cached(con, "verify", [before, after], VERIFY_PROMPT, ok)
    if out:
        out["reason"] = out["reason"].strip()[:100]
        out["confidence"] = float(out["confidence"])
    return out, src
