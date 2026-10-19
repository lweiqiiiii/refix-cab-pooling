import { test } from 'node:test';
import assert from 'node:assert/strict';

// No credentials or live Google calls: the integration boundary is mocked.
process.env.GOOGLE_MAPS_API_KEY = 'test-key-not-real';
const { POST } = await import('../app/api/group/route.js');
const request = body => new Request('http://localhost/api/group', { method: 'POST', body: JSON.stringify(body) });

test('over-capacity postal codes are flagged whole without any Google work', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected paid lookup'); });
  const response = await POST(request({ codes: { '900001': 5, '900002': 51 } }));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.deepEqual(data.manual, ['900001', '900002']);
  assert.deepEqual(data.cabs, []);
  assert.deepEqual(data.used, { lookups: 0, checks: 0 });
  assert.equal(fetch.mock.callCount(), 0);
});

test('POST groups three stops, preserves parties, and reuses trusted directed results', async t => {
  const codes = ['910001', '910002', '910003'];
  const fetch = t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (String(url).includes('geocode')) {
      const code = String(url).match(/postal_code:(\d+)/)[1];
      assert.ok(codes.includes(code), 'manual parties must not cost geocoding calls');
      const index = codes.indexOf(code);
      return Response.json({ status: 'OK', results: [{ address_components: [{ types: ['postal_code'], long_name: code }], geometry: { location: { lat: 1.35 + index * .001, lng: 103.85 } }, formatted_address: `Address ${index}` }] });
    }
    const body = JSON.parse(options.body);
    const index = p => Math.round((p.waypoint.location.latLng.latitude - 1.35) / .001);
    const origin = index(body.origins[0]);
    return Response.json(body.destinations.map((p, destinationIndex) => ({ destinationIndex, condition: 'ROUTE_EXISTS', duration: index(p) === origin + 1 ? (origin === 0 ? '900s' : '720s') : '960s', distanceMeters: 2000 })));
  });
  const body = { codes: { '910001': 2, '910002': 1, '910003': 1, '910004': 5 }, known: { rides: { '910001-910003': { seconds: 0 } } } };
  const response = await POST(request(body));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.cabs.length, 1);
  assert.deepEqual(data.cabs[0].stops.map(s => s.code), codes);
  assert.deepEqual(data.cabs[0].legs.map(l => l.seconds), [900, 720]);
  assert.deepEqual(data.manual, ['910004']);
  assert.deepEqual(data.used, { lookups: 3, checks: 6 });
  const calls = fetch.mock.callCount();
  const rerun = await (await POST(request(body))).json();
  assert.deepEqual(rerun.used, { lookups: 0, checks: 0 });
  assert.equal(fetch.mock.callCount(), calls);
});

test('invalid bodies and the existing 100-code limit are rejected before Google calls', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected paid lookup'); });
  for (const body of [null, {}, { codes: [] }, { codes: { '123': 1 } }, { codes: { '920001': 0 } }, { codes: { '920001': 1.5 } }, { codes: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [String(920000 + i), 1])) }]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('incomplete Google route results fail clearly instead of inventing a valid route', async t => {
  t.mock.method(globalThis, 'fetch', async url => {
    if (String(url).includes('geocode')) {
      const code = String(url).match(/postal_code:(\d+)/)[1];
      return Response.json({ status: 'OK', results: [{ address_components: [{ types: ['postal_code'], long_name: code }], geometry: { location: { lat: code === '930001' ? 1.35 : 1.351, lng: 103.85 } } }] });
    }
    return Response.json([]);
  });
  const response = await POST(request({ codes: { '930001': 1, '930002': 1 } }));
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /quota and connection/);
});
