# Prototype validation — A2

Evidence date: 2026-10-19. All staff/location fixtures are synthetic; no provided real staff list is stored here.

## Automated checks

From the repository root:

```sh
npm test
npm run build
node '02 Design/feasibility-check.mjs'
```

- Eleven Node tests pass across the pure grouping interface and `POST /api/group` with mocked provider responses.
- Tests cover whole-party/manual classification (including counts above the old 50-person input guard, which now safely require manual arrangement without provider work), directed nearby work bound, four people/three locations/13- and 5-minute legs, cab-count counterexamples, 720/721-second two-stop and 1080/1081-second three-stop boundaries, invalid directed durations, person conservation, cached reruns, malformed request data, 100-code guard, and missing matrix results.
- Production build passes with `/` and `/api/group` generated. Next.js warns about a parent-directory package-lock outside this repo; the build succeeds and that unrelated parent file was not changed.
- Design spike remains runnable, now checking the new selector on the old nearest-pair counterexample. Its exhaustive oracle is limited to 16 synthetic locations and is not application code.
- `git diff --check` passes.
- Independent review found no material issues and matched the selector to an independent exact solver on 1,000 seeded eight-stop graphs for cab count, total seconds, and assignment conservation. This is small-case evidence, not a global-optimum guarantee under bounded search.

## Mocked browser evidence

The installed Playwright/headless Chromium was used against `npm run dev -- --hostname 127.0.0.1 --port 3011`. The page's grouping endpoint was intercepted; all Google data was synthetic. Checked at 1440×1000 and 390×844:

1. Missing-code entry visible before any grouping request.
2. Four assigned passengers at three ordered stops; five manual and one unresolved passenger excluded from the assigned count.
3. Distinct 8-minute and 6-minute leg labels; middle waypoint and final destination present in the map URL.
4. Clipboard includes all stops and every manual/unresolved/missing-code row.
5. No page errors or horizontal overflow. Screenshots visually inspected; layout preserved.

Browser tooling was already cached outside the repo; no project dependency was added. Screenshots and the local browser driver were temporary validation artifacts, not product dependencies.

## Work-bound experiment

A deterministic 100-postal-code synthetic case generated 800 directed candidate elements, returned 34 cabs, conserved all 100 parties exactly once, and respected all stop/capacity/leg limits. Selection took about 53 ms locally. This is one finite workload check, not an SLA, a Google latency estimate, or proof that all inputs complete in that time.

## Not verified

Live Google routing/geocoding, actual account quota and free-tier enforcement, real event acceptance, public access controls, cloud deployment, and current provider retention terms. No paid API calls were used. Nearby selection and bounded optimization deliberately do not guarantee global minimal cab count or globally shortest travel.

## A3 interface refinement verification

Only presentation changed; `git diff --exit-code` confirms no changes to the grouping module, provider route, tests, or package configuration relative to A2.

- All 10 automated tests and production build pass after the interface changes.
- Focused mocked browser regression passes for missing-code visibility before grouping, explicit cab headings, compact/expandable exceptions, person counts, distinct leg times, all-stop map URL, and clipboard output including exceptions.
- Light/dark checks at 320, 390, 768, and 1440 pixels pass with long names/addresses and multiple cabs. Screenshots were visually inspected. No horizontal overflow or page errors occurred.
- Keyboard Enter toggles native exception details. Manual-only output opens details automatically; optional Maps usage remains accessible. Empty, loading, error, and missing-only states pass; no real Google calls were made.
- Impeccable's mechanical check reports no findings for the changed page/CSS. No new dependencies, live API work, Google quota edits, deployment, or GitHub upload occurred.

## A4 — threshold amendment verification

Updated grouping and POST integration examples first failed under the old 10-minute rule, then all ten tests passed with the new 15-minute rule. Coverage accepts exactly 900 seconds, rejects 901 seconds, and accepts a 27-minute three-stop route with 12- and 15-minute legs. Production build passes. This is a numeric-rule/text change; prior responsive UI checks were not repeated, and no live Google calls were made. Existing API guards and quota settings were not changed.

## A5 — stop-count time budgets

The updated acceptance tests first failed with the old per-leg rule, then all 11 tests passed after candidate generation enforced a 12-minute total for two stops and 18-minute total for three stops. Coverage verifies inclusive boundaries, rejects totals one second over, retains every party once, and preserves an otherwise-invalid 13-minute prefix when a 5-minute continuation forms a valid three-stop cab. Mocked POST grouping confirms this route and trusted cached reruns. Production compilation passes; compiled initial-page text displays both budgets. No live Google calls or layout redesign were needed. The retained Design spike documents earlier experiments; current-rule acceptance is `npm test`.

## A7 — selected warm workspace

User selected A. The working app now uses its warm split layout on laptops and stacked layout on phones, retaining all existing interactions and dark mode. All 11 tests, production build and mocked browser checks passed at 320/390/768/1440 pixels. No Google calls, quota changes, upload or deployment. See [interface options](design-options.md).

## A8 — box alignment

User requested Impeccable refinement and aligned boxes. Shared desktop heading rows now align the staff-input box with the results area, including empty and populated states; responsive stacking is preserved. Single-stop notes align with passenger names. Browser geometry checks passed in light/dark mode; 320/390/768/1440-pixel state checks passed without overflow or page errors. Impeccable mechanical detection returned no findings. Google was mocked; no upload or deployment.
