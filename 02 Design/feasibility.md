# Feasibility evidence — A1

Question: can the confirmed grouping rules be modeled correctly without replacing the existing application, and does nearest-pair-first selection meet the primary objective?

## Reproducible check

Run from the repository root:

```sh
node '02 Design/feasibility-check.mjs'
npm test
```

The standalone Design script uses synthetic directed matrices and a deliberately small exhaustive oracle (maximum 16 locations). It performs no network calls, reads no credentials, and is not imported by the app.

## Observed results, 2026-10-19

- Assertions passed for a three-stop 16-minute chain with two 8-minute legs, four-seat capacity, exclusion of a five-person party, inclusive 600-second boundary versus rejection at 601 seconds, and asymmetric route ordering.
- A four-location synthetic example makes the existing nearest-pair function return three cabs, while exhaustive selection returns two. Invalidated assumption: taking the shortest pair first is sufficient for cab-count priority.
- Dense synthetic inputs: nine locations yielded three cabs (129 candidate subsets, 151 memoized states, about 8 ms); 12 yielded four cabs (298 candidates, 816 states, about 10 ms); 16 yielded six cabs (696 candidates, 7,739 states, about 18 ms). These local single-run timings exclude Google, JSON, deployment overhead, and UI. They are not a supported performance limit.
- All four existing `npm test` tests pass. Those tests confirm current three-seat/two-stop/15-minute behavior; passing does not validate the new business requirements.

## API work bound

For eligible non-full parties with all pair counts compatible, complete directed lookup requires at most:

| Distinct postal codes | Directed route elements |
|---|---|
| 9 | 72 |
| 12 | 132 |
| 50 | 2,450 |
| 100 | 9,900 |

These are element counts, not request counts or currency estimates. Cached results and excluded/full parties reduce them. The current nearest-eight/straight-line filter can be cheaper but cannot justify a complete-graph optimum claim. No paid lookup occurred. Exact Google prices, quotas, routing semantics, and cache permissions have not been verified.

## Conclusion and limits

The pure-function formulation is feasible at small synthetic sizes; current selection can violate the primary objective. Larger exact search, bounded fallback policy, Google cost/runtime, and secondary objective must be resolved before a Delivery-ready claim. The proposed production algorithm should not copy the spike's small integer-bitmask implementation; it intentionally does not support the current 100-code request cap.
