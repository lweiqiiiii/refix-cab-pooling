# Assumption Register

| Assumption | Evidence | Confidence | Impact if Wrong | Validation Method | Status | Owner |
|---|---|---|---|---|---|---|
| Total inter-stop seconds is a suitable secondary journey-time metric | Venue explicitly excluded; full journey semantics not provided | Proposed, unvalidated | Tie-break may differ from planner preference | Present in Design review | Open | User/agent |
| Small-instance exact results predict acceptable production search performance | Synthetic cases only through 16 locations | Low | Slow requests or timeout at larger sizes | Benchmark actual chosen search under bounded workload before acceptance | Open | Agent |
