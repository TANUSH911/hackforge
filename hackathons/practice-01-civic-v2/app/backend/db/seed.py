"""Create and fill proofclose.db. Stdlib only. Idempotent: schema.sql drops and recreates.

Data is hand-written but realistic (real Bellandur / Horamavu streets). No OpenCity slice is
loaded here; ward stats live in backend/data/ward_stats.json (separate task).
Photos: if db/photos/ticket_<id>.jpg exists it becomes that ticket's before_photo, else NULL.
Usage: python3 seed.py [path/to/db]   (default: next to this file, or $DB_PATH)
"""
import os, sqlite3, sys
from pathlib import Path

HERE = Path(__file__).parent
DB = Path(sys.argv[1] if __name__ == "__main__" and len(sys.argv) > 1 else os.environ.get("DB_PATH", HERE / "proofclose.db"))

DEPT = {"pothole": "Roads & Infrastructure", "garbage": "Solid Waste Management",
        "streetlight": "Electrical", "water_leak": "BWSSB", "other": "General"}

# Ward numbers use the BBMP 198-ward numbering the demo script quotes (150 Bellandur, 25 Horamavu).
# Demo location (Ravi): 12.92600, 77.67620. Ticket 1 is ~20 m north of it -> his report merges in.
# (id, category, ward_no, ward_name, lat, lng, status, summary, created_at)
TICKETS = [
    (1, "pothole", 150, "Bellandur", 12.92618, 77.67620, "OPEN",
     "Deep pothole on Bellandur Main Rd near Central Mall junction", "2026-10-21T08:12:00Z"),
    (2, "garbage", 150, "Bellandur", 12.93210, 77.68390, "OPEN",
     "Garbage dumped on footpath, Green Glen Layout 2nd Cross", "2026-10-19T17:40:00Z"),
    (3, "streetlight", 150, "Bellandur", 12.91980, 77.67070, "REOPENED",
     "Three streetlights out on Sarjapur Rd service road", "2026-10-02T19:05:00Z"),
    (4, "water_leak", 150, "Bellandur", 12.93590, 77.69080, "VERIFIED",
     "BWSSB pipe leaking onto Kadubeesanahalli underpass road", "2026-09-28T06:30:00Z"),
    (5, "pothole", 25, "Horamavu", 13.02670, 77.66040, "OPEN",
     "Cluster of potholes on Horamavu Main Rd near Agara lake bus stop", "2026-10-15T09:20:00Z"),
    (6, "garbage", 25, "Horamavu", 13.03120, 77.65410, "OPEN",
     "Overflowing waste bin outside Kalkere Govt School", "2026-10-24T07:55:00Z"),
]
# (ticket_id, lat, lng, note, created_at)
REPORTS = [
    (1, 12.92618, 77.67620, "Two-wheeler skidded here last night, about a foot wide", "2026-10-21T08:12:00Z"),
    (2, 12.93210, 77.68390, "Been here 4 days, dogs spreading it", "2026-10-19T17:40:00Z"),
    (2, 12.93222, 77.68401, None, "2026-10-20T08:03:00Z"),
    (3, 12.91980, 77.67070, "Dark stretch, unsafe for women walking from bus stop", "2026-10-02T19:05:00Z"),
    (3, 12.91991, 77.67062, "Marked closed on Sahaaya but lights still off", "2026-10-12T20:10:00Z"),
    (4, 12.93590, 77.69080, "Clean water wasting since morning", "2026-09-28T06:30:00Z"),
    (5, 13.02670, 77.66040, "BMTC buses swerving around these", "2026-10-15T09:20:00Z"),
    (5, 13.02681, 77.66052, None, "2026-10-16T18:44:00Z"),
    (5, 13.02662, 77.66031, "Water-filled after rain, can't see depth", "2026-10-22T07:15:00Z"),
    (6, 13.03120, 77.65410, "Kids pass this daily", "2026-10-24T07:55:00Z"),
]
# (ticket_id, verdict, confidence, reason, created_at)
VERIFICATIONS = [
    (3, "not_fixed", 0.81, "After photo shows the same unlit poles; no new fixtures visible", "2026-10-12T11:00:00Z"),
    (4, "fixed", 0.92, "Road surface dry, leak point patched and resurfaced", "2026-10-03T10:30:00Z"),
]
ESCALATION_3 = ("To: Assistant Executive Engineer, Ward 150 Bellandur\n"
                "Ticket #3 (streetlight, 2 citizen reports) was marked closed but photo verification "
                "found it NOT fixed: After photo shows the same unlit poles; no new fixtures visible. "
                "Open 10 days. Please reassign and attach proof of repair.")


def photo(tid):
    p = HERE / "photos" / f"ticket_{tid}.jpg"
    return p.read_bytes() if p.exists() else None


def main():
    con = sqlite3.connect(DB)
    con.executescript((HERE / "schema.sql").read_text())
    for t in TICKETS:
        tid, cat, wno, wname, lat, lng, status, summary, ts = t
        con.execute("INSERT INTO tickets (id,category,department,ward_no,ward_name,lat,lng,status,summary,"
                    "before_photo,escalation_draft,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (tid, cat, DEPT[cat], wno, wname, lat, lng, status, summary, photo(tid),
                     ESCALATION_3 if tid == 3 else None, ts, ts))
    con.executemany("INSERT INTO reports (ticket_id,lat,lng,note,ai_source,created_at) VALUES (?,?,?,?,'seed',?)", REPORTS)
    con.executemany("INSERT INTO verifications (ticket_id,verdict,confidence,reason,ai_source,created_at) "
                    "VALUES (?,?,?,?,'seed',?)", VERIFICATIONS)
    con.commit()
    n = {t: con.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0] for t in ("tickets", "reports", "verifications", "ai_cache")}
    assert n == {"tickets": 6, "reports": 10, "verifications": 2, "ai_cache": 0}, n
    con.close()
    print(f"seeded {DB}: {n}")


if __name__ == "__main__":
    main()
