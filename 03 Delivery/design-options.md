# Interface options — 20 October 2026

Three read-only concepts use identical synthetic assignments: seven assigned staff, three cabs, and one missing postal code. The existing planner and current two-stop 12-minute / three-stop 18-minute total rules are unchanged.

| Option | Layout | Best fit |
| --- | --- | --- |
| A — Warm workspace | Staff input beside full-width cab routes; stacked on phones | Editing and reviewing together |
| B — Cab board | Cab columns on laptops; stacked on phones; collapsible input | Comparing groups at a glance |
| C — Transport list | Compact expandable cab rows; input below | Fast scanning and phone use |

Run `npm run dev -- --hostname 127.0.0.1 --port 3011` from the repository root, then open `http://127.0.0.1:3011/prototype/design?variant=A`. Use the bottom arrows or keyboard Left/Right to compare A/B/C. Input, generation and copy controls are deliberately read-only; disclosures work. The route returns 404 in production. No Google calls or new dependencies are involved.

Screenshots: [A laptop](design-previews/A-desktop.png), [A phone](design-previews/A-phone.png), [B laptop](design-previews/B-desktop.png), [B phone](design-previews/B-phone.png), [C laptop](design-previews/C-desktop.png), [C phone](design-previews/C-phone.png).

Browser checks passed for all variants at 320, 390 and 1440 pixels, with no horizontal overflow or page errors. Click and keyboard switching wrap correctly. No grouping API requests occurred. These are visual prototypes, not a production implementation; the user selected A (conversation: “A”). Nothing has been uploaded.

## A selected and applied

The user selected A on 20 October 2026. The working `/` page now uses the warm workspace: compact staff input beside spacious cab routes on laptops, stacked on phones, with the existing light/dark palettes. Real grouping, warnings, Maps links and WhatsApp copying remain connected. Grouping logic and API quota guards were not changed in this visual refinement. Browser checks passed at 320/390/768/1440 pixels in light and dark mode, covering empty/loading/error/manual-only/missing-only states, long content, keyboard disclosures, links and copy. All 11 tests and production build passed. Google responses were mocked; no upload or deployment.
