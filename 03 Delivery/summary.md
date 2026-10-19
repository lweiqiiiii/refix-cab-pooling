# Delivery — prototype refinement A2

Status: implemented and locally verified; awaiting user feedback. Stage remains Delivery. Design → Delivery was explicitly authorized by the user's request to continue the build while preserving Google API limits. Deployment and Operations are not approved.

## Delivered

- Four passengers, up to three postal-code stops, and at most 10 minutes for each consecutive directed leg. Total inter-stop travel may exceed 10 minutes.
- Same-code parties stay intact. Parties above four are flagged for manual arrangement before Google calls; missing postal codes appear before grouping, and unresolved codes remain visible.
- Bounded cab-count-first selection, then total inter-stop driving seconds. Existing nearby prefilter and eight-destination work bound remain; results do not claim a global minimum.
- Individual leg durations, complete three-stop map links, accurate assigned-person totals, and clipboard assignments including unresolved/manual rows.
- Trusted, bounded in-memory server caches reuse Google results. Client-provided locations/times are not treated as route evidence. No new dependencies or durable storage.

## Validation

`npm test`: 10 tests pass. `npm run build`: passes. Mocked headless-browser checks pass on desktop/mobile for missing-code warning, manual accounting, three-stop map/clipboard, individual leg durations, and page errors/overflow. A synthetic 100-location check assigned all parties once within hard rules using 800 directed route elements; local selection took about 53 ms, excluding provider/network/deployment overhead.

See [validation](validation.md), [setup](setup.md), and [walkthrough](prototype.md).

## API limits and limitations

The existing 100-distinct-code guard, 15-km nearby prefilter, and eight-destination bound are retained. At most 800 route elements are considered at that cap; caching and full/manual parties reduce fresh work. Directions are now measured independently, so a smaller run can use more route elements than the old one-direction implementation. Google Cloud quotas/billing/key restrictions were neither inspected nor modified. Staying inside Google's free allowance depends on those account settings and usage over time; this build does not assert free usage.

Nearby pruning and a 10,000-node search bound mean the global fewest-cabs result is not guaranteed. Cold starts/expired caches can repeat paid lookups. Live Google access, actual quota enforcement, provider caching terms, deployment exposure, and real planner acceptance remain unverified. No live Google requests or deployment were performed during validation.
