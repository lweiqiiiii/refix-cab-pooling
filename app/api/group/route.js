import { partitionUnits, candidateLegs, groupCabs } from '../../../lib/group.mjs';

const KEY = process.env.GOOGLE_MAPS_API_KEY;
const MAX_CODES = 100; // Existing cost guard; at most eight directed route elements per eligible origin.
// shortcut: caches are per instance and disappear on cold start; revisit only if quota use warrants shared caching.
const geoCache = new Map(), rideCache = new Map();
function cached(cache, key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  cache.delete(key);
}
function remember(cache, key, value, milliseconds) {
  if (cache.size >= 1000) cache.delete(cache.keys().next().value);
  cache.set(key, { value, expires: Date.now() + milliseconds });
}
const wp = u => ({ waypoint: { location: { latLng: { latitude: u.lat, longitude: u.lng } } } });

async function geocode(code, used) {
  const hit = cached(geoCache, code);
  if (hit !== undefined) return hit;
  used.lookups++;
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?components=country:SG|postal_code:${code}&key=${KEY}`, { signal: AbortSignal.timeout(15000) });
  const result = await response.json();
  if (!response.ok || !['OK', 'ZERO_RESULTS'].includes(result.status)) throw new Error('Geocoding failed');
  // Reject fuzzy matches. Google can return "Singapore" or a nearby code for a wrong one.
  const match = result.results?.find(x => x.address_components?.some(c => c.types.includes('postal_code') && c.long_name === code));
  const location = match?.geometry?.location;
  if (match && (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lng))) throw new Error('Invalid coordinates');
  const geo = match ? { lat: location.lat, lng: location.lng, address: String(match.formatted_address ?? code) } : null;
  remember(geoCache, code, geo, 24 * 60 * 60 * 1000);
  return geo;
}

async function driveTimes(units, pairs, used) {
  const rides = new Map(), byOrigin = new Map();
  for (const [i, j] of pairs) {
    const hit = cached(rideCache, `${units[i].code}>${units[j].code}`);
    if (hit !== undefined) rides.set(`${i},${j}`, hit);
    else byOrigin.set(i, [...(byOrigin.get(i) ?? []), j]);
  }
  await Promise.all([...byOrigin].map(async ([i, js]) => {
    used.checks += js.length;
    const response = await fetch('https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'destinationIndex,duration,distanceMeters,condition,status' },
      body: JSON.stringify({ origins: [wp(units[i])], destinations: js.map(j => wp(units[j])), travelMode: 'DRIVE' }),
    });
    const elements = await response.json();
    if (!response.ok || !Array.isArray(elements)) throw new Error('Routes API failed');
    const received = new Set();
    for (const element of elements) {
      const index = element.destinationIndex ?? 0;
      if (!Number.isInteger(index) || index < 0 || index >= js.length || received.has(index) || element.status?.code)
        throw new Error('Invalid route response');
      received.add(index);
      let ride;
      if (element.condition === 'ROUTE_NOT_FOUND') ride = { seconds: null, meters: 0 };
      else {
        const seconds = typeof element.duration === 'string' && /^\d+(\.\d+)?s$/.test(element.duration) ? Number.parseFloat(element.duration) : NaN;
        const meters = element.distanceMeters ?? 0;
        if (element.condition !== 'ROUTE_EXISTS' || !Number.isFinite(seconds) || !Number.isFinite(meters) || meters < 0)
          throw new Error('Invalid route duration');
        ride = { seconds, meters };
      }
      const j = js[index];
      rides.set(`${i},${j}`, ride);
    }
    if (received.size !== js.length) throw new Error('Incomplete route response');
    for (const j of js) remember(rideCache, `${units[i].code}>${units[j].code}`, rides.get(`${i},${j}`), 5 * 60 * 1000);
  }));
  return rides;
}

export async function POST(req) {
  // Postal codes and headcounts only; names stay in the browser. Client route caches are not authoritative.
  const body = await req.json().catch(() => null);
  const codes = body?.codes;
  if (!codes || typeof codes !== 'object' || Array.isArray(codes))
    return Response.json({ error: 'Invalid input.' }, { status: 400 });
  const entries = Object.entries(codes);
  if (!entries.length || entries.some(([c, n]) => !/^\d{6}$/.test(c) || !Number.isSafeInteger(n) || n < 1))
    return Response.json({ error: 'Invalid input.' }, { status: 400 });
  if (entries.length > MAX_CODES)
    return Response.json({ error: `Too many postal codes (max ${MAX_CODES} per run).` }, { status: 400 });
  const { manual, full, pairable } = partitionUnits(entries.map(([code, count]) => ({ code, count })));
  const eligible = [...full, ...pairable];
  const used = { lookups: 0, checks: 0 };
  if (eligible.length && !KEY) return Response.json({ error: 'GOOGLE_MAPS_API_KEY is not set on the server.' }, { status: 500 });
  try {
    const geo = await Promise.all(eligible.map(u => geocode(u.code, used)));
    const notFound = eligible.filter((_, i) => !geo[i]).map(u => u.code);
    const units = eligible.flatMap((u, i) => geo[i] ? [{ ...u, ...geo[i] }] : []);
    const { full: resolvedFull, pairable: resolvedShared } = partitionUnits(units);
    const pairs = candidateLegs(resolvedShared);
    const rides = await driveTimes(resolvedShared, pairs, used);
    const cabs = [...groupCabs(resolvedShared, rides), ...resolvedFull.map(u => ({ stops: [u], legs: [], seconds: 0, meters: 0 }))];
    return Response.json({ cabs, notFound, manual: manual.map(u => u.code), used });
  } catch {
    return Response.json({ error: 'Google Maps could not complete this grouping. Check the API quota and connection, then try again.' }, { status: 502 });
  }
}
