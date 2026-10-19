# Delivery — prototype A2 and interface refinement A3

Status: implemented and locally verified; awaiting user feedback. Stage remains Delivery. Design → Delivery was explicitly authorized by the user's request to continue the build while preserving Google API limits. Deployment and Operations are not approved.

## Delivered

- Four passengers, up to three postal-code stops. Two-stop cabs allow at most 12 minutes total; three-stop cabs allow at most 18 minutes total across both directed drives. These limits apply to pickup and drop-off grouping, excluding the venue.
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

## A3 interface refinement

The user chose cleaner existing visuals and easier-to-read cab groups on both laptops and phones. The warm light/dark palette is preserved. Routes now occupy readable full-width cab sections with proper headings, passenger/stop counts, and numbered stops. Native exception disclosure keeps unassigned counts visible and opens automatically for manual-only results. Optional Maps usage/limits are separate; empty/loading states are distinct. Input, copy, map links, grouping, and API limits retain their behavior.

See [interface brief](interface-refinement.md) and [validation](validation.md). The user subsequently authorized uploading A3 source to the existing GitHub repository; no deployment was performed.

## A4 — 15-minute consecutive drives

User requested increasing the consecutive-stop drive limit from 10 to 15 minutes and uploading the change to GitHub. Exactly 900 seconds is accepted; 901 seconds is rejected. A three-stop route can total 27 minutes when its legs take 12 and 15 minutes. Four seats, three stops, postal-code cohesion, manual/missing flags, candidate/API bounds, and quota settings are unchanged. All ten tests and production build pass; provider integration tests are mocked. No deployment or live API check was performed.

## A5 — time budget by stop count (2026-10-20)

The user clarified two stops = 12 minutes maximum; three stops = 18 minutes total maximum. The pure grouping module only admits complete candidates within the applicable budget, while keeping longer two-stop prefixes available to build valid three-stop routes (for example 13 + 5 minutes). The UI shows both limits and each multi-stop cab's total duration. Updated unit and mocked POST tests pass: 11 total. Exact 720/1080-second boundaries are accepted, 721/1081-second totals rejected. Production build passes. Existing capacity, party integrity, route directions, API lookup bounds, and quotas are unchanged. No live provider checks, GitHub upload, or deployment occurred for A5.

## A6 visual options

Three responsive, read-only concepts are ready for comparison; no winner selected. See [design options](design-options.md) for previews, launch instructions and verification. The planner is unchanged and nothing has been uploaded.

## A7 — selected warm workspace

User selected A. The working app now uses its warm split layout on laptops and stacked layout on phones, retaining all existing interactions and dark mode. All 11 tests, production build and mocked browser checks passed at 320/390/768/1440 pixels. No Google calls, quota changes, upload or deployment. See [interface options](design-options.md).

## A8 — box alignment

User requested Impeccable refinement and aligned boxes. Shared desktop heading rows now align the staff-input box with the results area, including empty and populated states; responsive stacking is preserved. Single-stop notes align with passenger names. Browser geometry checks passed in light/dark mode; 320/390/768/1440-pixel state checks passed without overflow or page errors. Impeccable mechanical detection returned no findings. Google was mocked; no upload or deployment.

## GitHub source upload — 2026-10-20

User explicitly requested “upload to github”. Release includes current 12/18-minute route budgets, selected warm workspace, box alignment and removal of Ahmad Ali from the placeholder. Eleven tests, production build and diff whitespace check passed immediately before upload. Source upload targets the existing origin/main; deployment and live Google validation remain outside this release. Earlier “not uploaded” entries describe their historical checkpoints.
