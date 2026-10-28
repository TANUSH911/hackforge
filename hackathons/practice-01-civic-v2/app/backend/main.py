"""ProofClose API. Run: uvicorn main:app --port 8000 (see README.md)."""
import math, os, sqlite3, sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

import ai

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "db"))
import seed  # noqa: E402

DB = seed.DB
MAX_BYTES = 8 * 1024 * 1024
MERGE_M = 50
OUTSIDE_M = 5000  # shortcut: ward = ward of nearest seeded ticket within 5 km; swap for wards.geojson point-in-polygon
STATUSES = {"OPEN", "REOPENED", "VERIFIED"}

if not DB.exists() or os.environ.get("RESEED") == "1":
    seed.main()

app = FastAPI(title="ProofClose")
app.add_middleware(CORSMiddleware, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
                   allow_methods=["*"], allow_headers=["*"])
api = FastAPI()  # mounted at /api


def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    return con


def now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def dist_m(lat1, lng1, lat2, lng2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lng2 - lng1) / 2) ** 2
    return 2 * 6371000 * math.asin(math.sqrt(a))


async def read_photo(photo: Optional[UploadFile]):
    if photo is None:
        raise HTTPException(400, "photo is required")
    if not (photo.content_type or "").startswith("image/"):
        raise HTTPException(415, "photo must be an image")
    data = await photo.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "photo larger than 8 MB")
    if not data:
        raise HTTPException(400, "photo is empty")
    return data


LIST_COLS = "id,category,department,ward_no,ward_name,lat,lng,status,summary,created_at"


def ticket_rows(con, where="", args=()):
    return [dict(r) for r in con.execute(
        f"SELECT {LIST_COLS}, updated_at, escalation_draft, after_photo IS NOT NULL AS has_after_photo, "
        f"(SELECT COUNT(*) FROM reports r WHERE r.ticket_id=t.id) AS report_count FROM tickets t {where} "
        "ORDER BY report_count DESC, created_at ASC", args)]


@api.get("/health")
def health():
    return {"ok": True}


@api.post("/reports", status_code=201)
async def create_report(photo: Optional[UploadFile] = File(None), lat: Optional[float] = Form(None),
                        lng: Optional[float] = Form(None), note: Optional[str] = Form(None),
                        category_override: Optional[str] = Form(None)):
    if lat is None or lng is None:
        raise HTTPException(400, "lat and lng are required")
    if category_override and category_override not in ai.CATEGORIES:
        raise HTTPException(400, f"category_override must be one of {sorted(ai.CATEGORIES)}")
    data = await read_photo(photo)
    con = db()
    try:
        if category_override:
            cat, summary, src = category_override, None, "manual"
        else:
            out, src = ai.classify(con, data)
            cat, summary = (out["category"], out["summary"]) if out else ("other", None)
            src = src or "manual"
        note = (note or "").strip() or None
        open_t = con.execute("SELECT id,lat,lng,ward_no,ward_name FROM tickets WHERE status!='VERIFIED' AND category=?",
                             (cat,)).fetchall()
        near = min(open_t, key=lambda t: dist_m(lat, lng, t["lat"], t["lng"]), default=None)
        if near and dist_m(lat, lng, near["lat"], near["lng"]) <= MERGE_M:
            tid, merged = near["id"], True
            con.execute("UPDATE tickets SET updated_at=? WHERE id=?", (now(), tid))
        else:
            merged = False
            all_t = con.execute("SELECT lat,lng,ward_no,ward_name FROM tickets WHERE ward_no IS NOT NULL").fetchall()
            w = min(all_t, key=lambda t: dist_m(lat, lng, t["lat"], t["lng"]), default=None)
            wno, wname = (w["ward_no"], w["ward_name"]) if w and dist_m(lat, lng, w["lat"], w["lng"]) <= OUTSIDE_M \
                else (None, "Outside BBMP")
            summary = summary or (note[:80] if note else f"{cat.replace('_', ' ').capitalize()} reported by citizen")
            ts = now()
            tid = con.execute("INSERT INTO tickets (category,department,ward_no,ward_name,lat,lng,summary,before_photo,"
                              "created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
                              (cat, seed.DEPT[cat], wno, wname, lat, lng, summary, data, ts, ts)).lastrowid
        # seeded tickets may lack a before photo: the first real report supplies it
        con.execute("UPDATE tickets SET before_photo=? WHERE id=? AND before_photo IS NULL", (data, tid))
        rid = con.execute("INSERT INTO reports (ticket_id,lat,lng,note,photo,ai_source,created_at) VALUES (?,?,?,?,?,?,?)",
                          (tid, lat, lng, note, data, src, now())).lastrowid
        con.commit()
        t = ticket_rows(con, "WHERE id=?", (tid,))[0]
    finally:
        con.close()
    return {"report_id": rid, "ticket_id": tid, "merged": merged, "ticket_report_count": t["report_count"],
            "category": t["category"], "department": t["department"], "ward_no": t["ward_no"],
            "ward_name": t["ward_name"], "summary": t["summary"], "ai_source": src}


