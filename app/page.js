'use client';
import { useMemo, useRef, useState } from 'react';

// One person per line, in any order: "John Tan, 560123", "560123 John Tan", or pasted from Excel (tab-separated).
// 5-digit codes are padded: Excel drops the leading 0 from codes like 018956.
function parse(text) {
  const people = [], skipped = [];
  for (const line of text.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const m = [...line.matchAll(/(?<!\d)\d{5,6}(?!\d)/g)].at(-1);
    if (!m) { skipped.push(line); continue; }
    const name = line.replace(m[0], '').replace(/^[\s,;:|\-]+|[\s,;:|\-]+$/g, '').replace(/\s+/g, ' ');
    people.push({ name: name || '(no name)', code: m[0].padStart(6, '0') });
  }
  return { people, skipped };
}

const mins = (s) => Math.round(s / 60);
const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;
const mapsUrl = (code) => `https://www.google.com/maps/search/?api=1&query=Singapore%20${code}`;
function routeUrl(stops) {
  const params = new URLSearchParams({ api: '1', origin: `Singapore ${stops[0].code}`, destination: `Singapore ${stops.at(-1).code}`, travelmode: 'driving' });
  if (stops.length > 2) params.set('waypoints', stops.slice(1, -1).map(s => `Singapore ${s.code}`).join('|'));
  return `https://www.google.com/maps/dir/?${params}`;
}

function asText(result) {
  const grouped = result.cabs.map((cab, k) => {
    const head = `Cab ${k + 1} (${cab.pax} pax${cab.stops.length > 1 ? `, ${mins(cab.seconds)} min between stops` : ''})`;
    const lines = cab.stops.map((s, n) => `Stop ${n + 1}: ${s.names.join(', ')} (${s.code})`);
    return [head, ...lines].join('\n');
  }).join('\n\n');
  const unassigned = [
    ...result.manual.map(p => `${p.name} (${p.code}): Manual arrangement — more than 4 people at this postal code`),
    ...result.notFound.map(p => `${p.name} (${p.code}): Postal code not found`),
    ...result.skipped.map(line => `${line}: No postal code`),
  ];
  return [grouped, unassigned.length ? `Not assigned\n${unassigned.join('\n')}` : ''].filter(Boolean).join('\n\n');
}

