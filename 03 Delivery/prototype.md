# Prototype walkthrough — A2

This is the existing Next.js app refined in place. There is no hosted release or verified live demo from this delivery. See [setup](setup.md) to run locally and [validation](validation.md) for checks already performed.

1. Paste one staff member per line with their name and postal code. Lines copied from Excel and the existing 5-digit postal-code padding behavior remain supported. Area-only lines are visibly flagged; collect their exact postal codes rather than guessing a home location.
2. Select **Group into cabs**. The server uses postal-code counts only; names stay in the browser. People at the same code form one party. Above four people at one code means manual arrangement for the entire party.
3. Inspect ordered stops and each consecutive drive time. A cab carries at most four people and serves at most three codes. Each leg is at most 10 minutes; two 8-minute legs are valid even though the total is 16 minutes. Venue is not used.
4. Review **Not in a cab** for manual, unresolved, and missing-code entries. The cab summary counts assigned people only. Correct input and group again as needed.
5. Use **Route** to open all displayed stops in Google Maps, or **Copy for WhatsApp** to copy ordered groups and unassigned entries. The displayed order is supported by measured directed legs; a live Google Maps route may differ as provider data changes.

The nearby search tries to reduce cab count before total inter-stop time but does not guarantee the globally fewest cabs. Lookup bounds preserve the prototype's cost-conscious approach. External quotas remain unchanged and unverified; live use can consume allowance.
