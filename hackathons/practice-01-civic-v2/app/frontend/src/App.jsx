import { useEffect, useState } from 'react'
import { api, photoUrl, USE_MOCK } from './api.js'

const DEMO = { lat: 12.926, lng: 77.6762 }
const CATS = ['pothole', 'garbage', 'streetlight', 'water_leak', 'other']
const ICON = { pothole: '🕳️', garbage: '🗑️', streetlight: '💡', water_leak: '💧', other: '📌' }
const label = c => c.replace('_', ' ').replace(/^./, s => s.toUpperCase())
const ago = iso => { const d = Math.floor((Date.now() - new Date(iso)) / 864e5); return d <= 0 ? 'today' : d === 1 ? '1 day ago' : `${d} days ago` }

function useLoad(fn, deps) {
  const [s, set] = useState({ loading: true })
  const run = () => { set(p => ({ ...p, loading: true, error: null })); fn().then(data => set({ data }), error => set({ error })) }
  useEffect(run, deps)
  return { ...s, reload: run }
}

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#5266eb" /><path d="M9 16.5l4.5 4.5L23 11" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const Spinner = () => <span className="inline-block w-5 h-5 border-[3px] border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
const ErrorBox = ({ error, onRetry }) => (
  <div role="alert" className="card p-4 border-rose-200 bg-rose-50 text-rose-800 flex items-center justify-between gap-3">
    <span>{error.message || 'Something went wrong.'}</span>{onRetry && <button className="btn btn-soft" onClick={onRetry}>Retry</button>}
  </div>
)
const Chip = ({ status }) => {
  const c = { OPEN: 'bg-amber-50 text-amber-800 ring-amber-200', REOPENED: 'bg-rose-50 text-rose-700 ring-rose-200', VERIFIED: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }[status]
  return <span className={`text-sm font-semibold px-3 py-1 rounded-full ring-1 ${c}`}>{status === 'VERIFIED' ? '✓ Verified fixed' : status === 'REOPENED' ? 'Reopened' : 'Open'}</span>
}
function Photo({ src, alt, fallback }) {
  const [bad, setBad] = useState(!src)
  useEffect(() => setBad(!src), [src])
  return bad
    ? <div className="aspect-[4/3] rounded-xl bg-lavender grid place-items-center text-ink2 text-center p-3">{fallback}</div>
    : <img src={src} alt={alt} onError={() => setBad(true)} className="aspect-[4/3] w-full object-cover rounded-xl" />
}

function Honesty({ ward }) {
  const s = useLoad(() => api.stats(ward), [ward])
  if (s.loading) return <div className="skel h-40" />
  if (s.error) return <p className="text-slate">Closure stats for this ward aren't available yet.</p>
  const d = s.data
  return (
    <section className="rounded-2xl bg-night text-white p-6" aria-label="Ward closure honesty">
      <p className="text-sm uppercase tracking-wider text-white/60">Ward {d.ward_no} {d.ward_name} · {d.source || "demo data"}</p>
      <div className="flex items-end gap-3 mt-2"><span className="text-6xl font-bold tabular-nums">{d.closed_pct}%</span><span className="pb-2 text-white/80">marked “Closed” of {d.total.toLocaleString()}</span></div>
      <ul className="mt-5 space-y-3">
        {d.by_category.map(c => (
          <li key={c.category}>
            <div className="flex justify-between text-[15px]"><span>{c.category}</span><span className="tabular-nums font-semibold">{c.closed_pct}%</span></div>
            <div className="h-2 mt-1 rounded-full bg-white/10"><div className={`h-2 rounded-full ${c.closed_pct < 70 ? 'bg-rose-400' : 'bg-[#9cb4e8]'}`} style={{ width: c.closed_pct + '%' }} /></div>
          </li>))}
      </ul>
      <p className="mt-4 text-white/70 text-[15px]">“Closed” isn't the same as fixed. Nobody checks.</p>
    </section>
  )
}