export default function Page() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const out = useRef(null);
  const parsed = useMemo(() => parse(text), [text]);

  async function run() {
    const { people, skipped } = parsed;
    if (!people.length) return setError('No postal codes found. Use one person per line, e.g. "John Tan, 560123".');
    setBusy(true); setError(''); setResult(null); setCopied(false);
    const codes = {};
    for (const p of people) codes[p.code] = (codes[p.code] ?? 0) + 1;
    try {
      const res = await fetch('/api/group', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codes }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Put names back: the server only saw postal codes and headcounts.
      const queue = {};
      for (const p of people) (queue[p.code] ??= []).push(p.name);
      const cabs = data.cabs.map((cab) => {
        const stops = cab.stops.map((s) => ({ ...s, names: queue[s.code].splice(0, s.count) }));
        return { ...cab, stops, pax: stops.reduce((n, s) => n + s.count, 0) };
      });
      const notFound = people.filter((p) => data.notFound.includes(p.code));
      const manual = people.filter(p => data.manual.includes(p.code));
      setResult({ cabs, notFound, manual, skipped, used: data.used, text });
      // On phones the results sit below the form; bring them into view.
      if (innerWidth < 900) out.current.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(asText(result));
      setCopied(true);
    } catch {
      setError('Could not copy. Allow clipboard access or select the assignments to copy them.');
    }
  }

  const stale = result && result.text !== text;
  const shared = result?.cabs.filter((c) => c.stops.length > 1).length ?? 0;
  const unassigned = result ? result.manual.length + result.notFound.length + result.skipped.length : 0;

  return (
    <main>
      <header>
        <h1>REFIX Cab Pooling</h1>
        <p className="sub">Paste a guest list and get cabs to share.</p>
      </header>

      <div className="layout">
        <div className="panel">
          <label className="group-label" htmlFor="list">Names and postal codes</label>
          <div className="panel-body">
          <div className="group">
            <textarea id="list" value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !busy && text.trim()) run(); }}
              aria-describedby="count rules" spellCheck={false}
              placeholder={'One person per line, e.g.\nJohn Tan, 560123\nMary Lim, 560456\nAhmad Ali\t730888'} />
            <p className="count" id="count" aria-live="polite">
              {text.trim() ? <>
                <strong>{plural(parsed.people.length, 'person', 'people')}</strong> found
                {parsed.skipped.length > 0 && <span className="bad">, {plural(parsed.skipped.length, 'line')} without a postal code</span>}
              </> : 'Rows copied from Excel work too.'}
            </p>
          </div>
          <p className="foot" id="rules">Up to <strong>4 people</strong> and <strong>3 stops</strong> per cab.<br />At most <strong>10 minutes</strong> between consecutive stops.</p>
          {parsed.skipped.length > 0 && (!result || stale) && (
            <div className="group issues" role="status">
              <p className="issues-head">Postal code needed</p>
              <ul>{parsed.skipped.map((line, i) => <li key={i}><span>{line}</span><span className="why">No postal code</span></li>)}</ul>
            </div>
          )}
          <button className="go" onClick={run} disabled={busy || !parsed.people.length}>
            {busy ? 'Grouping…' : 'Group into cabs'}<kbd aria-hidden="true">⌘↵</kbd>
          </button>
          {error && <p className="error" role="alert">{error}</p>}
          </div>
        </div>

        <section ref={out} className="out" aria-live="polite" aria-busy={busy} style={{ scrollMarginTop: 24 }}>
          {result && (
            <div className="summary">
              <div>
                <h2>{plural(result.cabs.length, 'cab')} for {plural(result.cabs.reduce((n, c) => n + c.pax, 0), 'person', 'people')}</h2>
                <p className="sub">{shared} shared, {result.cabs.length - shared} with one stop</p>
              </div>
              <button className="tinted" onClick={copy}>{copied ? 'Copied' : 'Copy for WhatsApp'}</button>
            </div>
          )}
          <div className="out-body">
          {!result && (
            <div className="group empty">
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 12h16" /><circle cx="7.5" cy="17" r="1.8" /><circle cx="16.5" cy="17" r="1.8" /><path d="M9.3 17h5.4" />
                </svg>
                <h2>{busy ? 'Finding cab groups…' : 'No cabs yet'}</h2>
                <p>{busy ? 'Checking postal codes and nearby drive times.' : 'Paste names with postal codes, then group them into cabs.'}</p>
              </div>
            </div>
          )}

          {result && (
            <>
              {stale && (
                <div className="notice">
                  The list has changed since this grouping.
                  <button className="tinted" onClick={run} disabled={busy || !parsed.people.length}>Group again</button>
                </div>
              )}

              {unassigned > 0 && (
                <details className="group issues" open={result.cabs.length === 0}>
                  <summary>{plural(unassigned, 'entry', 'entries')} not assigned<span className="issue-hint">Review details</span></summary>
                  <ul>
                    {result.manual.map((p, k) => <li key={`m${k}`}><span>{p.name}, {p.code}</span><span className="why">Manual arrangement</span></li>)}
                    {result.notFound.map((p, k) => <li key={`n${k}`}><span>{p.name}, {p.code}</span><span className="why">Postal code not found</span></li>)}
                    {result.skipped.map((l, k) => <li key={`s${k}`}><span>{l}</span><span className="why">No postal code</span></li>)}
                  </ul>
                  {result.manual.length > 0 && <p className="issues-help">Postal codes with more than 4 people need manual arrangement.</p>}
                </details>
              )}

              <ol className="cabs">
                {result.cabs.map((cab, k) => (
                  <li key={k} className="group cab">
                    <div className="cab-head">
                      <div>
                        <h3>Cab {k + 1}</h3>
                        <p className="cab-meta">{plural(cab.pax, 'person', 'people')} · {plural(cab.stops.length, 'stop')}</p>
                      </div>
                      {cab.stops.length > 1 && <a href={routeUrl(cab.stops)} target="_blank" rel="noreferrer">Route</a>}
                    </div>
                    <ol className="route">
                      {cab.stops.map((s, n) => (
                        <li key={n}>
                          {n > 0 && <div className="leg">{mins(cab.legs[n - 1].seconds)} min drive, {(cab.legs[n - 1].meters / 1000).toFixed(1)} km</div>}
                          <div className="stop">
                            <span className="stop-number" aria-hidden="true">{n + 1}</span>
                            <div className="stop-info">
                              <div className="names">{s.names.join(', ')}</div>
                              <a className="addr" href={mapsUrl(s.code)} target="_blank" rel="noreferrer">{s.address || s.code}</a>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                    {cab.stops.length === 1 && (
                      <p className="alone">{cab.pax === 4 ? 'Full cab from one address.' : 'One pickup/drop-off point.'}</p>
                    )}
                  </li>
                ))}
              </ol>

              <details className="usage">
                <summary>Maps usage and grouping limits</summary>
                <p>Google usage this run: {plural(result.used.lookups, 'postal code lookup')}, {plural(result.used.checks, 'drive-time check')}.</p>
                <p>Nearby groups are checked to reduce cab count; the fewest possible cabs are not guaranteed.</p>
              </details>
            </>
          )}
          </div>
        </section>
      </div>
    </main>
  );
}
