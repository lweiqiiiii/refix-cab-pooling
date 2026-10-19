# Discovery coverage

Evidence review: 2026-10-19. Open means incomplete, even where partial stakeholder evidence exists.

| Topic | Status | Evidence / rationale | Gap | Owner / next action / resolution point |
|---|---|---|---|---|
| Problem and impact | Open | User describes manual vicinity-based grouping for company-funded event transport. | Planning effort, cost, and errors lack a baseline. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Stakeholders | Open | REFIX is the company; staff are passengers. | Full-time staff plan; business approver and maintainer remain unknown. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Workflow and exceptions | Open | Names and locations collected; groups travel home-to-venue or venue-to-home. | 12-person sample supplied; nine postal codes, three area-only entries. Missing postal codes must be flagged. Handoff, late changes, and booking remain open. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Outcomes | Open | Fewest cabs is the confirmed primary objective; shorter passenger journeys is secondary. | Cab count first, passenger journey time second; quantitative baseline remains unknown. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Alternatives | Open | Existing app and a process/spreadsheet change are candidate smaller interventions. | Compare against the real baseline before committing. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Business rules | Open | User confirms four passengers, three home locations, and at most 10 minutes per consecutive leg. Same home counts as one location. | Code uses three passengers and 15 minutes; user requires four passengers, up to three locations, and 10 minutes per leg. Household cohesion confirmed unless choosing distinct drop-off locations; matching postal codes define one party; over-capacity parties must be flagged for manual arrangement. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Systems and data | Open | User reports Google travel-time integration; source shows /api/group caller. | Live status, traffic basis, input quality, API cost/access unknown. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Privacy and permissions | Open | Staff names and home locations are collected. | Confirm who can view input/output and whether any retention is needed. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Scope and capacity | Open | Current work is context discovery. | Volume, first useful release, budget, and deadline unknown. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Adoption and support | Open | No direct planner observation yet. | User device, workflow fit, manual review, and support owner unknown. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |
| Operations | Open | Deployment status not supplied. | Prototype confirmed; recurring cost, ownership, and measured outcomes unknown. | User supplies context; agent records evidence; resolve before Discovery exit or explicitly bound later validation. |

## Contradictions and blockers

Four passengers is the stated business rule; existing code allows three. The user requests 10 minutes, cab-count priority, and venue exclusion. Three locations and consecutive-leg timing are now confirmed. Pasted input is sufficient. Missing codes must be flagged; matching postal codes define a party. Core rules are confirmed. Volume is variable and unbounded; Design must assess a tested limit and API cost before Delivery approval.

## Deliberate boundaries

No booking, payment, dispatch, or account system is assumed necessary. No code changes are part of this interview.

## Review D1 disposition

Core rules and input boundary are stakeholder-evidenced. Above-four parties require manual arrangement. Remaining algorithm, directional route/cache, runtime, cost, and secondary metric questions are bounded Design validations, conditional on user-approved transition. Deployment access, owner, support, and numeric impact baseline remain open before any pilot; no production claims are made. Discovery review is ready, not exhaustive.