@api.get("/tickets")
def list_tickets(ward_no: Optional[int] = None, status: Optional[str] = None):
    where, args = [], []
    if ward_no is not None:
        where.append("ward_no=?"), args.append(ward_no)
    if status:
        sts = [s.strip().upper() for s in status.split(",") if s.strip()]
        if bad := [s for s in sts if s not in STATUSES]:
            raise HTTPException(400, f"unknown status: {','.join(bad)}")
        where.append(f"status IN ({','.join('?' * len(sts))})"), args.extend(sts)
    con = db()
    try:
        rows = ticket_rows(con, ("WHERE " + " AND ".join(where)) if where else "", args)
    finally:
        con.close()
    keep = LIST_COLS.split(",") + ["report_count"]
    return [{k: r[k] for k in keep} for r in rows]


def get_ticket_or_404(con, tid):
    rows = ticket_rows(con, "WHERE id=?", (tid,))
    if not rows:
        raise HTTPException(404, "ticket not found")
    return rows[0]


@api.get("/tickets/{tid}")
def ticket_detail(tid: int):
    con = db()
    try:
        t = get_ticket_or_404(con, tid)
        t["has_after_photo"] = bool(t["has_after_photo"])
        t["reports"] = [dict(r) for r in con.execute(
            "SELECT id,note,created_at FROM reports WHERE ticket_id=? ORDER BY created_at, id", (tid,))]
        t["verifications"] = [dict(r) for r in con.execute(
            "SELECT id,verdict,confidence,reason,ai_source,created_at FROM verifications WHERE ticket_id=? "
            "ORDER BY created_at DESC, id DESC", (tid,))]
    finally:
        con.close()
    return t


@api.get("/tickets/{tid}/photo")
def ticket_photo(tid: int, kind: str = "before"):
    if kind not in ("before", "after"):
        raise HTTPException(400, "kind must be before or after")
    con = db()
    try:
        row = con.execute(f"SELECT {kind}_photo FROM tickets WHERE id=?", (tid,)).fetchone()
    finally:
        con.close()
    if not row or row[0] is None:
        raise HTTPException(404, "ticket or photo not found")
    return Response(row[0], media_type="image/jpeg")


@api.post("/tickets/{tid}/close")
async def close_ticket(tid: int, photo: Optional[UploadFile] = File(None),
                       verdict_override: Optional[str] = Form(None)):
    if verdict_override and verdict_override not in ("fixed", "not_fixed"):
        raise HTTPException(400, "verdict_override must be fixed or not_fixed")
    con = db()
    try:
        t = get_ticket_or_404(con, tid)
        if t["status"] == "VERIFIED":
            raise HTTPException(409, "ticket already verified")
        data = await read_photo(photo)
        before = con.execute("SELECT before_photo FROM tickets WHERE id=?", (tid,)).fetchone()[0]
        if verdict_override:
            verdict, conf, reason, src = verdict_override, 1.0, f"Marked {verdict_override.replace('_', ' ')} by officer", "manual"
        else:
            # no before photo -> same manual fallback as an AI failure (contract change: no 422)
            out, src = ai.verify(con, before, data) if before else (None, None)
            if out:
                verdict, conf, reason = out["verdict"], out["confidence"], out["reason"]
            else:
                verdict, conf, src = "unclear", 0.0, "manual"
                reason = "Automatic check unavailable" if before else "No before photo to compare"
        fixed = verdict == "fixed" and conf >= 0.6
        status = "VERIFIED" if fixed else "REOPENED"
        draft = None
        if not fixed:
            days = (datetime.now(timezone.utc) - datetime.fromisoformat(t["created_at"].replace("Z", "+00:00"))).days
            ward = f"Ward {t['ward_no']} {t['ward_name']}" if t["ward_no"] else t["ward_name"]
            n = t["report_count"]
            draft = (f"To: Assistant Executive Engineer, {ward}\nTicket #{tid} ({t['category']}, {n} citizen "
                     f"report{'s' * (n != 1)}) was marked closed but photo verification "
                     f"{'found it NOT fixed' if verdict == 'not_fixed' else 'could not confirm a fix'}: {reason}. Open {days} days. Please reassign and attach proof of repair.")
        ts = now()
        con.execute("INSERT INTO verifications (ticket_id,verdict,confidence,reason,ai_source,created_at) "
                    "VALUES (?,?,?,?,?,?)", (tid, verdict, conf, reason, src, ts))
        con.execute("UPDATE tickets SET after_photo=?, status=?, escalation_draft=?, updated_at=? WHERE id=?",
                    (data, status, draft, ts, tid))
        con.commit()
    finally:
        con.close()
    return {"status": status, "verdict": verdict, "confidence": conf, "reason": reason,
            "escalation_draft": draft, "ai_source": src}


@api.get("/wards/{ward_no}/stats")
def ward_stats(ward_no: int):
    # shortcut: computed from our own tickets (demo data); swap for OpenCity ward_stats.json when built
    con = db()
    try:
        rows = con.execute("SELECT ward_name, department, COUNT(*) n, SUM(status='VERIFIED') v FROM tickets "
                           "WHERE ward_no=? GROUP BY department ORDER BY n DESC, department", (ward_no,)).fetchall()
    finally:
        con.close()
    if not rows:
        raise HTTPException(404, "ward not in stats")
    pct = lambda v, n: round(100 * v / n, 1)
    total, closed = sum(r["n"] for r in rows), sum(r["v"] for r in rows)
    return {"ward_no": ward_no, "ward_name": rows[0]["ward_name"], "total": total, "closed_pct": pct(closed, total),
            "by_category": [{"category": r["department"], "total": r["n"], "closed_pct": pct(r["v"], r["n"])} for r in rows],
            "source": "demo data"}


app.mount("/api", api)
app.get("/health")(health)
