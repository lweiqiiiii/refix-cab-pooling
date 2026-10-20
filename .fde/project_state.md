# Project State

Project: REFIX Cab Pooling
Client: REFIX (event manpower company)
Last Updated: 2026-10-20T12:59:41+08:00

## Current Objective

Resume approved Delivery, verify the current prototype against its client guide, and obtain representative planner feedback.

## Primary Loop

Delivery. User explicitly requested continuing the build after Design A1, with API limits preserved; A2 records the narrow scope and actual wording.

## Active Skill

FDE Project Controller (`~/.fde-os/SKILL.md`).

Communication skill: i-have-adhd (default for FDE OS)
Additional communication skill: caveman (default for FDE OS)
Caveman cloud routing: off (user preference)
Engineering skill: ponytail (default for FDE OS; level: full)

Current work: time-budget refinement within Delivery. Pure grouping and the existing POST interface own validation; the page shows both rules and total route durations. No stage transition or quota change is involved.

## Current Status

FDE resumed on 2026-10-20 at 8aa3129. User guide completed and synchronized; five mocked guide workflows, offline document checks, 11 tests and production build pass. No app changes, upload, deployment, or stage transition.

## Highest-Priority Uncertainty

Real planner acceptance and live Google quota/provider behavior; the implementation has only mocked provider and local build/browser validation.

## Current Blockers

Missing-code flagging and matching-postal-code grouping are confirmed. Parties above four must be flagged for manual arrangement without splitting. Event volumes vary without a numerical bound; later performance validation must be bounded.

## Latest Evidence

- User requested: "run my FDE OS on this project" (conversation, 2026-10-19).
- Initializer completed without overwrite; no prior stage or approval evidence was present.
- `package.json` defines a Next.js application with development, build, start, and Node test commands.
- `app/page.js` provides guest-list input, calls `/api/group`, and displays cab groups with a WhatsApp copy action. Its stated limits are three people and two postal codes per cab, with pickups under 15 minutes apart. This is source inspection, not runtime validation or confirmation of business requirements.
- Root `overview.html` and Discovery documents now capture interview findings; future-stage documents remain scaffolding.

## Next Action

A REFIX planner reviews one representative assignment using `03 Delivery/user-guide.html`; capture feedback within Delivery. Live provider/quota checks need the account owner and remain unverified.

## Return Condition

Two- and three-stop candidates satisfy their inclusive total-time budgets; UI and current requirements agree; existing capacity, party, and API bounds remain intact.

## Proposed Next Loop

Remain in Delivery; no further stage proposed.

## Stage Approval Status

D1 and A2 approved: Discovery → Design → Delivery. Deployment and Operations not approved. See approvals.md.

## Context received on 2026-10-19

The user reports REFIX provides transport for events starting early or ending late. Staff names and locations/postal codes are collected and grouped by vicinity for home-to-venue or venue-to-home travel. Maximum four passengers and two home pickup/drop-off locations per cab, with the venue additional. Google location/travel-time APIs are reportedly connected; live integration is unverified. Source inspection confirms `lib/group.mjs` currently sets three passengers and an inter-stop drive time below 15 minutes. Record the capacity discrepancy for later authorized implementation; do not treat the existing time threshold as an agreed requirement.

## Latest clarification — 2026-10-19

Full-time staff manually compare postal codes; volumes vary. The app is a prototype. Minimize cab count before passenger journey time. Ignore venue location when grouping. The requested inter-location drive-time limit is 10 minutes. Four passengers may include siblings at one home location. The phrase “3 groups” needs confirmation against the earlier two-location cap. Historical notes above record earlier context, not superseding requirements.

## Confirmed location and time rules — 2026-10-19

User confirms up to three home locations per cab and four passengers. The 10-minute limit applies to consecutive legs. A–B = 8 minutes and B–C = 8 minutes is acceptable even when A–C = 16 minutes. This supersedes earlier location-count and multi-stop timing uncertainties; it does not approve a stage transition.

## Latest interview evidence

Housemates/siblings must stay in one cab unless selecting different drop-off locations. Pasting names and postal codes is sufficient; user reports prototype works as intended so far. Example contains 12 staff, nine with postal codes and three with area names only. Source parser skips code-less lines. Do not retain personal sample data in project artifacts. Staff volume remains variable; use later bounded validation instead of repeatedly requesting an unavailable estimate.

## Input policies confirmed

User requires missing postal codes to be flagged in the web app. Passengers with matching postal codes must be grouped together because their pickup/drop-off points match. This resolves household identity for the product; separate household fields are unnecessary. The earlier sample remains aggregate-only in artifacts. Over-four-passenger policy is still unanswered. No stage transition is approved.

## D1 review evidence

User confirms above-four postal-code parties require manual arrangement. Source review shows current splitUnits automatically splits parties, pairUp greedily selects nearest pairs, and the route API caches one direction under an unordered key. Existing missing-code flagging can be reused. These findings support Design as the next bottleneck; they do not authorize a stage change.

## A1 design evidence

