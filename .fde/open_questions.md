# Open Questions

| Question | Priority | Owner | Status / evidence |
|---|---|---|---|
| Does “3 groups” mean three distinct home locations per cab, replacing two? | Resolved | User | Yes; up to three distinct home locations |
| How does the 10-minute limit apply across three locations? | Resolved | User | Each consecutive leg; total may exceed 10 minutes |
| What is the grouping objective? | Resolved | User | Fewest cabs first, then shorter passenger journeys |
| Should the venue influence grouping? | Resolved | User | No; only staff pickup/drop-off locations |
| Who groups staff and is the app live? | Resolved | User | Full-time staff manually compare postal codes; app is a prototype |
| What is the travel-time threshold? | Resolved | User | 10 minutes per consecutive leg |
| What are typical/maximum volumes and planning time? | Later validation | User | Volume varies; no numeric baseline yet |
| Must household members stay together? | Resolved | User | Yes, unless choosing different drop-off locations |
| How is a mandatory pickup/drop-off party identified? | Resolved | User | Matching postal codes define one party |
| How should missing postal codes be handled? | Resolved | User | Flag them in the web app; no inferred postal code |
| What happens if a mandatory party has more than four passengers? | Resolved | User | Flag entire party for manual arrangement; no automatic split |
| Is pasted name/postal-code input sufficient? | Resolved | User | Yes; prototype otherwise works as intended |
| How are outputs shared, changes handled, access controlled, and API costs owned? | Later validation | User | Open before Discovery exit or explicitly bounded validation |
| How should the build proceed after A1? | Resolved for A2 scope | User/agent | User requested continuing existing prototype with API limits preserved. Bounded best-found selection is implemented without global-minimum claims; no full matrix or exact-global requirement is assumed. |
| What Google element budget and workload are acceptable? | Before live paid validation/pilot | User/account owner | Complete-graph worst-case element counts documented; no paid calls authorized by this draft |

## Latest time-rule clarification

User requests three-stop pickup/drop-off routes to have an 18-minute maximum. Asked whether this means the combined two-leg route time or each individual leg. Existing rule remains 15 minutes per consecutive leg until clarified; no new implementation or upload occurred.

Resolved on 2026-10-20: user specifies A+B+C totals at most 18 minutes; A+B totals at most 12 minutes. The earlier total-versus-leg question is closed. These are complete-cab budgets by stop count, not a uniform per-leg rule.