function Citizen() {
  const [file, setFile] = useState(null), [note, setNote] = useState(''), [loc, setLoc] = useState(null)
  const [locMsg, setLocMsg] = useState(''), [busy, setBusy] = useState(false), [res, setRes] = useState(null), [error, setError] = useState(null)
  const preview = file && URL.createObjectURL(file)
  const gps = () => {
    if (!navigator.geolocation) return setLocMsg('GPS not available. Use the demo location.')
    setLocMsg('Finding you…')
    navigator.geolocation.getCurrentPosition(p => { setLoc({ lat: p.coords.latitude, lng: p.coords.longitude, src: 'Your GPS' }); setLocMsg('') },
      () => setLocMsg('Location blocked. Use the demo location instead.'), { timeout: 8000 })
  }
  const send = async override => {
    setBusy(true); setError(null)
    const f = new FormData(); f.append('photo', file); f.append('lat', loc.lat); f.append('lng', loc.lng)
    if (note) f.append('note', note); if (override) f.append('category_override', override)
    try { setRes(await api.report(f)) } catch (e) { setError(e) } finally { setBusy(false) }
  }
  const reset = () => { setFile(null); setNote(''); setRes(null); setError(null) }
  const needsPick = res && res.ai_source === 'manual' && res.category === 'other'

  if (res && !needsPick) return (
    <div className="space-y-4 pop">
      <div className="card p-6">
        <p className="text-emerald-700 font-semibold">✓ Report received · Ticket #{res.ticket_id}</p>
        <h2 className="text-3xl font-bold mt-2">{ICON[res.category]} {label(res.category)}</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-[17px]">
          <div><dt className="text-slate text-sm">Department</dt><dd className="font-semibold">{res.department}</dd></div>
          <div><dt className="text-slate text-sm">Ward</dt><dd className="font-semibold">{res.ward_no ? `${res.ward_no} ${res.ward_name}` : res.ward_name}</dd></div>
        </dl>
        <p className="mt-4 text-ink2">{res.summary}</p>
        {res.merged && (
          <div className="mt-5 rounded-xl bg-lavender p-4 flex items-center gap-4">
            <span className="text-4xl font-bold text-primary tabular-nums">{res.ticket_report_count}</span>
            <span><b>{res.ticket_report_count} reports, 1 ticket.</b><br />A neighbour already reported this. Your report adds weight.</span>
          </div>)}
        <p className="mt-4 text-sm text-slate">Classified by {res.ai_source === 'manual' ? 'you' : 'AI'}. It can only be closed with photo proof.</p>
      </div>
      <button className="btn btn-soft w-full" onClick={reset}>Report another issue</button>
    </div>
  )

  return (
    <div className="space-y-5">
      <div><h1 className="text-[34px] leading-tight font-bold">Closed should mean fixed.</h1>
        <p className="text-lg text-ink2 mt-2">Report a civic issue in 3 taps. Officials can only close it with a photo that proves the fix.</p></div>
      <div className="card p-5 space-y-5">
        <label className="block">
          <span className="font-semibold">1. Photo of the issue</span>
          {preview ? <img src={preview} alt="Your photo of the issue" className="mt-2 w-full aspect-[4/3] max-h-72 object-cover rounded-xl" />
            : <span className="mt-2 flex flex-col items-center justify-center aspect-[4/3] max-h-72 rounded-xl border-2 border-dashed border-[#c9c8e0] bg-lavender/50 text-ink2 cursor-pointer"><span className="text-4xl">📷</span>Tap to take or choose a photo</span>}
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={e => setFile(e.target.files[0] || null)} />
        </label>
        <div>
          <span className="font-semibold">2. Location</span>
          {loc ? <p className="mt-2 text-[17px]">📍 {loc.src} · {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)} <button className="text-primary underline ml-1 min-h-11" onClick={() => setLoc(null)}>change</button></p>
            : <div className="mt-2 flex flex-wrap gap-2"><button className="btn btn-soft" onClick={gps}>Use my location</button>
              <button className="btn btn-soft" onClick={() => setLoc({ ...DEMO, src: 'Demo location (Bellandur)' })}>Use demo location (Bellandur)</button></div>}
          {locMsg && <p className="mt-2 text-slate" role="status">{locMsg}</p>}
        </div>
        <label className="block"><span className="font-semibold">3. Note <span className="font-normal text-slate">(optional)</span></span>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="e.g. Two-wheeler skidded here last night" className="mt-2 w-full rounded-xl border border-[#dddce8] p-3 text-[17px]" /></label>
        {needsPick && (
          <div className="rounded-xl bg-amber-50 p-4" role="alert"><p className="font-semibold">AI is busy. What is it?</p>
            <div className="mt-3 flex flex-wrap gap-2">{CATS.map(c => <button key={c} disabled={busy} className="btn btn-soft" onClick={() => send(c)}>{ICON[c]} {label(c)}</button>)}</div></div>)}
        {error && <ErrorBox error={error} />}
        {!needsPick && <button className="btn btn-primary w-full text-lg" disabled={!file || !loc || busy} onClick={() => send()}>
          {busy ? <><Spinner /> Reading your photo…</> : 'Send report'}</button>}
      </div>
    </div>
  )
}

