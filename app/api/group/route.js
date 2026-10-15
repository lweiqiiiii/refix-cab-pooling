import { splitUnits, candidatePairs, pairUp } from '../../../lib/group.mjs';

const KEY = process.env.GOOGLE_MAPS_API_KEY;
const MAX_CODES = 100; // cost guard: each run is ~1 geocode per new code + up to a few hundred drive-time checks
// ponytail: per-instance cache, lost on cold start. Google allows caching lat/lng up to 30 days.
// The browser also remembers results for the session (see `known`), which is what makes re-runs cheap.
const geoCache = new Map();

async function geocode(code) {
  if (geoCache.has(code)) return geoCache.get(code);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?components=country:SG|postal_code:${code}&key=${KEY}`;
  const r = await (await fetch(url)).json();
  if (r.status !== 'OK' && r.status !== 'ZERO_RESULTS') throw new Error(`Geocoding failed: ${r.status} ${r.error_message ?? ''}`);
  // Reject fuzzy matches. Google can return "Singapore" or a nearby code for a wrong one.
  const hit = r.results?.find((x) => x.address_components.some((c) => c.types.includes('postal_code') && c.long_name === code));
  const g = hit ? { lat: hit.geometry.location.lat, lng: hit.geometry.location.lng, address: hit.formatted_address } : null;
  if (g) geoCache.set(code, g);
  return g;
}

const wp = (u) => ({ waypoint: { location: { latLng: { latitude: u.lat, longitude: u.lng } } } });
const pairKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
// The browser sends back what it already has; ignore anything malformed.
const okGeo = (g) => (Number.isFinite(g?.lat) && Number.isFinite(g?.lng) ? { lat: g.lat, lng: g.lng, address: String(g.address ?? '') } : null);
const okRide = (r) => (r && (r.seconds === null || Number.isFinite(r.seconds)) ? { seconds: r.seconds, meters: Number(r.meters) || 0 } : null);

// Driving time for each candidate pair, one matrix call per origin. Pairs in `known` are not re-checked.
// ponytail: one direction only (i -> j). Add j -> i and take the min if pickup order ever matters.
async function driveTimes(units, pairs, known) {
  const rides = new Map(), fresh = {}, byOrigin = new Map();
  for (const [i, j] of pairs) {
    const hit = okRide(known[pairKey(units[i].code, units[j].code)]);
    if (hit) rides.set(`${i},${j}`, hit);
    else byOrigin.set(i, [...(byOrigin.get(i) ?? []), j]);
  }
  await Promise.all([...byOrigin].map(async ([i, js]) => {
    const res = await fetch('https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'destinationIndex,duration,distanceMeters,condition' },
      body: JSON.stringify({ origins: [wp(units[i])], destinations: js.map((j) => wp(units[j])), travelMode: 'DRIVE' }),
    });
    const els = await res.json();
    if (!res.ok) throw new Error(`Routes API failed: ${els.error?.message ?? res.status}`);
    for (const e of els) {
      const j = js[e.destinationIndex ?? 0];
      // Remember "no route" too, so it isn't paid for again.
      const v = e.condition === 'ROUTE_EXISTS' ? { seconds: parseInt(e.duration), meters: e.distanceMeters ?? 0 } : { seconds: null, meters: 0 };
      rides.set(`${i},${j}`, v);
      fresh[pairKey(units[i].code, units[j].code)] = v;
    }
  }));
  return { rides, fresh };
}

export async function POST(req) {
  if (!KEY) return Response.json({ error: 'GOOGLE_MAPS_API_KEY is not set on the server.' }, { status: 500 });
  // Body: { codes: { "560123": 2, ... }, known: { geo: { code: {...} }, rides: { "a-b": {...} } } }
  // Postal codes and headcounts only; names stay in the browser.
  const { codes, known } = await req.json().catch(() => ({}));
  const entries = Object.entries(codes ?? {});
  if (!entries.length || entries.some(([c, n]) => !/^\d{6}$/.test(c) || !Number.isInteger(n) || n < 1 || n > 50))
    return Response.json({ error: 'Invalid input.' }, { status: 400 });
  if (entries.length > MAX_CODES)
    return Response.json({ error: `Too many postal codes (max ${MAX_CODES} per run).` }, { status: 400 });
  const knownGeo = known?.geo ?? {}, knownRides = known?.rides ?? {};

  try {
    const freshGeo = {};
    const geo = await Promise.all(entries.map(async ([c]) => {
      const hit = okGeo(knownGeo[c]);
      if (hit) return hit;
      const g = await geocode(c);
      if (g) freshGeo[c] = g;
      return g;
    }));
    const notFound = entries.filter((_, k) => !geo[k]).map(([c]) => c);
    const units = entries.flatMap(([code, count], k) => (geo[k] ? [{ code, count, ...geo[k] }] : []));
    const { full, pairable } = splitUnits(units);
    const pairs = candidatePairs(pairable);
    const { rides, fresh } = await driveTimes(pairable, pairs, knownRides);
    const cabs = [...pairUp(pairable, pairs, rides), ...full.map((u) => ({ stops: [u] }))];
    const lookups = entries.filter(([c]) => !okGeo(knownGeo[c])).length;
    return Response.json({ cabs, notFound, geo: freshGeo, rides: fresh, used: { lookups, checks: Object.keys(fresh).length } });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
