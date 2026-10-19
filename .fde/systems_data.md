# Systems & Data

## Systems
| System | Purpose | Owner | Source of Truth For | Interface | Constraints |
|---|---|---|---|---|---|

## Data
| Dataset | Meaning | Source | Owner | Identifier | Freshness | History | Quality / Sensitivity |
|---|---|---|---|---|---|---|---|

## Verified source context for Discovery D1

- `app/page.js`: names and input remain in browser state; server payload contains postal-code counts plus session-cache entries. Missing-code lines already appear in the issues output.
- `app/api/group/route.js`: Google Geocoding and Routes matrix calls; server configuration uses `GOOGLE_MAPS_API_KEY`. No secret values inspected. Current input guard allows at most 100 unique postal codes and up to 50 passengers per code; these are implementation limits, not agreed new requirements.
- `lib/group.mjs`: pure logic for splitting postal-code counts, candidate pruning, and nearest-first pair selection. Three-stop selection and mandatory-party preservation are not implemented.
- Live credentials, API access, current deployment, production privacy/access, and account ownership are unverified. Staff locations are sensitive; supplied real sample details were not copied into artifacts.
