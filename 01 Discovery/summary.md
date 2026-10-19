# Discovery review — revision D1

Evidence review: 2026-10-19. Status: ready for user review; proposed transition to Design awaits explicit approval.

## Problem and users

REFIX full-time staff manually compare staff postal codes to arrange transport for early-start or late-finish events. Staff counts vary; no reliable volume ceiling or planning-time baseline is available. The app is a prototype and the user reports that its paste-and-generate workflow works as intended. Refine the existing app rather than assuming a replacement system is needed.

## Confirmed rules

- At most four passengers and three home pickup/drop-off locations per cab.
- Matching postal codes form one party and stay together. Parties above four passengers are flagged for manual arrangement; never automatically split.
- Each consecutive inter-stop drive is at most 10 minutes. A three-stop journey may exceed 10 minutes overall.
- Minimize cab count first, then passenger journey time. Venue does not affect grouping.
- Paste names/postal codes; flag missing postal codes in the web app. Existing copyable assignments provide the proposed output boundary.

## Evidence and current gaps

The representative list has 12 people: nine with postal codes and three with area names only. Personal sample details are not reproduced in artifacts.

Source inspection confirms existing missing-code detection, a name-free postal-code/headcount API payload, Google geocoding/Routes calls, and a 100-distinct-code request guard. It also shows three-seat capacity, pair-only nearest-first grouping, a strict 15-minute threshold, automatic splitting of co-located passengers, and single-direction route caching. These do not fully implement the confirmed rules or establish minimum cab count. No runtime or live API validation was performed.

## Scope and validation conditions

Keep paste input and copyable results; refine grouping and explicit exception flags. Booking, dispatch, payments, accounts, persistent staff history, deployment, and venue-based grouping are outside the proposed refinement.

Design must assess cab-count optimization, directional route ordering/caching, bounded performance/API cost, and a precise journey-time tie-break before implementation is proposed. Workload and planning-time baselines remain unknown. Deployment/access and cost ownership require confirmation before pilot use. No production-readiness or quantified-savings claim is supported.

## Review package

- [Requirements and acceptance examples](requirements.md)
- [Scope and bounded validation conditions](scope.md)
- [Coverage and remaining gaps](coverage.md)
- [Project overview](../overview.html)

## Recommendation

Proceed to Design to determine the smallest coherent refinement of existing grouping and API behavior. This is a recommendation only. Primary Loop remains Discovery until the user explicitly approves transition D1; no implementation or deployment is authorized by this review.
