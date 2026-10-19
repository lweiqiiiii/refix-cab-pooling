# Risk Register

| Risk | Probability | Impact | Trigger | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|

## Initial discovery risks

- Capacity mismatch: code allows three passengers while user states four. Resolve requirements now; implement only in an authorized delivery scope.
- An unconfirmed inter-stop threshold and absent venue/time semantics could produce unacceptable groups. Confirm the actual decision rule before recommending changes.
- Live API health, cost, data access, and deployment status remain unverified; no production-readiness claim is supported.

## Updated discovery evidence

Cab-count priority, venue exclusion, and prototype status are now confirmed. The requested limit is 10 minutes, replacing the existing 15. New ambiguity: “3 groups” may change the earlier two-location cap. Clarify location count, consecutive-leg versus all-pairs timing, and household handling before implementation.

## Location/time ambiguity resolved

User confirms three home locations and 10 minutes per consecutive leg; total inter-stop journey may exceed 10 minutes. Prior location/time ambiguities are resolved. Household splitting and workload remain open; existing code still differs from the confirmed rules.

## Input evidence and household constraints

Three of 12 sample staff have area names only; the current parser skips them. Guessing precise stops from broad areas risks invalid grouping. Postal-code counts cannot identify which residents belong to one mandatory household party. More than four must-stay-together passengers cannot fit a standard cab. Resolve these policies before solution commitment. Real staff names and home postal codes were not copied into artifacts.

## Input policy resolution

Missing postal codes will be flagged; matching postal codes define one party by explicit user instruction. Earlier household-identity uncertainty is resolved for this product. A party above four still conflicts with capacity and must not be silently split without an agreed exception policy.

## D1 review

Over-capacity policy resolved: manual arrangement, no automatic split. Existing automatic splitting and pair-only greedy selection conflict with intended behavior. Directional times cached by unordered key need assessment before ordered three-stop routes. Design must validate optimization and cost/runtime bounds; production access, cost ownership, and baseline remain open before pilot.

## Design A1 evidence

Synthetic counterexample proves shortest-pair-first can spend extra cabs. Three-stop exact cover can require expensive search; bounded-result policy is pending user choice. Full directed Google graph reaches 9,900 elements at 100 eligible codes, unlike nearest-neighbour pruning. No live price/quota/cache-term or deployment check performed. Current unsigned client route cache cannot be trusted as proof of route constraints; proposed server-authoritative cache requires compatibility handling.

## A2 delivery disposition

Implemented hard constraints and exception accounting with tests; provider/client cache correctness improved. Complete-graph proposal was superseded to preserve nearby work bounds. At most eight directed candidates per origin (800 at current cap), but smaller runs can cost more than the old one-direction lookup. External quotas/free-use enforcement are unverified and unchanged. Current route cache expires after five minutes; cold starts can repeat calls. Global optimum, live integration, provider retention terms, deployment access, and real event acceptance are not certified.
