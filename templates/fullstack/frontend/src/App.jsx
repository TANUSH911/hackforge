import { useEffect, useState } from 'react'
import { api, USE_MOCK } from './api.js'

// Tiny router: every screen has its own URL, so a refresh during the demo keeps your place.
function usePath() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => { const f = () => setPath(location.pathname); addEventListener('popstate', f); return () => removeEventListener('popstate', f) }, [])
  return path
}
export function go(to) { history.pushState(null, '', to); dispatchEvent(new PopStateEvent('popstate')) }

// Loading / error / data for any API call. Every screen gets all three states for free.
function useApi(fn, deps) {
  const [s, setS] = useState({ loading: true })
  const load = () => { setS({ loading: true }); fn().then(data => setS({ data }), error => setS({ error })) }
  useEffect(load, deps)
  return { ...s, reload: load }
}

const Skeleton = () => <div className="space-y-3"><div className="skel h-20" /><div className="skel h-20" /></div>
const ErrorBox = ({ error, retry }) => (
  <div className="card p-5 text-center">
    <p className="font-semibold">Something went wrong</p>
    <p className="text-slate mt-1">{error.message}</p>
    {retry && <button className="btn btn-soft mt-4" onClick={retry}>Try again</button>}
  </div>
)

function Home() {
  const { loading, error, data, reload } = useApi(api.items, [])
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  async function add(e) {
    e.preventDefault(); if (!title.trim() || busy) return
    setBusy(true)
    try { await api.createItem({ title }); setTitle(''); reload() } catch (err) { alert(err.message) } finally { setBusy(false) }
  }
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Tagline that says what this does.</h1>
      <p className="text-slate mt-2">One sentence on who it's for and why it matters.</p>
      <form onSubmit={add} className="card p-4 mt-6 flex gap-3">
        <input className="flex-1 px-4 rounded-full bg-lavender outline-none" placeholder="New item" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="btn btn-primary" disabled={busy || !title.trim()}>{busy ? 'Adding…' : 'Add'}</button>
      </form>
      <div className="mt-6">
        {loading ? <Skeleton /> : error ? <ErrorBox error={error} retry={reload} /> : data.length === 0
          ? <p className="text-slate text-center py-10">Nothing here yet. Add the first one above.</p>
          : <ul className="space-y-3">{data.map(it => (
              <li key={it.id}><button className="card p-4 w-full text-left hover:shadow-lg transition" onClick={() => go(`/items/${it.id}`)}>
                <span className="font-semibold">{it.title}</span>
                {it.label && <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-lavender">{it.label}</span>}
              </button></li>))}</ul>}
      </div>
    </>
  )
}

function Detail({ id }) {
  const { loading, error, data, reload } = useApi(() => api.item(id), [id])
  const [ai, setAi] = useState(null)
  const [busy, setBusy] = useState(false)
  async function runAi() {
    setBusy(true)
    try { setAi(await api.label(id)) } catch (err) { setAi({ reason: err.message, ai_source: 'unavailable' }) } finally { setBusy(false) }
  }
  if (loading) return <Skeleton />
  if (error) return <ErrorBox error={error} retry={reload} />
  return (
    <>
      <button className="text-primary font-medium" onClick={() => go('/')}>← Back</button>
      <h1 className="text-2xl font-bold mt-3">{data.title}</h1>
      <p className="text-slate mt-2">{data.body}</p>
      <button className="btn btn-primary mt-6 w-full" onClick={runAi} disabled={busy}>{busy ? 'Thinking…' : 'Run AI'}</button>
      {ai && (
        <div className={`card p-6 mt-4 pop ${ai.label ? '' : 'border-amber-300'}`}>
          <p className="text-3xl font-bold">{ai.label ?? 'Not checked'}</p>
          <p className="text-slate mt-1">{ai.reason}</p>
          <p className="text-xs text-slate mt-3">source: {ai.ai_source}</p>
        </div>
      )}
    </>
  )
}

export default function App() {
  const path = usePath()
  const m = path.match(/^\/items\/(\d+)/)
  return (
    <div className="min-h-screen">
      <header className="bg-night text-white">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button className="font-bold" onClick={() => go('/')}>App name</button>
          {USE_MOCK && <span className="text-xs px-2 py-1 rounded-full bg-white/15">mock data</span>}
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">{m ? <Detail id={m[1]} /> : <Home />}</main>
    </div>
  )
}
