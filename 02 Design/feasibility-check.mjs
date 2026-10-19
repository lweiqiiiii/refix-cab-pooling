// Disposable Design spike: synthetic route data only; not imported by the app.
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { groupCabs } from '../lib/group.mjs';

function candidates(counts, seconds) {
  assert.ok(counts.length <= 16, 'Spike bitmasks support at most 16 locations');
  const best = new Map();
  function visit(route, pax, duration) {
    const mask = route.reduce((bits, i) => bits | (1 << i), 0);
    if (!best.has(mask) || duration < best.get(mask).seconds)
      best.set(mask, { mask, route, seconds: duration });
    if (route.length === 3) return;
    for (let j = 0; j < counts.length; j++) {
      if (route.includes(j) || pax + counts[j] > 4) continue;
      const leg = seconds[route.at(-1)][j];
      if (Number.isFinite(leg) && leg >= 0 && leg <= 600)
        visit([...route, j], pax + counts[j], duration + leg);
    }
  }
  counts.forEach((count, i) => {
    if (count <= 4) visit([i], count, 0);
  });
  return [...best.values()];
}

// Exhaustive small-instance oracle, deliberately limited to synthetic examples.
function exact(counts, seconds) {
  assert.ok(counts.length <= 16, 'Spike oracle is limited to 16 locations');
  const groups = candidates(counts, seconds);
  const memo = new Map([[0, { cabs: 0, seconds: 0 }]]);
  function solve(mask) {
    if (memo.has(mask)) return memo.get(mask);
    const first = mask & -mask;
    let best = { cabs: Infinity, seconds: Infinity };
    for (const group of groups) {
      if (!(group.mask & first) || (group.mask & mask) !== group.mask) continue;
      const tail = solve(mask ^ group.mask);
      const score = { cabs: tail.cabs + 1, seconds: tail.seconds + group.seconds };
      if (score.cabs < best.cabs || (score.cabs === best.cabs && score.seconds < best.seconds)) best = score;
    }
    memo.set(mask, best);
    return best;
  }
  return { ...solve((1 << counts.length) - 1), candidates: groups.length, states: memo.size };
}
const matrix = n => Array.from({ length: n }, () => Array(n).fill(Infinity));
const chain = matrix(3);
chain[0][1] = 480; chain[1][2] = 480; chain[0][2] = 960;
const route = candidates([2, 1, 1], chain).find(g => g.mask === 7);
assert.deepEqual(route.route, [0, 1, 2]);
assert.equal(route.seconds, 960);
assert.equal(exact([2, 1, 1], chain).cabs, 1);
assert.equal(candidates([2, 2, 1], chain).some(g => g.mask === 7), false);
assert.equal(candidates([5], matrix(1)).length, 0);
const edge = matrix(2); edge[0][1] = 600;
assert.equal(exact([1, 1], edge).cabs, 1);
edge[0][1] = 601;
assert.equal(exact([1, 1], edge).cabs, 2);
const asymmetric = matrix(2); asymmetric[0][1] = 700; asymmetric[1][0] = 300;
assert.deepEqual(candidates([1, 1], asymmetric).find(g => g.mask === 3).route, [1, 0]);

const trap = matrix(4);
trap[0][1] = 60; trap[0][2] = 480; trap[1][3] = 480;
assert.equal(exact([1,1,1,1], trap).cabs, 2);
assert.equal(groupCabs(['A','B','C','D'].map(code => ({code,count:1})), new Map([
  ['0,1',{seconds:60}], ['0,2',{seconds:480}], ['1,3',{seconds:480}],
])).length, 2);
console.log('PASS: 3-stop chain, 4-seat capacity, whole-party exclusion, 600/601-second boundary, directional order, greedy counterexample.');
for (const n of [9, 12, 16]) {
  const dense = Array.from({length:n}, (_,i) => Array.from({length:n}, (_,j) => i === j ? Infinity : 60 + ((i * 31 + j * 17) % 500)));
  const start = performance.now();
  const result = exact(Array(n).fill(1), dense);
  assert.equal(result.cabs, Math.ceil(n / 3));
  console.log(JSON.stringify({syntheticLocations:n,...result,elapsedMs:Math.round((performance.now()-start)*100)/100}));
}
for (const n of [9,12,50,100]) console.log(JSON.stringify({locations:n,maximumDirectedRouteElements:n*(n-1)}));
