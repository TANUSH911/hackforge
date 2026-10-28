import { mock } from './mock.js'
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api'

async function req(path, opts) {
  let r
  try { r = await fetch(BASE + path, opts) } catch { throw Object.assign(new Error("Can't reach the server. Check your connection and try again."), { status: 0 }) }
  if (!r.ok) {
    const body = await r.json().catch(() => ({}))
    throw Object.assign(new Error(typeof body.detail === 'string' ? body.detail : `Request failed (${r.status})`), { status: r.status })
  }
  return r.json()
}
const qs = o => new URLSearchParams(Object.entries(o).filter(([, v]) => v != null && v !== '')).toString()

export const api = USE_MOCK ? mock : {
  tickets: q => req('/tickets?' + qs(q)),
  ticket: id => req(`/tickets/${id}`),
  stats: w => req(`/wards/${w}/stats`),
  report: form => req('/reports', { method: 'POST', body: form }),
  close: (id, form) => req(`/tickets/${id}/close`, { method: 'POST', body: form }),
}
export const photoUrl = (id, kind) => USE_MOCK ? null : `${BASE}/tickets/${id}/photo?kind=${kind}`
