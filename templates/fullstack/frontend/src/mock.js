// Fake responses copied from brief/contract.md examples. Keep them identical in shape to the real API.
const wait = (ms = 400) => new Promise(r => setTimeout(r, ms))
let items = [
  { id: 2, title: 'Second item', body: 'Another believable record.', label: 'example', created_at: '2026-10-02T10:30:00Z' },
  { id: 1, title: 'Demo item', body: 'The record your demo script opens first.', label: null, created_at: '2026-10-01T09:00:00Z' },
]

export const mock = {
  items: async () => (await wait(), items),
  item: async id => {
    await wait()
    const it = items.find(i => i.id === Number(id))
    if (!it) throw Object.assign(new Error('Item not found'), { status: 404 })
    return it
  },
  createItem: async ({ title, body = '' }) => {
    await wait()
    const it = { id: Math.max(...items.map(i => i.id)) + 1, title, body, label: null, created_at: new Date().toISOString() }
    items = [it, ...items]
    return it
  },
  label: async () => (await wait(900), { label: 'important', reason: 'Pre-seeded demo answer', ai_source: 'cache' }),
}
