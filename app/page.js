'use client';
import { useRef, useState } from 'react';

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

  async function run() {
    const { people, skipped } = parse(text);
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
      setResult({ cabs, notFound, skipped, total: people.length, used: data.used });
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

  return (
    <main>
      <h1>Cab Pool Grouping</h1>
      <p className="hint">
        Paste one person per line: name and Singapore postal code. A cab takes up to 3 people from at most 2 postal codes,
        and the two pickups must be under 15 minutes' drive apart.
      </p>
      <label htmlFor="list">Name and postal code list</label>
      <textarea id="list" rows={14} value={text} onChange={(e) => setText(e.target.value)}
        placeholder={'John Tan, 560123\nMary Lim, 560456\nAhmad Ali\t730888'} />
      <button onClick={run} disabled={busy || !text.trim()}>{busy ? 'Grouping…' : 'Group'}</button>

      {error && <p className="error" role="alert">{error}</p>}

      {result && (
        <section>
          <div className="bar">
            <h2>{result.cabs.length} cabs for {result.total - result.notFound.length} people</h2>
            <button onClick={copy}>{copied ? 'Copied' : 'Copy for WhatsApp'}</button>
          </div>
          <p className="hint">Google usage this run: {result.used.lookups} postal-code lookups, {result.used.checks} drive-time checks.</p>

          {result.notFound.length > 0 && (
            <div className="warn" role="alert">
              <strong>Postal code not found, so these people were not grouped:</strong>
              <ul>{result.notFound.map((p, k) => <li key={k}>{p.name} - {p.code}</li>)}</ul>
            </div>
          )}
          {result.skipped.length > 0 && (
            <div className="warn">
              <strong>Lines without a postal code (skipped):</strong>
              <ul>{result.skipped.map((l, k) => <li key={k}>{l}</li>)}</ul>
            </div>
          )}

          <ol className="cabs">
            {result.cabs.map((cab, k) => (
              <li key={k} className="cab">
                <div className="cab-head">
                  <strong>Cab {k + 1}</strong>
                  <span>{cab.pax} pax</span>
                  <span>{cab.seconds != null
                    ? `${mins(cab.seconds)} min · ${(cab.meters / 1000).toFixed(1)} km between pickups`
                    : cab.pax === 3 ? 'Full household' : 'No one within 15 min'}</span>
                </div>
                {cab.stops.map((s, n) => (
                  <div key={n} className="stop">
                    <div className="names">{s.names.join(', ')}</div>
                    <div className="addr">{s.code} · {s.address}</div>
                  </div>
                ))}
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
