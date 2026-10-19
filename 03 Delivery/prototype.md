# Prototype walkthrough — A3 interface refinement

This is the existing Next.js app refined in place, retaining the warm visual identity for both laptops and phones. There is no hosted release or verified live demo from this delivery. See [setup](setup.md) to run locally and [validation](validation.md) for checks already performed.

1. Paste one staff member per line with their name and postal code. Lines copied from Excel and the existing 5-digit postal-code padding behavior remain supported. Area-only lines are visibly flagged; collect their exact postal codes rather than guessing a home location.
2. Select **Group into cabs**. The server uses postal-code counts only; names stay in the browser. People at the same code form one party. Above four people at one code means manual arrangement for the entire party.
3. Inspect ordered stops and each consecutive drive time. A cab carries at most four people and serves at most three codes. Two stops allow at most 12 minutes total. Three stops allow at most 18 minutes total between the first and last staff stop. A 13-minute drive plus a 5-minute drive is a valid three-stop route. Venue is not used.
4. Expand the **entries not assigned** section to review manual, unresolved, and missing-code entries. Its count always stays visible, and its details open automatically when no cab is assigned. The cab summary counts assigned people only. Correct input and group again as needed.
5. Use **Route** to open all displayed stops in Google Maps, or **Copy for WhatsApp** to copy ordered groups and unassigned entries. The displayed order is supported by measured directed legs; a live Google Maps route may differ as provider data changes.

The nearby search tries to reduce cab count before total inter-stop time but does not guarantee the globally fewest cabs. Lookup bounds preserve the prototype's cost-conscious approach. External quotas remain unchanged and unverified; live use can consume allowance.

Each cab now has a named heading, passenger/stop count, and numbered stop sequence. Expand **Maps usage and grouping limits** for lookup counts and the existing optimization limitation. The backend grouping and API bounds are unchanged by A3.

A5 shows the total driving time beside each multi-stop cab's passenger and stop counts, so planners can compare the result against its time budget.

## A6 visual options

Three responsive, read-only concepts are ready for comparison; no winner selected. See [design options](design-options.md) for previews, launch instructions and verification. The planner is unchanged and nothing has been uploaded.

## A7 — selected warm workspace

User selected A. The working app now uses its warm split layout on laptops and stacked layout on phones, retaining all existing interactions and dark mode. All 11 tests, production build and mocked browser checks passed at 320/390/768/1440 pixels. No Google calls, quota changes, upload or deployment. See [interface options](design-options.md).
