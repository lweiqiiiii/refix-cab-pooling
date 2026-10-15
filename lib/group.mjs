// Pure grouping logic: no network, so it can be tested on its own.
export const MAX_PAX = 3;           // people per cab
export const MAX_RIDE_S = 15 * 60;  // drive time from pickup 1 to pickup 2
// ponytail: straight-line prefilter so we only pay Google for pairs that could be <15 min apart.
// 15 km straight-line is already beyond a 15-min SG drive; raise it if real pairs get missed.
export const PRUNE_KM = 15;
// Only ask Google about each person's closest few. Closest-first pairing rarely reaches further,
// and this cuts drive-time checks per run from ~840 to ~240 for 50 people (see cost estimate).
export const NEIGHBOURS = 8;

// units: one per unique postal code -> [{ code, count, lat, lng, address }]
// A household that fills a cab rides alone; any remainder can still pair up.
export function splitUnits(units) {
  const full = [], pairable = [];
  for (const u of units) {
    let n = u.count;
    while (n > MAX_PAX) { full.push({ ...u, count: MAX_PAX }); n -= MAX_PAX; }
    (n === MAX_PAX ? full : pairable).push({ ...u, count: n });
  }
  return { full, pairable };
}

export function haversineKm(a, b) {
  const rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

// Index pairs [i, j] (i < j) worth asking Google about: they fit in one cab, are close enough,
// and one of them is among the other's NEIGHBOURS closest (straight line).
export function candidatePairs(units) {
  const keep = new Set();
  units.forEach((a, i) => {
    units.map((b, j) => [j, haversineKm(a, b)])
      .filter(([j, d]) => j !== i && a.count + units[j].count <= MAX_PAX && d <= PRUNE_KM)
      .sort((x, y) => x[1] - y[1])
      .slice(0, NEIGHBOURS)
      .forEach(([j]) => keep.add(i < j ? `${i},${j}` : `${j},${i}`));
  });
  return [...keep].map((k) => k.split(',').map(Number)).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
}

// rides: Map "i,j" -> { seconds, meters }, the drive from units[i] to units[j].
// Greedy nearest-neighbour: take the closest pair first, then the next closest among those left.
// ponytail: greedy, not a global optimum; fine for ~50 people, swap in min-weight matching if it isn't.
export function pairUp(units, pairs, rides) {
  const ok = pairs
    .map(([i, j]) => ({ i, j, ...rides.get(`${i},${j}`) }))
    .filter((p) => p.seconds != null && p.seconds < MAX_RIDE_S)
    .sort((a, b) => a.seconds - b.seconds);
  const used = new Set(), cabs = [];
  for (const p of ok) {
    if (used.has(p.i) || used.has(p.j)) continue;
    used.add(p.i); used.add(p.j);
    cabs.push({ stops: [units[p.i], units[p.j]], seconds: p.seconds, meters: p.meters });
  }
  units.forEach((u, i) => used.has(i) || cabs.push({ stops: [u] }));
  return cabs;
}
