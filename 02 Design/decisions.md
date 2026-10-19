# Design decisions — draft A1

Review date: 2026-10-19. Proposed decisions below are subject to Design review. Business rules are already confirmed; the user-approved stage is Design only.

| Decision | Recommendation and why | Alternatives / trade-off | Status |
|---|---|---|---|
| Keep current page, API route, and pure grouping module | Existing separation and paste/copy workflow fit the task | New service/solver dependency adds setup without demonstrated need | Proposed |
| Treat one postal code as an indivisible party; flag above four | User-confirmed identity and capacity rule | Automatic splitting would violate the rule | Requirement |
| Use directed route data for ordered legs, with inclusive 600-second limit | Necessary for valid consecutive-stop routes | Unordered one-direction caching can return the wrong leg | Proposed implementation of confirmed requirement |
| Optimize cab count before inter-stop drive duration | Reflects stated priority; venue-independent tie-break | Full passenger-time optimum needs journey-direction/venue semantics excluded from current scope | Proposed secondary metric |
| Use complete capacity-compatible directed route graph | Supports valid global-minimum claims across measured route data | Closest-neighbour pruning reduces API use but may remove the best grouping | Proposed; paid-call budget not yet approved |
| Reuse only trusted server-fetched route cache | Prevent user-supplied times from bypassing hard route constraints | Signed client cache adds machinery; retaining current unsigned authority is incorrect | Proposed; freshness/size and provider terms to validate |

## Selection approaches considered

| Approach | Benefit | Cost / limitation | Recommendation |
|---|---|---|---|
| Bounded cab-count-first search with a valid incumbent and explicit proof status | Valid results remain available promptly; can prove minimum on easy/small inputs | Cannot promise an absolute minimum on every large input; workload/search limit must be measured | Recommended; user decision pending |
| Require proven minimum for every automatically returned group | Strong, clear count guarantee | Three-stop set partition can take too long; timeout means manual arrangement rather than a usable best-found grouping | Alternative presented to user |
| Extend nearest-first greediness to triples | Small algorithm and quick result | Can spend cabs to save seconds, reversing the user's priority; easy to mislabel as optimal | Rejected as sole selection method |

## Material unresolved choice

The user has been asked whether an honest best-found result is acceptable when minimum cab count cannot be proven quickly, or whether unproven results must be withheld for manual arrangement. No silence-based selection is made. The default recommendation is not an approval.

No cloud deployment, paid Google API experiment, solver package, new persistent storage, or public service is approved by this draft.

## A2 supersedes pending A1 options

The user requested building the existing prototype while preserving API limits. Implemented bounded nearby candidates (eight directed destinations per origin, 15-km prefilter), bounded cab-count-first selection with no global-minimum claim, and trusted server cache. Complete-graph lookup and proven-minimum-only output were not built. See the Delivery summary for actual implementation/verification.
