# Discovery scope — proposal, not implementation approval

## Smallest useful outcome

A REFIX transport planner can review proposed cab groups from a staff list under confirmed capacity, stop, and journey rules. The planner is a full-time REFIX staff member. The priority is fewer cabs, followed by shorter journeys; a measurable baseline and exact handoff still need validation. Existing code may already solve part of the problem; assess before replacing it.

## Current authorized work

| Work | Reason | Acceptance | Dependencies | Owner |
|---|---|---|---|---|
| Discover and document the present workflow and rules | Avoid optimizing the wrong grouping outcome | Representative event, decision priorities, constraints, and unresolved exceptions recorded | User context and eventual planner validation | Agent records; user supplies context; business approver to be identified |

## Proposed capability boundary

The user confirms that pasting names and postal codes to generate groups is sufficient for the prototype. Human review and the existing copyable assignment output are the proposed workflow boundary; no new booking or dispatch system is required by current evidence. Four passengers and a 10-minute inter-location drive-time limit are user-stated rules. Venue location must not affect grouping. At most three distinct home stops are allowed; the 10-minute limit applies to each consecutive leg, not the total journey.

## Excluded from this discovery round

Application changes, deployment, automatic cab booking, payments, dispatch integrations, and new staff accounts are not authorized by this interview. These are scope boundaries, not permanent product exclusions.

## Deferred decisions and hidden work

Confirm planner/approver, input quality, late changes and overrides, output channel, access to personal data, API budget/ownership, launch state, and operational responsibility before scope approval. Revisit each when the first workflow is bounded. No timeline, budget, or delivery estimate is committed.

## Alternatives to validate

Compare keeping the existing app, adjusting confirmed rules, and improving the manual spreadsheet/process. A new booking system is not assumed necessary. Minimum value and trade-offs depend on actual planning effort and transport cost.

## Scope review

Discovery review D1 is ready. Transition to Design is proposed and pending explicit approval; no implementation is approved.

## Household and incomplete-input constraints

Siblings/housemates at one home location must stay in one cab unless they choose different drop-off locations. Matching postal codes define a single pickup/drop-off party. The user confirms parties above four must be flagged for manual arrangement, with no automatic split. Area-only entries occur in the representative input; the user requires missing postal codes to be flagged in the web application. Implementation remains subject to the FDE stage process.

## Proposed bounded refinement — revision D1

| Capability | Reason | Acceptance | Dependency | Owner |
|---|---|---|---|---|
| Preserve pasted names/postal codes and copyable output | Existing workflow meets user intent | Retain working input and assignment output; missing-code rows remain visible | Existing page and parser | Agent implements after stage approval; REFIX full-timer reviews |
| Enforce four seats, three stops, same-code cohesion, and 10 minutes per consecutive leg | Align prototype with confirmed business rules | Requirements acceptance examples pass, including capacity and route-time edges | Suitable directional Google route data; grouping feasibility assessment | Agent validates; user reviews |
| Prioritize cab count over journey time | Primary business value | Evaluate selection against counterexamples where nearest-first produces more cabs; state any bounded optimization limit | Design-stage algorithm, workload, and API-cost analysis | Agent assesses; user approves material trade-offs |
| Flag incomplete/unresolvable locations and parties above four | Avoid silent omissions or invalid cabs | Every person appears exactly once in an assigned cab or an explicit unresolved/manual category | Existing error handling and clear output categories | Agent validates; REFIX planner handles manual arrangements |

No new booking, dispatch, accounts, stored staff history, or venue-based routing is proposed. Preserve existing application paths and suitable components. Reuse existing missing-code flags where sufficient.

## Proposed Design validation conditions

- Inspect the existing grouping and API ownership before choosing the smallest coherent change. Source shows pair-only nearest-first grouping, automatic splitting, and one-direction travel-time caching; these are evidence of mismatch, not a prescribed redesign.
- Decide the cab-count optimization method and journey-time tie-break explicitly. Do not promise globally minimal cabs from a heuristic or silently relax confirmed constraints.
- Bound performance and Google API costs. Event volume and planning-time baseline are unknown. The current 100-distinct-code guard is an implementation limit, not an approved workload target; retain a safe guard until a tested limit is agreed.
- Define directional route/order handling and cache compatibility so each displayed consecutive leg has valid supporting drive time. Venue remains excluded.
- Identify deployment/access and API-cost owner before any pilot. No publication or live usage is included in this transition.

Unknown production responsibilities and numerical savings do not block a bounded prototype design. They block readiness claims and must be resolved before pilot use. No dates, savings, or service-level commitments are made.
