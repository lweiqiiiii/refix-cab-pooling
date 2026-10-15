import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitUnits, candidatePairs, pairUp } from './group.mjs';

const at = (code, count, lat, lng) => ({ code, count, lat, lng });

test('households of 3+ fill their own cab, remainder stays pairable', () => {
  const { full, pairable } = splitUnits([at('A', 4, 1.3, 103.8), at('B', 3, 1.3, 103.8), at('C', 1, 1.3, 103.8)]);
  assert.deepEqual(full.map((u) => [u.code, u.count]), [['A', 3], ['B', 3]]);
  assert.deepEqual(pairable.map((u) => [u.code, u.count]), [['A', 1], ['C', 1]]);
});

test('candidates respect capacity and the straight-line prefilter', () => {
  const units = [at('A', 2, 1.35, 103.85), at('B', 2, 1.351, 103.85), at('C', 1, 1.352, 103.85), at('FAR', 1, 1.35, 104.2)];
  // A+B = 4 pax (too many); FAR is ~39 km away
  assert.deepEqual(candidatePairs(units), [[0, 2], [1, 2]]);
});

test('each person only checks their 8 closest', () => {
  // 11 people in a line, ~0.55 km apart: person 0's 8 closest are 1..8, and 9 and 10 have 8 closer than 0
  const units = Array.from({ length: 11 }, (_, k) => at(String(k), 1, 1.3 + k * 0.005, 103.8));
  const keys = candidatePairs(units).map((p) => p.join(','));
  assert.ok(keys.includes('0,8'));
  assert.ok(!keys.includes('0,9') && !keys.includes('0,10'));
});

test('closest pair wins, >=15 min is never paired, leftovers ride alone', () => {
  const units = ['A', 'B', 'C', 'D'].map((c) => at(c, 1, 1.35, 103.85));
  const pairs = [[0, 1], [0, 2], [1, 2], [2, 3]];
  const rides = new Map([
    ['0,1', { seconds: 600 }], ['0,2', { seconds: 300 }], ['1,2', { seconds: 200 }], ['2,3', { seconds: 900 }],
  ]);
  const cabs = pairUp(units, pairs, rides).map((c) => c.stops.map((u) => u.code).join('+'));
  assert.deepEqual(cabs, ['B+C', 'A', 'D']); // B+C (200s) beats A+C; C-D is exactly 15 min -> rejected
});
