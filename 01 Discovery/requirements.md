# REFIX transport requirements — discovery draft

Evidence reviewed: 2026-10-19. Source: user context in this conversation; source code where specifically identified. Business context is stakeholder-reported, not direct observation.

## Problem and current workflow

REFIX is an event manpower company. Events starting early or ending late require company-provided transportation. REFIX gathers each person's name and location or postal code, groups nearby people, and arranges travel from homes to an event venue or from the venue to homes. Full-time staff perform grouping manually by checking each postal code for proximity. Staff counts vary by event. This application remains a prototype to refine. The user confirms pasted names and postal codes are sufficient to generate groups and reports that the prototype otherwise works as intended. Planning time, booking, and exception handling remain unknown.

## Stated business rules

- Each cab carries at most four passengers.
- Siblings or housemates sharing one home location must stay in the same cab, unless they choose different drop-off locations. The user defines matching postal codes as one must-stay-together pickup/drop-off party; no separate household identifier is required.
- Each cab serves at most three distinct home locations, replacing the earlier two-location limit. People from the same house, such as siblings, count as one location while each counts toward passenger capacity.
- Both home-to-venue and venue-to-home journeys occur. Only staff pickup/drop-off locations should determine groups; the venue must not affect grouping.
- Minimize cab count first, then passenger journey time. The exact journey-time tie-break measure remains to be defined.
- Each consecutive inter-stop drive may take at most 10 minutes. The total inter-stop journey may exceed 10 minutes, and nonconsecutive locations do not need to be within 10 minutes of each other.
- Google APIs are reportedly connected to determine travel times between locations. Integration health, product names, cost, and traffic assumptions have not been verified.

## Historical implementation evidence before A2 Delivery

`../lib/group.mjs` sets `MAX_PAX = 3` and `MAX_RIDE_S = 15 * 60`, filtering pairs to a drive time strictly below that threshold. `../app/page.js` describes these limits and submits postal-code counts to `/api/group`. This is source inspection only.

The three-person cap conflicts with the four-passenger rule. The existing 15-minute threshold conflicts with the requested 10-minute limit. No application behavior has been changed.

## Acceptance candidates, not approved delivery scope

Assignments must cover staff without exceeding four passengers per cab. Household sharing consumes one location but multiple passenger seats. Cab count takes priority over journey time, and venue information must not affect grouping. A cab may serve at most three distinct home locations, with each consecutive drive taking at most 10 minutes. Example: two siblings at A, one passenger at B, and one at C fit one cab when A–B and B–C each take 8 minutes, even if A–C takes 16 minutes.

## Representative input evidence

The user supplied a 12-person example: nine entries include postal codes and three give only area names. The invitation/header is also part of the pasted message. Personal names and home postal codes are deliberately not reproduced in these documents. This is one sample, not an event-size limit or typical-volume estimate.

Source inspection of `app/page.js` shows that lines without a 5–6 digit code are skipped. Broad areas do not establish a precise home pickup point, so inferring one may create incorrect stops and travel times. The user confirms that missing postal codes must be flagged in the web application; do not infer precise locations from area names.

## Next questions

No immediate business-rule question remains. The user confirms parties above four passengers must be flagged for manual arrangement, without automatic splitting.

## Later validation

Event volumes vary; no numerical upper bound or planning-time baseline is available. Do not ask the same volume question repeatedly. Establish a bounded performance validation before pilot use. Confirm output handoff, overrides, invalid location handling, access, API cost ownership, and planner baseline before Discovery exit or explicitly bounded later validation. For this product, postal-code equality is the user-confirmed grouping identity, regardless of actual household membership.

## Additional acceptance candidates

- Entries without a postal code are visibly flagged in the web application and are not silently treated as assigned.
- All passengers with one postal code form one shared pickup/drop-off party and stay together when within four-passenger capacity.
- When a postal-code party exceeds four passengers, flag all affected people for manual arrangement and exclude the whole party from automatic assignment. Do not split it.

## Discovery acceptance examples — review revision D1

| Example | Required outcome |
|---|---|
| Four people at one postal code | One four-passenger cab, one location |
| Two people at A, one at B, one at C; A–B and B–C each 8 minutes | One four-passenger, three-location cab is valid; total 16 minutes is allowed |
| A consecutive leg exceeds 10 minutes | That route is not a valid shared cab |
| Same postal code has five people | Flag the entire party for manual arrangement; assign none of that party automatically |
| An entry has an area name but no postal code | Show it as needing a postal code; never claim it is assigned |
| Venue changes with identical staff locations | Grouping remains unchanged |
| Two valid solutions differ in cab count | Prefer fewer cabs; shorter journey is secondary |

These are requirements for future validation, not claims that the current prototype passes.
