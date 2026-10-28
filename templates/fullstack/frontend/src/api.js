import { mock } from './mock.js'

// Mock mode: build and demo the UI before the backend exists. Turn off with VITE_USE_MOCK=false.
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api'

async function req(path, opts = {}) {
  if (opts.json) opts = { ...opts, method: opts.method || 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(opts.json) }
  let r
  try { r = await fetch(BASE + path, opts) } catch { throw Object.assign(new Error("Can't reach the server. Check your connection and try again."), { status: 0 }) }
  if (!r.ok) {
    const body = await r.json().catch(() => ({}))
    throw Object.assign(new Error(typeof body.detail === 'string' ? body.detail : `Request failed (${r.status})`), { status: r.status })
  }
  return r.json()
}

// One function per endpoint in brief/contract.md.
export const api = USE_MOCK ? mock : {
  items: () => req('/items'),
  item: id => req(`/items/${id}`),
  createItem: data => req('/items', { json: data }),
  label: id => req(`/items/${id}/label`, { method: 'POST' }),
}
