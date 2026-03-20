# Venue Data Schema

Each venue in `venues.json` is an object with the following fields.

## Required Fields

| Field       | Type   | Description                                  |
|-------------|--------|----------------------------------------------|
| `id`        | string | Unique kebab-case slug, e.g. `shark-hotel-surry-hills` |
| `name`      | string | Venue name as displayed on signage           |
| `address`   | string | Full street address                          |
| `suburb`    | string | Sydney suburb name                           |
| `lat`       | number | Latitude (negative for Southern Hemisphere)  |
| `lng`       | number | Longitude                                    |
| `status`    | string | One of: `verified`, `unverified`, `closed`   |
| `source`    | string | One of: `community`, `google-maps-import`    |

## Optional Fields

| Field                  | Type     | Description                                      |
|------------------------|----------|--------------------------------------------------|
| `tables.count`         | number   | Number of pool tables                            |
| `tables.brands`        | string[] | Table brands, e.g. `["Diamond", "Brunswick"]`   |
| `tables.feltColour`    | string   | Primary felt colour                              |
| `tables.feltNotes`     | string   | Free text for unusual felt (e.g. leopard print)  |
| `pricing.standard`     | string   | Normal pricing, e.g. `"$2 per game"`             |
| `pricing.happyHour`    | string   | Happy hour deal description                      |
| `pricing.freeNights`   | string[] | Days with free pool, e.g. `["Tuesday"]`          |
| `pricing.compNights`   | string[] | Days with comp/tournament nights                 |
| `features`             | string[] | Tags from a controlled list (see below)          |
| `lastVerified`         | string   | ISO date of last community verification          |
| `notes`                | string   | Free text — vibes, quirks, warnings              |

## Feature Tags (Controlled List)

Use these exact strings in the `features` array:

- `free pool` — has at least one free pool night
- `happy hour` — discounted pool during certain hours
- `comp night` — regular competition/tournament night
- `coin operated` — tables are coin-op (no counter payment)
- `outdoor area` — beer garden or outdoor section
- `food available` — serves meals (not just bar snacks)
- `late night` — open past midnight
- `beginner friendly` — relaxed atmosphere, not competitive-heavy
- `wheelchair accessible` — accessible venue and table area

## Adding New Venues

1. Generate an `id` as `venue-name-suburb` in kebab-case
2. Get coordinates from Google Maps (right-click → "What's here?")
3. Set `status` to `unverified` unless you've personally visited
4. Set `source` to `community` for manual additions
5. Fill in as many optional fields as you can — partial data is fine
