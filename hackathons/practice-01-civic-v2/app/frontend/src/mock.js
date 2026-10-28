// In-memory fake of brief/contract.md so the demo runs with no backend. Example data = seed.py.
const DEPT = { pothole: 'Roads & Infrastructure', garbage: 'Solid Waste Management', streetlight: 'Electrical', water_leak: 'BWSSB', other: 'General' }
const t = (id, category, ward_no, ward_name, lat, lng, status, report_count, summary, created_at) =>
  ({ id, category, department: DEPT[category], ward_no, ward_name, lat, lng, status, report_count, summary, created_at, updated_at: created_at, has_after_photo: false, escalation_draft: null, reports: [], verifications: [] })
const tickets = [
  t(1, 'pothole', 150, 'Bellandur', 12.92618, 77.6762, 'OPEN', 1, 'Deep pothole on Bellandur Main Rd near Central Mall junction', '2026-10-21T08:12:00Z'),
  t(2, 'garbage', 150, 'Bellandur', 12.9321, 77.6839, 'OPEN', 2, 'Garbage dumped on footpath, Green Glen Layout 2nd Cross', '2026-10-19T17:40:00Z'),
  t(3, 'streetlight', 150, 'Bellandur', 12.9198, 77.6707, 'REOPENED', 2, 'Three streetlights out on Sarjapur Rd service road', '2026-10-02T19:05:00Z'),
  t(4, 'water_leak', 150, 'Bellandur', 12.9359, 77.6908, 'VERIFIED', 1, 'BWSSB pipe leaking onto Kadubeesanahalli underpass road', '2026-09-28T06:30:00Z'),
  t(5, 'pothole', 25, 'Horamavu', 13.0267, 77.6604, 'OPEN', 3, 'Cluster of potholes on Horamavu Main Rd near Agara lake bus stop', '2026-10-15T09:20:00Z'),
  t(6, 'garbage', 25, 'Horamavu', 13.0312, 77.6541, 'OPEN', 1, 'Overflowing waste bin outside Kalkere Govt School', '2026-10-24T07:55:00Z'),
]
tickets[0].reports = [{ id: 1, note: 'Two-wheeler skidded here last night, about a foot wide', created_at: '2026-10-21T08:12:00Z' }]
tickets[1].reports = [{ id: 2, note: 'Been here 4 days, dogs spreading it', created_at: '2026-10-19T17:40:00Z' }, { id: 3, note: null, created_at: '2026-10-20T08:03:00Z' }]
tickets[2].reports = [{ id: 4, note: 'Dark stretch, unsafe for women walking from bus stop', created_at: '2026-10-02T19:05:00Z' }, { id: 5, note: 'Marked closed on Sahaaya but lights still off', created_at: '2026-10-12T20:10:00Z' }]
tickets[2].verifications = [{ id: 1, verdict: 'not_fixed', confidence: 0.81, reason: 'After photo shows the same unlit poles; no new fixtures visible', ai_source: 'seed', created_at: '2026-10-12T11:00:00Z' }]
tickets[2].escalation_draft = 'To: Assistant Executive Engineer, Ward 150 Bellandur\nTicket #3 (streetlight, 2 citizen reports) was marked closed but photo verification found it NOT fixed: After photo shows the same unlit poles; no new fixtures visible. Open 10 days. Please reassign and attach proof of repair.'
tickets[3].verifications = [{ id: 2, verdict: 'fixed', confidence: 0.92, reason: 'Road surface dry, leak point patched and resurfaced', ai_source: 'seed', created_at: '2026-10-03T10:30:00Z' }]
tickets[3].has_after_photo = true

const STATS = { 150: { ward_no: 150, ward_name: 'Bellandur', total: 2140, closed_pct: 84.1, by_category: [
  { category: 'Road Maintenance', total: 612, closed_pct: 57.2 }, { category: 'Solid Waste', total: 701, closed_pct: 88.4 }, { category: 'Electrical', total: 388, closed_pct: 95.9 }] },
  25: { ward_no: 25, ward_name: 'Horamavu', total: 1310, closed_pct: 86.3, by_category: [
  { category: 'Road Maintenance', total: 402, closed_pct: 61.0 }, { category: 'Solid Waste', total: 455, closed_pct: 90.1 }] } }

const wait = (ms = 900) => new Promise(r => setTimeout(r, ms))
const err = (status, detail) => Object.assign(new Error(detail), { status })
const list = ({ ward_no, status }) => tickets
  .filter(x => (!ward_no || x.ward_no == ward_no) && (!status || status.split(',').includes(x.status)))
  .sort((a, b) => b.report_count - a.report_count || a.created_at.localeCompare(b.created_at))
  .map(({ reports, verifications, escalation_draft, has_after_photo, updated_at, ...rest }) => rest)
let closeAttempts = 0, nextReport = 11

export const mock = {
  tickets: async q => (await wait(400), list(q)),
  ticket: async id => { await wait(300); const x = tickets.find(x => x.id == id); if (!x) throw err(404, 'Ticket not found'); return structuredClone(x) },
  stats: async w => { await wait(300); if (!STATS[w]) throw err(404, 'Ward not in stats'); return STATS[w] },
  report: async form => {
    await wait(1800)
    const category = form.get('category_override') || 'pothole'
    const near = Math.abs(form.get('lat') - 12.926) < 0.001 && Math.abs(form.get('lng') - 77.6762) < 0.001
    let x = tickets.find(x => x.category === category && x.status !== 'VERIFIED' && near && x.id === 1)
    const merged = !!x
    if (!x) { x = t(tickets.length + 1, category, 150, 'Bellandur', +form.get('lat'), +form.get('lng'), 'OPEN', 0, 'New ' + category.replace('_', ' ') + ' reported by citizen', new Date().toISOString()); tickets.push(x) }
    x.report_count++; x.reports.push({ id: nextReport, note: form.get('note') || null, created_at: new Date().toISOString() })
    return { report_id: nextReport++, ticket_id: x.id, merged, ticket_report_count: x.report_count, category, department: DEPT[category], ward_no: x.ward_no, ward_name: x.ward_name, summary: x.summary, ai_source: form.get('category_override') ? 'manual' : 'gemini' }
  },
  close: async (id, form) => {
    await wait(2200)
    const x = tickets.find(x => x.id == id); if (!x) throw err(404, 'Ticket not found')
    if (x.status === 'VERIFIED') throw err(409, 'Ticket already verified')
    const o = form.get('verdict_override')
    // Demo script: first proof attempt is rejected, second passes.
    const fixed = o ? o === 'fixed' : closeAttempts++ % 2 === 1
    const v = fixed ? { verdict: 'fixed', confidence: o ? 1 : 0.91, reason: 'Road resurfaced; pothole no longer visible' }
                    : { verdict: 'not_fixed', confidence: o ? 1 : 0.86, reason: 'Pothole still visible in the same spot' }
    x.status = fixed ? 'VERIFIED' : 'REOPENED'; x.has_after_photo = true
    x.escalation_draft = fixed ? null : `To: Assistant Executive Engineer, Ward ${x.ward_no} ${x.ward_name}\nTicket #${x.id} (${x.category}, ${x.report_count} citizen reports) was marked closed but photo verification found it NOT fixed: ${v.reason}. Open 7 days. Please reassign and attach proof of repair.`
    x.verifications.unshift({ id: Date.now(), ...v, ai_source: o ? 'manual' : 'gemini', created_at: new Date().toISOString() })
    return { status: x.status, ...v, escalation_draft: x.escalation_draft, ai_source: o ? 'manual' : 'gemini' }
  },
}
