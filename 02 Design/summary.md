# Design — draft A1

Status: in progress, awaiting one material optimization-policy answer. Discovery → Design approval D1 is recorded. No Delivery transition is proposed yet.

## Proposed direction

Refine the existing paste/group/copy app. Keep the page, API route, and pure grouping module. Treat each postal code as an intact party, flag counts above four for manual arrangement, and select ordered routes with at most three stops and at most 10 minutes per consecutive leg. Missing-code flags already exist and should be reused.

Use cab count first, then proposed total inter-stop drive time. Correct directional route/cache handling, per-leg display, three-stop map/copy output, exception accounting, and server validation are part of the same coherent change.

## Evidence

The synthetic [feasibility check](feasibility-check.mjs) passes the key route/capacity examples and proves a nearest-first counterexample: current code uses three cabs where two suffice. Small exact instances through 16 locations complete locally, but this does not validate larger sizes or Google integration. Existing four baseline tests pass under old rules. No paid API calls or application changes occurred.

## Material trade-offs and remaining decision

Recommended: bounded cab-count-first search with a valid incumbent and honest minimum-count proof status. Alternative: withhold unproven groupings for manual arrangement. The user has been asked to choose; no answer is assumed.

Complete directional lookup can use up to 9,900 route elements at the existing 100-code cap, before cache/exclusion savings. That is a cost bound, not an approved budget. Live Google semantics, provider terms, deployment/access, cost owner, larger performance, and exact secondary metric remain to be verified or explicitly bounded before pilot commitments.

## Outputs

- [Architecture and workflow](architecture.md)
- [Options and proposed decisions](decisions.md)
- [Feasibility evidence and limits](feasibility.md)
- [Milestones](timeline.md)
- [Project overview](../overview.html)

## Next action

Resolve the bounded-result policy, then complete Design validation and present a concrete Design → Delivery review. Do not begin production implementation while waiting.

## A2 — build direction authorized by user

The user said: “lets continue with the build first, the first prototype was working pretty good. There is a limit on set on API to keep within the free use of google map”. This explicitly authorizes moving into Delivery for the narrow prototype refinement, preserving quota settings and bounded nearby-route selection. It supersedes the proposed complete-graph lookup and any promise of global minimum. Retain the existing 100-code guard, 15-km prefilter, and eight-neighbour work bound; use at most eight directed checks per eligible origin rather than doubling the work. Do not inspect or change external Google quota settings or make paid live calls during verification.

Update capacity, three-stop/per-leg timing, whole-party/manual exceptions, per-leg/copy/map output, and trusted cache handling within existing app paths. Use cab-count-first bounded selection over measured candidates, with an explicit best-found limitation. Existing visible missing-code handling should be reused. Tests cover pure grouping and the existing POST interface with mocked Google responses. No dependencies, deployment, accounts, new persistence, global exact solver, or complete pair matrix are included.

Design-to-Delivery scope A2 is approved by this explicit instruction; earlier A1 options remain historical proposals. Numerical performance and live quota readiness must not be claimed without later evidence.
