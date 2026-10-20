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

## FDE resumption — 2026-10-20 / candidate 8aa3129

Objective: resume approved Delivery and replace the new user-guide scaffold with instructions verified against the existing app. No app/API code changed, no stage transition proposed. FDE testing_strategy.md and e2e_testing.md selected the existing public grouping/POST tests plus guide-linked UI replay. Matt Pocock TDD was loaded and applied as public-interface testing guidance; existing tests were rerun, no new implementation or red/green cycle was needed. Playwright skill loaded; CLI open/snapshot confirmed visible controls. Existing cached Playwright/Chromium tooling then executed the broader scripted replay. Impeccable was applied to preserve the incumbent document presentation; Uncodixfy and verification-before-completion were consulted.

### Cases recorded before execution

All G cases: planner role (no sign-in UI), local dev server at 127.0.0.1:3011, synthetic names and 910001–910005 codes. POST responses are intercepted; no Google calls occur. Clipboard success/denial is simulated; external URLs are inspected without opening them. Source revision 8aa3129, guide revision 2026-10-20.

| Case / requirement coverage | HTML task | Steps and expected visible result | Actual / status |
|---|---|---|---|
| G1 access and device layout | open-planner | Open local URL; find Staff list, labelled textarea and No cabs yet; compare phone/laptop layouts. | Pass: Chromium, 390/1440px; no overflow or page errors. |
| G2 input/missing-code visibility, code normalization, names privacy | group-staff | Paste two people at A, one at B and C, five at D, one unknown E, and one area-only line. Expect warning before submit, loading, one cab/four assigned. Repeat Excel/five-digit and missing-only input. | Pass: warning and disabled missing-only action, 4 assigned; POST contains only codes/counts; five-digit input becomes six digits. |
| G3 capacity, stop accounting, manual/unresolved visibility and usage | review-groups | Open exceptions and usage. Expect five manual, one unresolved, one missing; 3 ordered stops, 8/6-minute legs and 14-minute total. Repeat five-person manual-only result. | Pass: exact counts and times; no-cab exception details auto-open. Rules independently checked in Node tests. |
| G4 all-stop Maps and copying with exceptions | share-assignments | Inspect Route and address links; copy into simulated draft; deny clipboard and follow documented recovery. | Pass: origin/waypoint/destination ordered, new-tab target; Copied shown; all stops/exception types in draft. Denial displays recovery; assignments selectable. Actual OS manual copy, external Maps loading and message sending not tested. |
| G5 edit and error recovery | retry-grouping | Edit list, find changed notice, Group again; inject Google 502, max-code 400, missing-key 500 then retry. | Pass: stale notice clears, failures preserve input and show errors, each subsequent mocked retry succeeds. Account/key correction itself is simulated, not live. |
| D1 source/render parity and attachment usability | all five anchors | Compare every instruction, prerequisite, result and task ID with Markdown; open documents offline at 390/1440; print; navigate overview. | Pass: five tasks match; no overflow; guide print, overview audience tabs/architecture selector, all-slide print and no-JavaScript fallback pass. Sprint progress remains unassessed. |

Requirement references: current business rules and acceptance examples in `01 Discovery/requirements.md`; latest A5 time budgets and A7/A8 interface changes in this validation record. Input/household/capacity/venue/search/API requirements without independent user actions are covered by the 11 existing tests through `lib/group.mjs` and `POST /api/group`. Inclusive 720/1080-second acceptance and 721/1081-second rejection are included. This mapping does not establish live-provider or real-user coverage.

### Executed evidence

- `npm test`: 11 passed, zero failures. Covers grouping rules, parties, directions, search counterexamples, candidate bounds, API validation, cache and incomplete-provider failure behavior.
- `npm run build`: exit 0; / and /api/group compile. Existing parent-directory lockfile warning persists.
- `node /private/tmp/refix-guide-check.cjs`: exit 0, G1–G5 pass. `node /private/tmp/refix-doc-check.cjs`: exit 0, D1 pass. Temporary drivers and screenshots are local inspection artifacts, not shipped app dependencies. Phone app and guide screenshots visually inspected.
- Initial replay attempts stopped on two harness locator errors: Next.js adds a second alert, and the changed notice contains button text. Narrowing to `.error[role=alert]` and `.notice` resolved both; complete replay then passed. No product defect or source fix was needed.
- CLI console recorded a missing `/favicon.ico` (404), a nonblocking existing asset gap; not a grouping failure. Scripted replay found zero uncaught page errors and zero external requests.
- Impeccable detector found one report-copy cadence warning, no findings for overview/guide. Existing report wording was preserved; no visual redesign was attempted.

### Remaining gaps / completion status

No defects found in the tested workflows. The former empty guide is now populated and matched to the app. All three required local passes ran; the Matt pass reused existing tests rather than claiming new TDD work. These are agent-executed checks, not observed planner acceptance. Live Google/quota/provider terms, deployed security/access, real-event outcome, external Maps loading, actual clipboard permissions, and support/cost ownership remain unverified. Owner: project owner to identify the relevant planner and Google account owner; next action: review one representative assignment before arranging live validation. No deferral, deployment, handover, or Delivery-to-Operations transition is approved.
