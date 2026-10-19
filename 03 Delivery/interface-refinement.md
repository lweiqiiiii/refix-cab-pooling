# Interface refinement — A3

User direction: make the existing screen cleaner and cab groups easier to read, for full-timers using both laptops and phones. This is refinement within Delivery, not a replacement visual identity or a stage transition.

## Confirmed brief and implementation

- Audience/task: REFIX planners paste names/postal codes, inspect assignments and exceptions, and copy groups. Visitor mode: Operate.
- Preserve the warm light/dark palette, system typography, paste/copy workflow, existing layout identity, grouping rules, API integration, and quota guards.
- Give each cab a proper heading and passenger/stop count. Use full-width routes with visibly numbered stops, clear names and per-leg durations; avoid cramped two-column cab cards on laptops.
- Keep the unassigned-entry count visible in a native expandable section. Default it open when no cab can be assigned. Detailed reasons and every unassigned person remain available and remain in clipboard output.
- Tighten mobile spacing, provide larger route/copy touch targets, distinguish loading from empty results, and put optional Maps usage/limits under a separate disclosure. Keep warnings visible before any grouping request.

## Change reach

Only `app/page.js` presentation and `app/globals.css` changed. Grouping, provider integration, test fixtures, package dependencies, and Google quota settings are untouched. No new abstraction or dependency was needed.

## Verification

The focused mocked browser check covers missing-code warnings before grouping, explicit cab headings, compact/expandable exceptions, assigned totals, distinct leg times, complete map URL, and clipboard including exceptions. Additional checks exercise light/dark themes at 320, 390, 768, and 1440 pixels; long names/addresses; multiple cabs; keyboard disclosures; Maps usage access; empty, loading, error, manual-only, and missing-only states. No live Google calls are used. See validation.md for final evidence.

## Boundaries

This improves presentation and disclosure only. It does not change assignment rules, API cost bounds, quota settings, or optimization guarantees. Real planner acceptance and live Google account/provider readiness remain separate. No deployment or new GitHub upload is included in this refinement request.

Subsequent user request: upload A3 to the existing GitHub repository. This authorizes source publication only, with no website deployment or quota changes.
