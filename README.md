# 🎱 Sydney Pool Table Finder

Find pool tables across Sydney. Filter by suburb, table count, brand, pricing, and vibe.

Built as a community tool — inspired by [Steve Savona's Google My Maps project](https://www.google.com/maps/d/u/0/viewer?mid=189NmdRJKmw4jtRT4cT_ehq-4evUc9q4) tracking every venue in Sydney with a pool table.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Stack

- **React + Vite** — fast dev, static build
- **Leaflet / react-leaflet** — free map tiles via OpenStreetMap
- **TailwindCSS** — utility-first styling
- **JSON flat file** — venue data, no backend needed yet

## Features

- Interactive map of Sydney pool table venues
- Filter by suburb, table count, brand, pricing, special nights
- "Near me" geolocation sorting
- Mobile-first responsive design
- Community-sourced venue data

## Data

Venue data lives in `src/data/venues.json`. See `data/schema.md` for the full field spec.

To contribute venue data, edit `venues.json` directly or (eventually) use the in-app suggestion form.

## Build & Deploy

```bash
npm run build    # outputs to /dist
npm run preview  # preview production build locally
```

Deploy `/dist` to any static host (GitHub Pages, Cloudflare Pages, Nginx, Caddy).

## Licence

MIT
