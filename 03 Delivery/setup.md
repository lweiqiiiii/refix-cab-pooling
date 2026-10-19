# Run the existing prototype

Application source remains at the repository root, not inside this stage folder. Keep `app/`, `lib/`, `public/` if present, `package.json`, and the lockfile with the project. Use a Node version supported by the installed Next.js 16 release.

1. From the repository root, install dependencies with `npm install` when needed. Dependencies were already installed for this delivery; no dependency was added.
2. Configure `GOOGLE_MAPS_API_KEY` in the existing ignored `.env.local` for server-side Google Geocoding and Routes access. Do not put the key in browser code, commits, or this document. Existing secret values were not inspected or changed.
3. Run `npm run dev` and open the URL printed by Next.js. The verified local browser command used port 3011 and localhost: `npm run dev -- --hostname 127.0.0.1 --port 3011`.
4. Run `npm test` for mocked automated checks or `npm run build` for production compilation. These do not make live Google requests.

Real grouping may consume Google API allowance. Existing external Google quota settings remain the cost-control authority and must be checked by the account owner before live use. The app retains its 100-code/eight-neighbour bounds and displays fresh lookup/route-element usage. Those guards do not replace an account quota or guarantee free use.

Caches are local to the server process, bounded to 1,000 entries each, with geocodes expiring after 24 hours and drive times after five minutes. Restarting/cold starts can require fresh provider calls. There is no new database or staff history. Confirm provider retention terms and deployment access before a pilot.
