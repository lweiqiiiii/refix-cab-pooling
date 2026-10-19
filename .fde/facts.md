# Facts

| Fact | Evidence / Source | Confidence | Last Validated |
|---|---|---|---|
| FDE scaffolding was initialized without overwrite; no prior loop or approvals were recorded. | Initializer output and `.fde/project_state.md`, `.fde/approvals.md` on first activation | High | 2026-10-19 |
| The existing app accepts names and postal codes, calls `/api/group`, and presents cab assignments with a WhatsApp copy action. | Source inspection of `app/page.js`; runtime behavior remains unverified | High for source behavior | 2026-10-19 |
| Next.js app scripts include development, build, start, and Node tests. | `package.json` | High | 2026-10-19 |
| REFIX provides transportation for events starting early or ending late; staff are currently grouped by location/postal code. | User context, conversation 2026-10-19; not directly observed | Stakeholder-reported | 2026-10-19 |
| The user states maximum four passengers and two home pickup/drop-off locations per cab, with the venue additional. | User context, conversation 2026-10-19 | High for stated requirement | 2026-10-19 |
| Current code permits three passengers and filters paired stops to less than 15 minutes apart. | `lib/group.mjs`, source inspection | High for implementation | 2026-10-19 |
| Full-time staff manually compare postal codes; staff volumes vary and the application is a prototype. | User interview, latest answers | Stakeholder-reported | 2026-10-19 |
| Cab count is the first priority, passenger journey time second; venue location must not affect grouping. | User interview, latest answers | High for stated requirement | 2026-10-19 |
| User requests 10 minutes between locations; same-house siblings share one location but consume individual passenger seats. | User interview, latest answers; location cap and time semantics still open | High for stated requirement | 2026-10-19 |
| Up to three distinct home locations and four passengers per cab; 10-minute limit applies to each consecutive leg, not total inter-stop journey. | User explicitly confirmed the three-location example and accepted two 8-minute legs despite A–C taking 16 minutes | High for stated requirement | 2026-10-19 |
| Siblings/housemates must share a cab unless selecting different drop-off locations. Pasted name/postal-code input is sufficient; user reports prototype otherwise meets intent. | Latest user interview | Stakeholder-confirmed | 2026-10-19 |
| Representative list has 12 staff: nine with postal codes, three area-only. Current parser skips lines without codes. | User-provided sample, retained only as aggregate pattern; source inspection of `app/page.js` | High | 2026-10-19 |
| Missing postal codes must be flagged in the web application. Passengers with the same postal code must form one pickup/drop-off group. | Latest user answers 1 and 2 | User-confirmed requirement | 2026-10-19 |
| Parties above four passengers require manual arrangement and must be flagged. | Latest explicit user answer | User-confirmed | 2026-10-19 |
| Existing grouping splits postal-code parties, greedily selects nearest pairs only, and API ride caches use an unordered pair key for one-direction times. | `lib/group.mjs`, `app/api/group/route.js`, source review | High for source behavior; not runtime-validated | 2026-10-19 |
| A2 implemented: four seats/three stops/10-minute consecutive legs, manual parties, correct multi-stop output, bounded nearby search. | Application diff and 10 passing tests, production build, mocked browser checks | Verified locally with provider mocks | 2026-10-19 |
| Google Cloud quota settings were not inspected or modified; no live Google requests were made during validation. | Tool/action record; provider tests use mocked fetch/browser interception | High | 2026-10-19 |
