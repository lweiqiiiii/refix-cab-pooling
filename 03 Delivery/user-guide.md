# REFIX Cab Pooling — User guide

Version covered: 8aa3129. Verification date: 2026-10-20. Local prototype; browser checks use simulated Maps responses. Live Google access and planner acceptance remain unverified.

For REFIX staff preparing transport on phones or laptops. Standalone attachment: [user-guide.html](user-guide.html). Maintainer prerequisites: [setup](setup.md).

## Open the planner

Task ID / HTML anchor: `open-planner`.

Before you start: A maintainer must run the app and configure Google before real grouping. No sign-in screen is provided; public access is not approved.

1. For local use, run npm run dev -- --hostname 127.0.0.1 --port 3011 from the project folder after the maintainer completes setup.
2. Open http://127.0.0.1:3011 on that computer. This address cannot be opened from a different phone or computer.
3. Check that Staff list, Names and postal codes, and No cabs yet appear. Phones show results below the list; laptops show them alongside it.

Result and recovery: If the page does not open, ask the maintainer to check the server and printed address. No hosted address is confirmed.

## Prepare and group staff

Task ID / HTML anchor: `group-staff`.

Before you start: Open the planner. Obtain a name and Singapore postal code per passenger. Real grouping may consume Google allowance; the account owner must confirm quotas first.

1. Paste one person per line into Names and postal codes, for example Example A, 910001 and Example B, 910002. These are format examples, not verified locations. Excel rows work; five-digit codes gain a leading zero.
2. Check the person count. Correct every Postal code needed row. Area names alone cannot establish a stop; blank lines are ignored.
3. Select Group into cabs. The button shows Grouping… while working. With no recognized postal codes, the button is disabled.
4. Check the cab and assigned-person heading. Review exceptions before using assignments.

Result and recovery: Edit incorrect lines and group again. People sharing a postal code stay together. Parties above four require manual arrangement without automatic splitting.

## Review assignments and exceptions

Task ID / HTML anchor: `review-groups`.

Before you start: Complete a grouping run.

1. Read each Cab heading, passenger count, numbered stops, individual drive times, and total time.
2. Open entries not assigned when present (entry not assigned for one entry). Review Manual arrangement, Postal code not found, and No postal code. Details open automatically when no cabs are assigned.
3. Correct missing or unrecognized postal codes in the list and group again. Arrange parties above four manually; do not change their code to force assignment.
4. Open Maps usage and grouping limits to see postal-code lookups and drive-time checks this run.

Result and recovery: Every passenger must be accounted for in a cab or an exception you will resolve manually. Each cab allows four people and three home stops. Two stops allow 12 minutes total; three allow 18 minutes total. Venue travel is excluded. Rounded minute labels are for display; limits use seconds. Nearby search does not guarantee the fewest cabs.

## Inspect routes and copy assignments

Task ID / HTML anchor: `share-assignments`.

Before you start: Review current results and resolve or account for exceptions.

1. Use Route on a multi-stop cab to open ordered stops in Google Maps. Use a stop address link to inspect that location. Links open a new tab and share postal codes with Google; they do not book transport.
2. Return to the planner and select Copy for WhatsApp.
3. Check that the button says Copied. Paste into a draft and inspect names, all stops, and the Not assigned section before sending. The planner does not send messages.

Result and recovery: If copying fails, allow clipboard access or select and copy assignments manually. Preserve exceptions when sharing. Route loading inside Google Maps and WhatsApp message delivery are outside this prototype’s verification.

## Change a list or retry a failed run

Task ID / HTML anchor: `retry-grouping`.

Before you start: Retain the staff list until planning is complete. There is no saved history.

1. After editing a grouped list, check for The list has changed since this grouping.
2. Select Group again and wait for updated results before copying. Earlier results may remain visible after edits.
3. If grouping displays an error, keep the list and read the message. For Google failures, ask the maintainer to check quota and connection, then select Group into cabs again. For too many codes, reduce the run to at most 100 distinct postal codes; splitting runs may increase cab count.
4. For a missing API-key message, ask the maintainer to configure the server. Never paste keys into the staff list.

Result and recovery: Updated assignments replace earlier results and clear the changed-list notice. A failed run does not assign passengers. Do not repeatedly retry provider errors without checking the cause; requests may consume allowance.

## Limitations and help

- No cab booking, message sending, saved history, hosted release, or verified public-access controls.
- Live Google responses, account quotas, provider terms, and real-event acceptance remain unverified. Usage counters do not guarantee free use.

Support contact and availability: to be confirmed with the project owner. Report the task, time, and exact error; omit staff lists, credentials, and sensitive information.
