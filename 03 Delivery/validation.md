# Prototype validation — A2

Evidence date: 2026-10-19. All staff/location fixtures are synthetic; no provided real staff list is stored here.

## Automated checks

From the repository root:

```sh
npm test
npm run build
node '02 Design/feasibility-check.mjs'
```

- Ten Node tests pass across the pure grouping interface and `POST /api/group` with mocked provider responses.
- Tests cover whole-party/manual classification (including counts above the old 50-person input guard, which now safely require manual arrangement without provider work), directed nearby work bound, four people/three locations/two 8-minute legs, cab-count counterexamples, 600/601-second boundary, invalid directed durations, person conservation, cached reruns, malformed request data, 100-code guard, and missing matrix results.
- Production build passes with `/` and `/api/group` generated. Next.js warns about a parent-directory package-lock outside this repo; the build succeeds and that unrelated parent file was not changed.
- Design spike remains runnable, now checking the new selector on the old nearest-pair counterexample. Its exhaustive oracle is limited to 16 synthetic locations and is not application code.
- `git diff --check` passes.
- Independent review found no material issues and matched the selector to an independent exact solver on 1,000 seeded eight-stop graphs for cab count, total seconds, and assignment conservation. This is small-case evidence, not a global-optimum guarantee under bounded search.

## Mocked browser evidence

The installed Playwright/headless Chromium was used against `npm run dev -- --hostname 127.0.0.1 --port 3011`. The page's grouping endpoint was intercepted; all Google data was synthetic. Checked at 1440×1000 and 390×844:

1. Missing-code entry visible before any grouping request.
2. Four assigned passengers at three ordered stops; five manual and one unresolved passenger excluded from the assigned count.
3. Distinct 8-minute and 6-minute leg labels; middle waypoint and final destination present in the map URL.
4. Clipboard includes all stops and every manual/unresolved/missing-code row.
5. No page errors or horizontal overflow. Screenshots visually inspected; layout preserved.

Browser tooling was already cached outside the repo; no project dependency was added. Screenshots and the local browser driver were temporary validation artifacts, not product dependencies.

## Work-bound experiment

A deterministic 100-postal-code synthetic case generated 800 directed candidate elements, returned 34 cabs, conserved all 100 parties exactly once, and respected all stop/capacity/leg limits. Selection took about 53 ms locally. This is one finite workload check, not an SLA, a Google latency estimate, or proof that all inputs complete in that time.

## Not verified

Live Google routing/geocoding, actual account quota and free-tier enforcement, real event acceptance, public access controls, cloud deployment, and current provider retention terms. No paid API calls were used. Nearby selection and bounded optimization deliberately do not guarantee global minimal cab count or globally shortest travel.
