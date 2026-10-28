"""Create and fill the SQLite DB. Run: python3 db/seed.py   (drops and recreates; same result every run)

Seed with REAL-looking data for your demo story (real place names, believable text) and give
the demo records fixed IDs. Pre-fill ai_cache with the AI answers your demo script expects,
so the "wow" moment works with no API key and no Wi-Fi.
"""
import json, os, sqlite3, sys
from pathlib import Path

HERE = Path(__file__).parent
# Only read argv when run directly: under `uvicorn main:app`, argv[1] would be "main:app".
DB = Path(sys.argv[1] if __name__ == "__main__" and len(sys.argv) > 1
          else os.environ.get("DB_PATH", HERE / "app.db"))

ITEMS = [  # (id, title, body, label, created_at)
    (1, "Demo item", "The record your demo script opens first.", None, "2026-10-01T09:00:00Z"),
    (2, "Second item", "Another believable record.", "example", "2026-10-02T10:30:00Z"),
]

# Expected AI outputs for demo inputs: (kind, inputs, output). Must match what ai.py would be asked.
DEMO_AI = [
    ("label", ["Demo item\nThe record your demo script opens first."],
     {"label": "important", "reason": "Pre-seeded demo answer"}),
]


def main():
    import ai  # backend/ai.py (main.py puts backend/ on sys.path)
    DB.unlink(missing_ok=True)
    con = sqlite3.connect(DB)
    con.executescript((HERE / "schema.sql").read_text())
    con.executemany("INSERT INTO items VALUES (?,?,?,?,?)", ITEMS)
    for kind, inputs, out in DEMO_AI:
        con.execute("INSERT INTO ai_cache VALUES (?,?)",
                    (ai.cache_key(kind, [s.encode() for s in inputs]), json.dumps(out)))
    con.commit()
    counts = {t: con.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0] for t in ("items", "ai_cache")}
    con.close()
    print(f"Seeded {DB}: {counts}")


if __name__ == "__main__":
    sys.path.insert(0, str(HERE.parent))
    main()
