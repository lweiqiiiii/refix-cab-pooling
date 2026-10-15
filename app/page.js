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
const routeUrl = (a, b) => `https://www.google.com/maps/dir/?api=1&origin=Singapore%20${a}&destination=Singapore%20${b}&travelmode=driving`;

function asText(cabs) {
  return cabs.map((cab, k) => {
    const head = `Cab ${k + 1} (${cab.pax} pax${cab.seconds != null ? `, ${mins(cab.seconds)} min between pickups` : ''})`;
    const lines = cab.stops.map((s, n) => `Pickup ${n + 1}: ${s.names.join(', ')} (${s.code})`);
    return [head, ...lines].join('\n');
  }).join('\n\n');
}

export default function Page() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  // Google results remembered while this page is open, so re-runs after small edits only pay for what's new.
  // ponytail: kept in memory only (gone on refresh). Google's terms restrict storing route results long-term.
  const cache = useRef({ geo: {}, rides: {} });
  const parsed = useMemo(() => parse(text), [text]);

  async function run() {
    const { people, skipped } = parsed;
    if (!people.length) return setError('No postal codes found. Use one person per line, e.g. "John Tan, 560123".');
    setBusy(true); setError(''); setResult(null); setCopied(false);
    const codes = {};
    for (const p of people) codes[p.code] = (codes[p.code] ?? 0) + 1;
    // Only send what's relevant to this list.
    const known = {
      geo: Object.fromEntries(Object.entries(cache.current.geo).filter(([c]) => c in codes)),
      rides: Object.fromEntries(Object.entries(cache.current.rides).filter(([k]) => k.split('-').every((c) => c in codes))),
    };
    try {
      const res = await fetch('/api/group', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codes, known }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Object.assign(cache.current.geo, data.geo);
      Object.assign(cache.current.rides, data.rides);
      // Put names back: the server only saw postal codes and headcounts.
      const queue = {};
      for (const p of people) (queue[p.code] ??= []).push(p.name);
      const cabs = data.cabs.map((cab) => {
        const stops = cab.stops.map((s) => ({ ...s, names: queue[s.code].splice(0, s.count) }));
        return { ...cab, stops, pax: stops.reduce((n, s) => n + s.count, 0) };
      });
      const notFound = people.filter((p) => data.notFound.includes(p.code));
      setResult({ cabs, notFound, skipped, total: people.length, used: data.used, text });
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(asText(result.cabs));
    setCopied(true);
  }

  const stale = result && result.text !== text;
  const shared = result?.cabs.filter((c) => c.stops.length > 1).length ?? 0;

  return (
    <main>
      <header>
        <h1>REFIX Cab Pooling</h1>
        <p className="hint">
          Paste a guest list and get cabs to share. Each cab takes up to 3 people from at most 2 postal codes,
          with pickups under 15 minutes' drive apart.
        </p>
      </header>

      <div className="layout">
        <div className="panel">
          <label htmlFor="list">Names and postal codes</label>
          <textarea id="list" rows={16} value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !busy && text.trim()) run(); }}
            aria-describedby="count"
            placeholder={'One person per line, e.g.\nJohn Tan, 560123\nMary Lim, 560456\nAhmad Ali\t730888'} />
          <p className="count" id="count" aria-live="polite">
            {text.trim() && <>
              <strong>{plural(parsed.people.length, 'person', 'people')}</strong> found
              {parsed.skipped.length > 0 && <span className="bad">, {plural(parsed.skipped.length, 'line')} without a postal code</span>}
            </>}
          </p>
          <button className="go" onClick={run} disabled={busy || !parsed.people.length}>
            {busy ? 'Grouping…' : 'Group into cabs'}<kbd aria-hidden="true">⌘↵</kbd>
          </button>
          {error && <p className="error" role="alert">{error}</p>}
        </div>

        <section aria-live="polite" aria-busy={busy}>
          {!result && (
            <div className="empty">
              <p>Your cabs will appear here. Paste names with postal codes, then group them. Rows copied from Excel work too.</p>
            </div>
          )}

          {result && (
            <>
              <div className="summary">
                <div>
                  <h2>{plural(result.cabs.length, 'cab')} for {plural(result.total - result.notFound.length, 'person', 'people')}</h2>
                  <p className="hint">{shared} shared, {result.cabs.length - shared} with one pickup</p>
                </div>
                <button onClick={copy}>{copied ? 'Copied' : 'Copy for WhatsApp'}</button>
              </div>

              {stale && <p className="stale">The list has changed since this grouping. Group again to update it.</p>}

              {result.notFound.length > 0 && (
                <div className="warn" role="alert">
                  <strong>These postal codes weren't found, so these people aren't in a cab:</strong>
                  <ul>{result.notFound.map((p, k) => <li key={k}>{p.name}, {p.code}</li>)}</ul>
                </div>
              )}
              {result.skipped.length > 0 && (
                <div className="warn">
                  <strong>These lines have no postal code and were skipped:</strong>
                  <ul>{result.skipped.map((l, k) => <li key={k}>{l}</li>)}</ul>
                </div>
              )}

              <ol className="cabs">
                {result.cabs.map((cab, k) => (
                  <li key={k} className="cab" style={{ animationDelay: `${Math.min(k, 12) * 30}ms` }}>
                    <div className="cab-head">
                      <span className="plate">CAB {k + 1}</span>
                      <span className="pax">{plural(cab.pax, 'person', 'people')}</span>
                      {cab.stops.length > 1 && <a href={routeUrl(cab.stops[0].code, cab.stops[1].code)} target="_blank" rel="noreferrer">Route in Maps</a>}
                    </div>
                    <ol className="route">
                      {cab.stops.map((s, n) => (
                        <li key={n}>
                          {n > 0 && <div className="leg">{mins(cab.seconds)} min drive, {(cab.meters / 1000).toFixed(1)} km</div>}
                          <div className="stop">
                            <div className="names">{s.names.join(', ')}</div>
                            <div className="addr"><a href={mapsUrl(s.code)} target="_blank" rel="noreferrer">{s.address || s.code}</a></div>
                          </div>
                        </li>
                      ))}
                    </ol>
                    {cab.stops.length === 1 && (
                      <p className="alone">{cab.pax === 3 ? 'Full cab from one address.' : 'No one else within 15 minutes.'}</p>
                    )}
                  </li>
                ))}
              </ol>

              <p className="hint small usage">
                Google usage this run: {plural(result.used.lookups, 'postal code lookup')}, {plural(result.used.checks, 'drive-time check')}.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
