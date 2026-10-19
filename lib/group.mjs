// Pure grouping logic: no network, so it can be tested on its own.
export const MAX_PAX = 4;           // people per cab
export const MAX_RIDE_S = 15 * 60;  // drive time between consecutive stops
// shortcut: nearby-only candidates keep API use bounded, revisit if planners miss useful matches.
export const PRUNE_KM = 15;
export const NEIGHBOURS = 8;

// units: one per unique postal code -> [{ code, count, lat, lng, address }]
// One postal code is indivisible; over-capacity parties need manual arrangement.
export function partitionUnits(units) {
  const full = [], pairable = [], manual = [];
  for (const u of units) {
    (u.count > MAX_PAX ? manual : u.count === MAX_PAX ? full : pairable).push(u);
  }
  return { full, pairable, manual };
}

export function haversineKm(a, b) {
  const rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

// Directed candidates: at most eight destinations per origin, preserving the API work bound.
export function candidateLegs(units) {
  return units.flatMap((a, i) => units
    .map((b, j) => [j, haversineKm(a, b)])
    .filter(([j, d]) => j !== i && a.count + units[j].count <= MAX_PAX && d <= PRUNE_KM)
    .sort((x, y) => x[1] - y[1] || x[0] - y[0])
    .slice(0, NEIGHBOURS)
    .map(([j]) => [i, j]));
}

// rides contains only measured directed edges, keyed by "originIndex,destinationIndex".
export function groupCabs(units, rides) {
  const candidates = new Map();
  function visit(indices, legs, pax) {
    const mask = indices.reduce((bits, i) => bits | (1n << BigInt(i)), 0n);
    const seconds = legs.reduce((n, leg) => n + leg.seconds, 0);
    const cab = { stops: indices.map(i => units[i]), legs, seconds, meters: legs.reduce((n, leg) => n + leg.meters, 0) };
    if (!candidates.has(mask) || seconds < candidates.get(mask).cab.seconds)
      candidates.set(mask, { mask, cab });
    if (indices.length === 3) return;
    for (let j = 0; j < units.length; j++) {
      if (indices.includes(j) || pax + units[j].count > MAX_PAX) continue;
      const ride = rides.get(`${indices.at(-1)},${j}`);
      if (!Number.isFinite(ride?.seconds) || ride.seconds < 0 || ride.seconds > MAX_RIDE_S) continue;
      visit([...indices, j], [...legs, { seconds: ride.seconds, meters: ride.meters ?? 0 }], pax + units[j].count);
    }
  }
  units.forEach((u, i) => visit([i], [], u.count));
  const ordered = [...candidates.values()].sort((a, b) => b.cab.stops.length - a.cab.stops.length || a.cab.seconds - b.cab.seconds);
  let remaining = (1n << BigInt(units.length)) - 1n;
  const selected = [];
  for (const candidate of ordered) {
    if ((remaining & candidate.mask) !== candidate.mask) continue;
    selected.push(candidate.cab);
    remaining ^= candidate.mask;
  }
  let best = selected;
  let bestSeconds = best.reduce((n, cab) => n + cab.seconds, 0);
  const byStop = units.map((_, i) => ordered.filter(c => (c.mask & (1n << BigInt(i))) !== 0n));
  const seen = new Map();
  let visited = 0;
  // shortcut: search and nearby data are bounded, never claim a global minimum cab count.
  function search(mask, chosen, seconds) {
    if (++visited > 10000) return;
    if (mask === 0n) {
      if (chosen.length < best.length || (chosen.length === best.length && seconds < bestSeconds)) {
        best = chosen;
        bestSeconds = seconds;
      }
      return;
    }
    let count = 0, pax = 0, first = -1;
    units.forEach((u, i) => {
      if ((mask & (1n << BigInt(i))) === 0n) return;
      count++; pax += u.count;
      if (first === -1) first = i;
    });
    const lower = chosen.length + Math.max(Math.ceil(count / 3), Math.ceil(pax / MAX_PAX));
    if (lower > best.length || (lower === best.length && seconds >= bestSeconds)) return;
    const previous = seen.get(mask);
    if (previous && (previous.count < chosen.length || (previous.count === chosen.length && previous.seconds <= seconds))) return;
    seen.set(mask, { count: chosen.length, seconds });
    for (const candidate of byStop[first]) {
      if ((mask & candidate.mask) === candidate.mask)
        search(mask ^ candidate.mask, [...chosen, candidate.cab], seconds + candidate.cab.seconds);
      if (visited >= 10000) break;
    }
  }
  search((1n << BigInt(units.length)) - 1n, [], 0);
  return best;
}