Standalone synthetic spike passes 3-stop, capacity, manual-party exclusion, 600-second boundary, direction, and nearest-first counterexample assertions. Existing npm test: 4/4 pass under old rules. Exact synthetic cases up to 16 locations completed locally; no large-input or live Google validation. Complete directed element bound is n(n−1), up to 9,900 at current 100-code cap. User choice requested: return honest best-found results when proof is too costly, or withhold unproven results for manual arrangement. No answer assumed.

## A2 implemented evidence

10 automated tests pass; production build passes; mocked desktop/mobile browser checks pass. A 100-location synthetic check used 800 directed elements and preserved all hard rules/party accounting, with about 53 ms local selection. Google Cloud limits were neither inspected nor changed; no live provider calls occurred. Server cache ignores untrusted client known data. Latest stage summary: `03 Delivery/summary.md`. Earlier A1 complete-graph/proof-policy proposals are superseded by the user-authorized bounded prototype build.

Independent completion review found no material issues. Its independent exact solver matched 1,000 seeded eight-stop graphs for cab count, total seconds, and assignment conservation.

## A3 scope confirmation

User requested making the existing screen cleaner and cab groups easier, with full-timers using both laptops and phones. Preserve the warm identity; implement presentation refinement within Delivery. No grouping, Google/API guard, dependency, or deployment changes are part of this task.

A3 verification: light/dark at 320/390/768/1440 pixels, long names/addresses, multiple cabs, keyboard disclosures, usage access, empty/loading/error/manual-only/missing-only states, maps and clipboard. No overflow/page errors; production build and all 10 tests pass. Backend/API/package diff is empty. The user subsequently requested uploading these changes to the existing GitHub repository.

## A4 historical rule (superseded)

User explicitly requested “lets change it to 15mins drive. and upload it to github”. The current limit is at most 15 minutes (900 seconds) per consecutive directed leg, superseding earlier 10-minute requirements in the history. Four passengers and three postal-code stops remain. Ten automated tests and production build pass; no Google quota settings, lookup bounds, or deployment changed. Source upload is authorized; next substantive work remains planner feedback within Delivery.

## A5 current rule — 2026-10-20

User clarified “A + B + C = 18mins; A + B = 12 mins”. Two-stop route totals must not exceed 720 seconds; three-stop totals must not exceed 1080 seconds. The total is first staff stop through last, excluding the venue. Keep longer two-stop prefixes during enumeration so 13 + 5 minutes remains a valid three-stop route; do not publish that prefix as a standalone two-stop cab. Eleven tests and production build pass. No live provider work, quota change, upload, or deployment occurred.

## A6 interface exploration — 2026-10-20

Three isolated read-only designs are available at `/prototype/design?variant=A` (A/B/C), with synthetic data only. Browser checks passed at 320/390/1440 pixels, including click/keyboard switching. The route is unavailable in production. Awaiting user preference; no winner, upload, deployment or stage transition. See `03 Delivery/design-options.md`.

## A7 selection and implementation — 2026-10-20

User selected “A”. The working app implements the warm workspace within Delivery. Light/dark phone/laptop checks, mocked interactions, 11 automated tests and production build passed. No API logic changes, upload or deployment. Local implementation is complete; next step is user feedback.

## A8 — box alignment

User requested Impeccable refinement and aligned boxes. Shared desktop heading rows now align the staff-input box with the results area, including empty and populated states; responsive stacking is preserved. Single-stop notes align with passenger names. Browser geometry checks passed in light/dark mode; 320/390/768/1440-pixel state checks passed without overflow or page errors. Impeccable mechanical detection returned no findings. Google was mocked; no upload or deployment.

## GitHub source upload — 2026-10-20

User explicitly requested “upload to github”. Release includes current 12/18-minute route budgets, selected warm workspace, box alignment and removal of Ahmad Ali from the placeholder. Eleven tests, production build and diff whitespace check passed immediately before upload. Source upload targets the existing origin/main; deployment and live Google validation remain outside this release. Earlier “not uploaded” entries describe their historical checkpoints.

## FDE resumption — 2026-10-20

Initializer ran without overwrite. Existing A2 Delivery approval remains authoritative; no pending transition was found. i-have-adhd, caveman and ponytail full loaded; cloud routing remains off. Current controller requires guide regression on Delivery resumption: completed Markdown/HTML guide, mapped five tasks to requirements and executed local tests/browser replay. Current sprint remains draft 01 with unknown sprint targets, cadence and prices. Overview refreshed. No new external action authorized. Local page/favicon 404 and report-copy detector warning documented; no product defect found in tested workflows. Next primary uncertainty is planner acceptance and live provider/quota behavior; remain in Delivery.

## Documentation source upload request — 2026-10-20

User explicitly requested “upload to github” after the FDE resumption. Authorizes committing and pushing the current FDE state, completed user guide, validation evidence, overview, sprint draft, and initializer-created specification scaffold to existing origin/main. Specification remains an unpopulated draft; sprint dates and commercial terms remain unknown. Application revision 8aa3129 is unchanged. No deployment or stage transition is requested.
