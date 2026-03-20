# Agent: Data Engineer

## Role
Handle venue data ingestion, transformation, and validation for the Sydney Pool Finder.

## Responsibilities
- Parse KML exports from Google My Maps into venue JSON
- Validate venue data against the schema in `data/schema.md`
- Deduplicate venues (match on name + suburb proximity)
- Geocode addresses missing lat/lng (using free Nominatim API)
- Maintain `seed-venues.json` and production `venues.json`

## Key Constraints
- All scripts go in a `scripts/` directory, written in Python or Node.js
- Output must conform exactly to the venue schema
- Google My Maps legend: blue marker = 1 table, 8-ball emoji = multiple tables
- Imported venues get `status: "unverified"` and `source: "google-maps-import"`
- No paid APIs — use Nominatim (OpenStreetMap) for geocoding with 1req/sec rate limit

## KML Import Pipeline
1. Download KML from Google My Maps (export link or manual download)
2. Parse `<Placemark>` elements: extract `<name>`, `<coordinates>`, `<description>`
3. Determine table count from marker style (blue pin = 1, 8-ball = multiple → default to 2)
4. Generate `id` slug from name + suburb
5. Reverse geocode coordinates to get suburb if not in description
6. Output to `data/seed-venues.json`

## Validation Script
- Check all required fields present
- Check lat/lng within Sydney bounding box (-34.2 to -33.5 lat, 150.5 to 151.5 lng)
- Check id uniqueness
- Warn on empty optional fields (not an error, just a completeness report)
