'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import s from './designs.module.css';

// Three read-only layout concepts, isolated from the live planner and Google API.
const options = { A: 'Warm workspace', B: 'Cab board', C: 'Transport list' };
const cabs = [
  { pax: 4, total: '18 min', stops: [['Jamie & Taylor', '732628', 'Admiralty'], ['Morgan', '757606', 'Canberra'], ['Casey', '760783', 'Khatib']], legs: [10, 8] },
  { pax: 2, total: '11 min', stops: [['Alex', '543180', 'Sengkang'], ['Sam', '541297', 'Sengkang']], legs: [11] },
  { pax: 1, total: 'Single stop', stops: [['Robin', '417115', 'Kembangan']], legs: [] },
];
const input = 'Jamie — 732628\nTaylor — 732628\nMorgan — 757606\nCasey — 760783\nAlex — 543180\nSam — 541297\nRobin — 417115\nDrew — Tampines';

function Input() {
  return <section className={s.input}><h2>Staff list</h2><p>Paste names and postal codes.</p><label htmlFor="staff">Names & postal codes</label><textarea id="staff" value={input} readOnly /><div className={s.inputFoot}>8 staff · 6 postal codes</div><button disabled>Generate cab groups</button><small>Preview only · no API calls</small></section>;
}
function Attention() {
  return <details className={s.attention}><summary>1 staff needs a postal code</summary><p>Drew — Tampines. Add a six-digit postal code to include them.</p></details>;
}
function Route({ cab }) {
  return <ol className={s.route}>{cab.stops.map(([names, code, area], i) => <li key={code}><div className={s.stop}><span className={s.number}>{i + 1}</span><div><strong>{names}</strong><span>{area} · {code}</span></div></div>{cab.legs[i] && <p className={s.leg}>{cab.legs[i]} min drive</p>}</li>)}</ol>;
}
function Cab({ cab, index }) {
  return <article className={s.cab}><div className={s.cabTitle}><h3>Cab {index + 1}</h3><span>{cab.pax}/4 passengers</span></div><p className={s.meta}>{cab.stops.length} {cab.stops.length === 1 ? 'stop' : 'stops'} · {cab.total}</p><Route cab={cab} /></article>;
}
function ResultTitle() {
  return <div className={s.resultTitle}><div><h2>Cab assignments</h2><p>3 cabs · 7 staff assigned</p></div><button disabled>Copy all groups</button></div>;
}
function VariantA() {
  return <div className={s.workspace}><Input /><section><ResultTitle /><Attention /><div className={s.stack}>{cabs.map((cab, i) => <Cab key={i} cab={cab} index={i} />)}</div></section></div>;
}
function VariantB() {
  return <><details className={s.drawer}><summary>Staff list <span>8 staff · view pasted list</span></summary><Input /></details><ResultTitle /><Attention /><section className={s.board} aria-label="Cab assignments">{cabs.map((cab, i) => <Cab key={i} cab={cab} index={i} />)}</section></>;
}
function VariantC() {
  return <div className={s.manifest}><div className={s.listTop}><h2>Transport list</h2><p>7 assigned · 3 cabs</p></div><Attention /><section aria-label="Cab assignments">{cabs.map((cab, i) => <details className={s.manifestRow} key={i} open={i === 0}><summary><strong>Cab {i + 1}</strong><span className={s.rowNames}>{cab.stops.map(stop => stop[0]).join(', ')}</span><span>{cab.pax} pax</span><span>{cab.total}</span></summary><Route cab={cab} /></details>)}</section><div className={s.listActions}><button disabled>Copy all groups</button><details><summary>View staff input</summary><Input /></details></div></div>;
}

export default function Designs({ variant }) {
  const router = useRouter();
  const change = (step) => {
    const keys = Object.keys(options);
    router.replace(`?variant=${keys[(keys.indexOf(variant) + step + keys.length) % keys.length]}`, { scroll: false });
  };
  useEffect(() => {
    const keydown = event => {
      if (event.target.closest('input, textarea, select, [contenteditable]') || event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1); }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  });
  return <div className={`${s.preview} ${s[variant]}`}><div className={s.sample}>DESIGN PREVIEW · SAMPLE DATA</div><main className={s.main}><header className={s.header}><a href="/">REFIX<span> / staff transport</span></a><span>Cab pooling</span></header><div className={s.heading}><h1>{variant === 'B' ? 'Every cab, at a glance.' : variant === 'C' ? 'Staff transport' : 'A smoother way home.'}</h1><p>{variant === 'A' ? 'Paste the list. Review the groups. Send them on their way.' : 'Review pickup and drop-off groups before sharing with your team.'}</p></div><p className={s.rules}>4 passengers / cab <span>·</span> 2 stops ≤ 12 min <span>·</span> 3 stops ≤ 18 min <span>·</span> Venue excluded</p>{variant === 'A' ? <VariantA /> : variant === 'B' ? <VariantB /> : <VariantC />}</main><nav className={s.switcher} aria-label="Design options"><button onClick={() => change(-1)} aria-label="Previous design">←</button><span>{variant} · {options[variant]}</span><button onClick={() => change(1)} aria-label="Next design">→</button></nav></div>;
}