function Ticket({ id, onBack, onChanged }) {
  const t = useLoad(() => api.ticket(id), [id])
  const [after, setAfter] = useState(null), [busy, setBusy] = useState(false), [res, setRes] = useState(null), [error, setError] = useState(null)
  const [needVerdict, setNeedVerdict] = useState(false), [copied, setCopied] = useState(false)
  const close = async override => {
    setBusy(true); setError(null)
    const f = new FormData(); f.append('photo', after); if (override) f.append('verdict_override', override)
    try {
      const r = await api.close(id, f)
      // AI gave no answer (manual/unclear): let the officer decide instead of a silent reopen.
      setNeedVerdict(!override && r.ai_source === 'manual' && r.verdict === 'unclear')
      setRes(r); t.reload(); onChanged()
    } catch (e) {
      if (e.status === 422) setNeedVerdict(true) // no before photo to compare against
      else setError(e)
    } finally { setBusy(false) }
  }
  if (t.loading && !t.data) return <div className="space-y-3"><div className="skel h-10 w-40" /><div className="skel h-64" /></div>
  if (t.error) return <ErrorBox error={t.error} onRetry={t.reload} />
  const d = t.data, afterSrc = after ? URL.createObjectURL(after) : d.has_after_photo ? photoUrl(id, 'after') : null
  const draft = res ? res.escalation_draft : d.escalation_draft
  const ok = res?.status === 'VERIFIED'
  return (
    <div className="space-y-5">
      <button className="text-primary font-semibold min-h-11" onClick={onBack}>← Back to queue</button>
      <div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-bold">#{d.id} {ICON[d.category]} {label(d.category)}</h2><Chip status={d.status} /></div>
      <p className="text-lg text-ink2 -mt-2">{d.summary}</p>
      <p className="text-slate -mt-3">{d.department} · Ward {d.ward_no} {d.ward_name} · {d.report_count} citizen report{d.report_count > 1 ? 's' : ''} · opened {ago(d.created_at)}</p>

      {res && !needVerdict && (
        <div role="status" className={`pop rounded-2xl p-6 text-white ${ok ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <p className="text-sm uppercase tracking-wider text-white/80">ProofClose AI verdict</p>
          <p className="text-3xl font-bold mt-1">{ok ? '✓ Verified fixed' : '✕ Not fixed: ticket reopened'}</p>
          <p className="text-lg mt-2">{res.reason}</p>
          <p className="mt-3"><span className="text-5xl font-bold tabular-nums">{Math.round(res.confidence * 100)}%</span> <span className="text-white/80">confidence · {res.ai_source === 'manual' ? 'officer decision' : res.ai_source}</span></p>
        </div>)}

      <div className="grid grid-cols-2 gap-3">
        <figure><figcaption className="text-sm font-semibold text-slate mb-1">BEFORE · citizen</figcaption>
          <Photo src={photoUrl(id, 'before')} alt="Before photo from citizen" fallback="No before photo on file" /></figure>
        <figure><figcaption className="text-sm font-semibold text-slate mb-1">AFTER · proof</figcaption>
          <Photo src={afterSrc} alt="After photo uploaded as proof" fallback={d.status === 'VERIFIED' ? 'Proof on file' : 'Awaiting proof of repair'} /></figure>
      </div>

      {d.status !== 'VERIFIED' && (
        <div className="card p-5 space-y-4">
          <p className="font-semibold text-lg">Close with proof</p>
          <label className="btn btn-soft w-full cursor-pointer">📷 {after ? 'Change after photo' : 'Upload after photo'}
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={e => { setAfter(e.target.files[0] || null); setRes(null); setNeedVerdict(false) }} /></label>
          {needVerdict && (
            <div className="rounded-xl bg-amber-50 p-4" role="alert"><p className="font-semibold">AI can't verify this right now. Your call:</p>
              <div className="mt-3 flex gap-2"><button className="btn bg-emerald-600 text-white flex-1" disabled={busy} onClick={() => close('fixed')}>Fixed</button>
                <button className="btn bg-rose-600 text-white flex-1" disabled={busy} onClick={() => close('not_fixed')}>Not fixed</button></div></div>)}
          {error && <ErrorBox error={error} />}
          {!needVerdict && <button className="btn btn-primary w-full text-lg" disabled={!after || busy} onClick={() => close()}>
            {busy ? <><Spinner /> Comparing before and after…</> : 'Submit proof & close'}</button>}
        </div>)}

      {draft && d.status !== 'VERIFIED' && (
        <div className="card p-5">
          <div className="flex justify-between items-center"><p className="font-semibold text-lg">Escalation draft</p>
            <button className="btn btn-soft" onClick={() => navigator.clipboard?.writeText(draft).then(() => setCopied(true))}>{copied ? 'Copied ✓' : 'Copy'}</button></div>
          <label className="sr-only" htmlFor="esc">Escalation draft</label>
          <textarea id="esc" readOnly value={draft} rows={6} className="mt-3 w-full rounded-xl bg-lavender/50 p-3 text-[16px] font-mono" />
        </div>)}

      <div className="card p-5"><p className="font-semibold text-lg">Timeline</p>
        <ul className="mt-3 space-y-3">
          {d.verifications.map(v => <li key={'v' + v.id} className="flex gap-3"><span>{v.verdict === 'fixed' ? '✅' : '❌'}</span><span><b>Proof {v.verdict === 'fixed' ? 'accepted' : 'rejected'}</b> ({Math.round(v.confidence * 100)}%): {v.reason} <span className="text-slate">· {ago(v.created_at)}</span></span></li>)}
          {d.reports.map(r => <li key={'r' + r.id} className="flex gap-3"><span>🧑</span><span><b>Citizen report</b>{r.note ? `: “${r.note}”` : ''} <span className="text-slate">· {ago(r.created_at)}</span></span></li>)}
        </ul></div>
    </div>
  )
}

function Officer() {
  const [ward, setWard] = useState(150), [open, setOpen] = useState(null)
  const q = useLoad(() => api.tickets({ ward_no: ward, status: 'OPEN,REOPENED' }), [ward])
  if (open) return <Ticket id={open} onBack={() => { setOpen(null); q.reload() }} onChanged={() => {}} />
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-[30px] font-bold">Ward engineer queue</h1><p className="text-ink2">Most-reported first. Closing needs photo proof.</p></div>
        <label className="font-semibold">Ward <select value={ward} onChange={e => setWard(+e.target.value)} className="ml-2 min-h-12 rounded-xl border border-[#dddce8] bg-white px-3">
          <option value={150}>150 Bellandur</option><option value={25}>25 Horamavu</option></select></label>
      </div>
      <Honesty ward={ward} />
      {q.loading && !q.data ? <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="skel h-24" />)}</div>
        : q.error ? <ErrorBox error={q.error} onRetry={q.reload} />
        : !q.data.length ? <div className="card p-8 text-center text-ink2">🎉 No open tickets in this ward.</div>
        : <ul className="space-y-3">{q.data.map(t => (
          <li key={t.id}><button onClick={() => setOpen(t.id)} className="card w-full text-left p-4 flex items-center gap-4 hover:ring-2 hover:ring-primary/30">
            <span className="text-3xl" aria-hidden="true">{ICON[t.category]}</span>
            <span className="flex-1 min-w-0"><span className="flex flex-wrap items-center gap-2"><b>#{t.id} {label(t.category)}</b><Chip status={t.status} /></span>
              <span className="block text-ink2 truncate">{t.summary}</span><span className="block text-sm text-slate">{t.department} · opened {ago(t.created_at)}</span></span>
            <span className="text-center"><span className="block text-3xl font-bold tabular-nums text-primary">{t.report_count}</span><span className="text-sm text-slate">reports</span></span>
          </button></li>))}</ul>}
    </div>
  )
}

export default function App() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => { const f = () => setPath(location.pathname); addEventListener('popstate', f); return () => removeEventListener('popstate', f) }, [])
  const go = p => { history.pushState(null, '', p); setPath(p) }
  const officer = path.startsWith('/officer')
  return (
    <div className="min-h-screen">
      <header className="bg-night text-white"><div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2"><Logo /><span className="font-bold text-lg">ProofClose</span>{USE_MOCK && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">demo data</span>}</div>
        <nav className="flex bg-white/10 rounded-full p-1" aria-label="Role">
          {[['/', 'Citizen'], ['/officer', 'Officer']].map(([p, l]) => (
            <button key={p} onClick={() => go(p)} aria-current={officer === (p !== '/') ? 'page' : undefined}
              className={`min-h-10 px-4 rounded-full font-semibold ${officer === (p !== '/') ? 'bg-white text-ink' : 'text-white/80'}`}>{l}</button>))}
        </nav></div></header>
      <main className="max-w-3xl mx-auto px-4 py-6">{officer ? <Officer /> : <Citizen />}</main>
      <footer className="text-center text-sm text-slate pb-8">Every closure proves itself · Ward stats: demo data</footer>
    </div>
  )
}
