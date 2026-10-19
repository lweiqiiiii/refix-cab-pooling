# Grouping refinement — Design draft A1

Historical draft A1. Superseded in part by user-authorized A2 build; see `summary.md` and `../03 Delivery/summary.md` for actual scope. A1 complete-graph/proof-policy proposals were not implemented. Source review and synthetic checks: 2026-10-19. Discovery D1 → Design is approved. The user decision on bounded optimization remains pending.

## Objective and minimum workflow

Keep the existing paste → group → inspect → copy workflow. Refine rules and result accuracy without replacing the application or adding booking, accounts, a database, or venue input.

1. The full-timer pastes one person per line. The existing parser identifies postal codes; rows without codes remain visibly flagged, including any pasted heading. No area-to-home guessing is introduced.
2. Aggregate people by postal code. Each code is one indivisible pickup/drop-off party. Parties above four people go to manual arrangement before geocoding or route requests.
3. Resolve remaining postal codes and obtain directed inter-location drive times from Google. A missing/invalid location remains unresolved; it does not disappear from accounting.
4. Generate feasible ordered routes: one to three codes, at most four people, every consecutive leg at most 600 seconds. No requirement applies to nonconsecutive location pairs or total route time. No venue is involved.
5. Select a nonoverlapping cover of all resolvable, eligible parties, prioritizing cab count and then the proposed travel-time measure. Return routes in their verified direction and order.
6. Reattach names in the browser. Show cab totals, explicit unresolved/manual counts, each leg's duration, and a copyable ordered assignment list. Reuse the existing interface and missing-code flags.

## Existing architecture and ownership

| Existing module | Responsibility after refinement | Changes required |
|---|---|---|
| `app/page.js` | Parse/display input; keep names local; attach names by code; accessible result/exception display; clipboard and map links | Preserve layout; four-passenger rules text; manual-party category; ordered per-leg display; three-stop map URL; honest optimization status |
| `app/api/group/route.js` | Validate request; classify over-capacity parties; integrate Google; return grouping and explicit exceptions | Do not automatically split parties; directed route lookup; distinguish no-route from provider failure; bounded requests and trustworthy cache handling |
| `lib/group.mjs` | Pure candidate-route generation and group selection from counts and supplied directed travel times | Replace pair-only/splitting logic with the confirmed constraints and cab-count-first selection, behind a small pure interface |
| `lib/group.test.mjs` | Tests through the grouping module's interface | Replace old-rule expectations; add objective, partition, direction, capacity, and timing cases |

Keep the existing separation of browser, network integration, and pure grouping. No extra service or solver framework is justified by this draft. Internal helpers may support the pure function; do not preserve obsolete split/pair exports merely as wrappers after updating their only caller and tests.

## Proposed interface and data invariants

Retain `POST /api/group` and postal-code/headcount input. Names stay in the browser. The final JSON field names are an implementation detail for the page and route to change together; the required response shape is:

- Cabs with ordered stops (`code`, intact `count`, resolved display address) and ordered legs (`from`, `to`, `seconds`, `meters`). Total seconds/meters are sums of those legs, not values repeated for each leg.
- Separate unresolved codes and over-capacity/manual codes. Missing-code lines remain browser-owned. All people must be counted exactly once in a cab or an explicit exception.
- Actual Google lookup/route-element counts, distinguishing reused results from fresh requests.
- Optimization evidence that distinguishes a proven minimum cab count from a best-found count, if the user accepts bounded results. Do not imply that a minimum count also proves a globally shortest secondary objective.

Input must be a bounded plain mapping of six-digit Singapore postal-code strings to positive integer counts. Validate body shape and size before paid work. Preserve a finite request guard; the current 100-code/50-count-per-code guard is an existing limit, not a business workload commitment. A count above four but within the valid request guard receives manual status, not a split. Out-of-range or malformed requests receive a clear validation error before provider calls.

## Group selection

For each subset of up to three postal-code parties whose passenger sum is at most four, evaluate its directed orders. Every consecutive edge must exist with finite, nonnegative drive time no greater than 600 seconds. Retain the cheapest feasible order for each subset. Singletons ensure a complete feasible cover of valid locations even when nobody can share.

Choose a partition by the lexicographic objective `(cab count, total inter-stop driving seconds)`. Total inter-stop seconds is a proposed, venue-independent proxy for shorter journeys, not a claim to minimize full passenger door-to-door time. Fix stable tie ordering so re-running identical inputs and route data yields the same displayed groups.

