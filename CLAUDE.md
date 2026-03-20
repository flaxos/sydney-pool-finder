# Sydney Pool Table Finder — CLAUDE.md

## Project Overview

A web app for finding pool tables across Sydney. Inspired by a community-maintained Google My Maps project that manually tracks venues with pool tables. This app aims to make that data searchable, filterable, and crowd-sourceable.

**Owner:** maintainer
**Stack:** React + Vite, Leaflet (OpenStreetMap), TailwindCSS, JSON flat-file data (upgrade path to SQLite/Supabase later)
**Target:** Mobile-first responsive web app, deployable as a static site or PWA

---

## Architecture

```
sydney-pool-finder/
├── CLAUDE.md              # You are here
├── README.md              # Project readme
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx           # App entry point
│   ├── App.jsx            # Root component, router
│   ├── components/
│   │   ├── Map.jsx         # Leaflet map with venue markers
│   │   ├── VenueCard.jsx   # Venue detail card/modal
│   │   ├── VenueList.jsx   # Scrollable filtered venue list
│   │   ├── FilterBar.jsx   # Filter controls (brand, price, features)
│   │   ├── SearchBar.jsx   # Location/name search
│   │   └── Legend.jsx      # Map legend
│   ├── data/
│   │   └── venues.json     # Venue dataset (flat file, seed data)
│   ├── hooks/
│   │   ├── useVenues.js    # Venue loading, filtering, search logic
│   │   └── useGeolocation.js # Browser geolocation for "near me"
│   ├── utils/
│   │   ├── distance.js     # Haversine distance calc
│   │   └── filters.js      # Filter predicate builders
│   └── styles/
│       └── map.css         # Leaflet overrides, custom marker styles
└── data/
    ├── schema.md           # Venue data schema docs
    └── seed-venues.json    # Raw seed data (Google My Maps import, manually converted)
```

---

## Data Model — Venue

Each venue is a JSON object:

```json
{
  "id": "string (kebab-case slug, e.g. 'town-hall-hotel-newtown')",
  "name": "string",
  "address": "string (full street address)",
  "suburb": "string",
  "lat": -33.xxxx,
  "lng": 151.xxxx,
  "tables": {
    "count": 2,
    "brands": ["Diamond", "Brunswick"],
    "feltColour": "green",
    "feltNotes": "leopard print on table 2"
  },
  "pricing": {
    "standard": "$2 per game",
    "happyHour": "$1 pool 4-6pm weekdays",
    "freeNights": ["Tuesday"],
    "compNights": ["Thursday"]
  },
  "features": ["comp night", "free pool", "happy hour", "outdoor area", "food available"],
  "status": "verified | unverified | closed",
  "source": "community | google-maps-import",
  "lastVerified": "2026-03-20",
  "notes": "string (free text, quirks, vibes)"
}
```

---

## Key Features (Priority Order)

### MVP (v0.1)
- [ ] Interactive Leaflet map centred on Sydney
- [ ] Venue markers with popup showing name, table count, suburb
- [ ] Venue list panel (sidebar on desktop, bottom sheet on mobile)
- [ ] Filter by: suburb, number of tables (1 / multiple)
- [ ] Seed data from Google My Maps (manual conversion)
- [ ] Mobile-responsive layout

### v0.2
- [ ] "Near me" geolocation sorting
- [ ] Filter by: free pool nights, happy hour, comp nights
- [ ] Filter by: table brand
- [ ] Venue detail card with full info
- [ ] Search by venue name or suburb
- [ ] Custom map markers (single table vs multiple, colour-coded)

### v0.3 (if it takes off)
- [ ] "Suggest a venue" form (writes to a submissions queue)
- [ ] PWA manifest + service worker for offline/installable
- [ ] Shareable venue links (URL params)
- [ ] "Verify" button for community confirmation
- [ ] Backend migration (Supabase or SQLite via API)

---

## Agent Instructions

### General
- This is a **React + Vite** project. Use functional components with hooks. No class components.
- Use **TailwindCSS** utility classes for all styling. No CSS modules, no styled-components.
- Use **Leaflet** via `react-leaflet` for the map. OpenStreetMap tiles (free, no API key needed).
- Data lives in `src/data/venues.json` for now. All venue access goes through `useVenues` hook so the data source can be swapped later without touching components.
- Mobile-first. Default layout assumes phone viewport. Desktop gets a side panel.

### Code Style
- Australian English in UI copy and comments (e.g. "colour" not "color" in user-facing strings; code variables use US English per JS convention).
- Prefer named exports for components, default export for pages/App.
- Keep components under 150 lines. Extract hooks and utils early.
- No `any` types if we move to TypeScript later — write JS that would type-check.

### Testing
- No test framework yet. But components should be pure enough to test.
- If adding tests later: Vitest + React Testing Library.

### Don't
- Don't use Google Maps API (requires billing, the whole point is FOSS).
- Don't over-engineer auth or a backend. This is a static data app for now.
- Don't add a database until the JSON file exceeds ~500 venues.
- Don't use Next.js or SSR. This is a client-side SPA deployed as static files.

---

## Deployment Notes

- Target: static hosting (GitHub Pages, Cloudflare Pages, or self-hosted via Nginx/Caddy).
- `vite build` should produce a clean `/dist` folder ready to serve.
- No environment variables needed for MVP (no API keys).

---

## Data Seeding

A community-maintained Google My Maps project is the initial data source:
- URL: `https://www.google.com/maps/d/u/0/viewer?mid=189NmdRJKmw4jtRT4cT_ehq-4evUc9q4`
- Legend: Blue marker = one table, 8-ball emoji = multiple tables
- Manual conversion needed — export KML from Google My Maps, parse venue names + coordinates, enrich with table/pricing data over time.

KML export approach:
1. Open the map in Google My Maps editor (or use the KML download link)
2. Parse `<Placemark>` elements for name + coordinates
3. Map to venue schema with `status: "unverified"` and `source: "google-maps-import"`
4. Manually enrich top venues first (table count, brand, pricing)

---

## Context

This originated from a Slack channel where a colleague shared their Google My Maps project tracking every pool table venue in Sydney. Community feedback requested: table brand tracking, happy hour / pricing info, felt colour, comp nights. This app is the "someone who knows how to code" answer to that.
