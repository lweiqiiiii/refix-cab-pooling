# Project State

Project: REFIX Cab Pooling
Client: REFIX (event manpower company)
Last Updated: 2026-10-19T17:53:39+08:00

## Current Objective

Apply the user-requested 15-minute consecutive-stop drive limit and publish the verified change to the existing GitHub repository.

## Primary Loop

Delivery. User explicitly requested continuing the build after Design A1, with API limits preserved; A2 records the narrow scope and actual wording.

## Active Skill

FDE Project Controller (`~/.fde-os/SKILL.md`).

Communication skill: i-have-adhd (default for FDE OS)
Additional communication skill: caveman (default for FDE OS)
Caveman cloud routing: off (user preference)
Engineering skill: ponytail (default for FDE OS; level: full)

Current work: interface refinement within the approved Delivery stage. Impeccable shape/refinement and Uncodixfy guide presentation; no backward stage transition is proposed. Existing product/workflow context is available from Discovery and A2; do not repeat that interview. User confirmed refining the current appearance for both laptops and phones. A3 presentation changes are implemented in app/page.js and globals.css; backend behavior remains unchanged.

## Current Status

A3 interface refinement implemented and verified. Ten tests, production compilation, and mocked light/dark responsive state checks pass. Remain in Delivery. The user subsequently authorized uploading A3 source to the existing GitHub repository; deployment is not approved.

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

Collect planner feedback on the refined prototype after the authorized source upload. Do not change backend rules, Google quotas, or deployment.

## Return Condition

The approved interface direction is implemented and verified on relevant screen sizes, while grouping behavior and API bounds remain intact.

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

## A4 current rule

User explicitly requested “lets change it to 15mins drive. and upload it to github”. The current limit is at most 15 minutes (900 seconds) per consecutive directed leg, superseding earlier 10-minute requirements in the history. Four passengers and three postal-code stops remain. Ten automated tests and production build pass; no Google quota settings, lookup bounds, or deployment changed. Source upload is authorized; next substantive work remains planner feedback within Delivery.