The three-stop set-partition problem is more general than ordinary pair matching; a pair-only matching library does not solve it. A nearest-first greedy choice can miss a smaller cab count, as the synthetic spike demonstrates. No arbitrary nearest-eight or kilometre pruning can support a global minimum claim: an unmeasured feasible edge may change the result.

Recommended pending user choice: generate a valid incumbent quickly, then run bounded improvement/exact search per connected route component. Stop on the fixed search budget; always validate the returned partition and its legs. Mark cab-count proof only when complete search or a valid global lower bound certifies it. Work/resource bounds must be benchmarked before claiming support at the current request cap. A bound does not excuse returning a partial assignment or invalid route. If the user requires proof for every result, timed-out components instead go to manual arrangement under an explicit status.

A valid count lower bound includes `ceil(eligible passengers / 4)` and `ceil(eligible codes / 3)`; take the maximum, with tighter component bounds where justified. Hitting a lower bound proves cab count only. Secondary route-time search may remain incomplete and must not be described as exact.

## Google integration and cache compatibility

Check both directions for capacity-compatible party pairs; do not assume symmetric travel times. Query all such directed pairs for a complete candidate graph. At worst this uses `n × (n − 1)` route elements after manual/unresolved parties and full four-person cabs are excluded. This is a material increase from the current closest-neighbour filter; actual billing, quota, and deployment budget require confirmation before enabling paid live validation.

Do not query unnecessary direct end-to-end pairs to validate a route already supported by consecutive legs, but complete graph acquisition must not silently discard other potential routes when claiming a global count minimum. Provider batch sizes/concurrency, transport/timeouts, routing preference, and duration parsing must be checked against current Google documentation during the integration slice, before live requests. Do not assume current API defaults or route quotas are verified by this spike.

Use directed cache keys containing origin, destination, and routing semantics. Existing unordered `known.rides` data cannot be reused as evidence for an ordered route. Client-supplied coordinates/durations are untrusted; the server must not certify constraints using forged `known` values. The simplest proposed change removes client cache authority and reuses only server-fetched, in-memory results under explicit freshness/size limits. Cold starts may cost more; no durable storage is introduced. Verify current provider caching terms before choosing retention periods. Provider change or routing-option change invalidates incompatible entries.

## Reliability, security, and deployment

- A provider error/timeout is not evidence that two codes cannot share. Preserve current run-level error handling and show a retriable failure; do not silently claim an optimized complete graph from partial provider data.
- An explicit provider no-route result may exclude that directed leg. Invalid/unresolved postal codes are shown separately. Four-person parties do not require inter-stop routing.
- Parse route durations and distances as finite nonnegative values; require every expected matrix result or report a clear integration failure. No missing response element may become a zero-second drive.
- Keep Google key server-side and avoid exposing provider credentials through raw error messages. Names never need to enter server requests, logs, or Google lookups. Avoid logging personal staff lists or home-address payloads.
- Preserve the existing deployment path. Authentication, public exposure, API-key restrictions, abuse/rate controls, cost ownership, provider terms, and operating ownership must be checked before a pilot; no deployment or public availability is authorized here.
- This draft adds no history, background workers, automatic booking, or monitoring service. Existing request usage totals and clear errors suffice for prototype feedback; pilot monitoring must match the eventual deployment context.

## Validation surface and change reach

The change reaches the pure module, all its API callers/tests, page name mapping, summary counts, exceptions, clipboard text, route links, loading/error states, usage display, and any fixtures still describing three seats/two stops/15 minutes. Inspect the installed Next.js guides before application edits, as AGENTS.md requires. Existing app paths remain in place.

Delivery checks must cover:

1. Four seats; three stops; exact 600-second boundary; rejection above 600; two 8-minute legs accepted; correct reversed/asymmetric route.
2. Same-code cohesion; five people excluded whole for manual arrangement; no loss/duplication across assigned, missing, unresolved, and manual categories.
3. The nearest-pair counterexample; exact small-instance comparison against an exhaustive oracle; honest status on any bounded search.
4. Malformed/oversized input; forged or stale client cache; API failures, missing/malformed elements, duration parsing, and reruns after rule/cache changes.
5. All three stops in map/clipboard output; distinct per-leg times; summary excludes unresolved/manual passengers; missing-code warnings before and after grouping; keyboard and mobile checks.

The synthetic spike is evidence for the formulation on small inputs, not a production solver or a 100-location benchmark. Keep it out of application imports.
