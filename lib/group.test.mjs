import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as grouping from './group.mjs';
const at = (code, count = 1, lat = 1.35, lng = 103.85) => ({ code, count, lat, lng });

test('postal-code parties stay intact: four fill a cab, above four require manual arrangement', () => {
  const { full, pairable, manual } = grouping.partitionUnits([at('A', 5), at('B', 4), at('C', 2)]);
  assert.deepEqual(full.map(u => [u.code, u.count]), [['B', 4]]);
  assert.deepEqual(pairable.map(u => [u.code, u.count]), [['C', 2]]);
  assert.deepEqual(manual.map(u => [u.code, u.count]), [['A', 5]]);
});

test('directed route candidates keep the eight-neighbour API bound and capacity/geography filters', () => {
  const units = Array.from({ length: 20 }, (_, k) => at(String(k), 1, 1.3 + k * 0.001));
  const pairs = grouping.candidateLegs(units);
  assert.ok(pairs.some(([i, j]) => i === 1 && j === 0), 'reverse directions are independent');
  for (let i = 0; i < units.length; i++) assert.ok(pairs.filter(([from]) => from === i).length <= 8);
  assert.deepEqual(grouping.candidateLegs([at('A', 2), at('B', 2), at('FAR', 1, 1.35, 104.2)]), [[0, 1], [1, 0]]);
});

test('four passengers at three stops can share a 16-minute route with two 8-minute legs', () => {
  assert.equal(typeof grouping.groupCabs, 'function', 'grouping supports ordered three-stop routes');
  const units = [at('A', 2), at('B'), at('C')];
  const cabs = grouping.groupCabs(units, new Map([
    ['0,1', { seconds: 480, meters: 2000 }], ['1,2', { seconds: 480, meters: 3000 }], ['0,2', { seconds: 960, meters: 5000 }],
  ]));
  assert.equal(cabs.length, 1);
  assert.deepEqual(cabs[0].stops.map(u => u.code), ['A', 'B', 'C']);
  assert.deepEqual(cabs[0].legs.map(l => l.seconds), [480, 480]);
  assert.equal(cabs[0].seconds, 960);
});

test('cab count takes priority over the shortest pair', () => {
  const units = ['A', 'B', 'C', 'D'].map(code => at(code));
  const cabs = grouping.groupCabs(units, new Map([
    ['0,1', { seconds: 60 }], ['0,2', { seconds: 480 }], ['1,3', { seconds: 480 }],
  ]));
  assert.equal(cabs.length, 2);
});

test('cab-count search can undo an attractive triple that leaves too many singletons', () => {
  const units = ['A', 'B', 'C', 'D', 'E', 'F'].map(code => at(code));
  const rides = new Map([
    ['0,1', { seconds: 10 }], ['1,2', { seconds: 10 }],
    ['0,3', { seconds: 100 }], ['1,4', { seconds: 100 }], ['2,5', { seconds: 100 }],
  ]);
  assert.equal(grouping.groupCabs(units, rides).length, 3);
});

test('only valid directed legs at or below ten minutes are used; capacity is never exceeded', () => {
  for (const seconds of [600, 601, null, -1, NaN]) {
    const cabs = grouping.groupCabs([at('A', 2), at('B', 2)], new Map([['1,0', { seconds, meters: 20 }]]));
    assert.equal(cabs.length, seconds === 600 ? 1 : 2);
    if (seconds === 600) assert.deepEqual(cabs[0].stops.map(u => u.code), ['B', 'A']);
  }
  const cabs = grouping.groupCabs([at('A', 2), at('B', 2), at('C')], new Map([
    ['0,1', { seconds: 50 }], ['1,2', { seconds: 50 }],
  ]));
  assert.equal(cabs.length, 2);
  for (const cab of cabs) assert.ok(cab.stops.reduce((sum, u) => sum + u.count, 0) <= 4);
  assert.deepEqual(cabs.flatMap(c => c.stops.map(u => u.code)).sort(), ['A', 'B', 'C']);
});
