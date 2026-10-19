# Delivery State

## Current Vertical Slice

A2 grouping complete; A3 refines existing interface for laptop/phone readability, with backend and quota settings untouched.

## Acceptance Criteria

Four seats, three stops, intact postal-code parties, above-four manual flag, missing-code visibility, 600-second consecutive-leg limit, no venue influence, cab-count-first bounded selection, correct all-stop copy/map output, and explicit unresolved accounting.

## Implementation Status

Implemented in existing app and lib paths. No new dependencies, durable storage, deployment, or account settings.

## Validation Status

10 Node tests, production build, mocked desktop/mobile browser, synthetic 100-location invariant/work-bound check, and diff whitespace checks pass. Focused independent review found no material issues; an independent exact solver matched 1,000 seeded small graph cases.

## User Feedback

User reported the previous prototype works well; new slice awaits their actual workflow feedback.

## Production Readiness

Live API quota/access/provider terms, deployment exposure, operating/cost owner, and real event acceptance remain unverified. Nearby candidate limits and bounded search do not guarantee global minimum.

## Release Status

Local implementation only. Stage remains Delivery; no Operations or deployment approval.

## A3 interface evidence

User selected cleanup of the warm existing design for both device classes. Cab headings and stop numbers, full-width routes, native compact exception disclosure, optional Maps usage, and responsive spacing are implemented. Ten tests, production build, and mocked light/dark browser state checks at 320–1440 pixels pass. Awaiting real planner feedback; changes remain local.

## A4 rule amendment

Current maximum consecutive drive is 900 seconds (15 minutes), replacing 600 seconds. Updated boundary, three-stop, and mocked POST tests pass with all ten tests. Production build passes. User authorized GitHub upload; no deployment or quota changes.

## A5 current time budgets

Supersedes the per-leg rule: two-stop cabs have a 720-second total budget; three-stop cabs have a 1080-second total budget. UI displays the rules and each multi-stop cab's total. Eleven tests and production build pass; no live API calls or quota changes. A5 is local, not uploaded or deployed.

## GitHub source upload — 2026-10-20

User explicitly requested “upload to github”. Release includes current 12/18-minute route budgets, selected warm workspace, box alignment and removal of Ahmad Ali from the placeholder. Eleven tests, production build and diff whitespace check passed immediately before upload. Source upload targets the existing origin/main; deployment and live Google validation remain outside this release. Earlier “not uploaded” entries describe their historical checkpoints.
