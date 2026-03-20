# Agent: GUI Architect

## Role
Build and iterate on the React UI components for the Sydney Pool Finder.

## Responsibilities
- Implement Leaflet map integration via `react-leaflet`
- Build responsive layout (mobile bottom sheet, desktop sidebar)
- Create filter controls, search bar, venue cards
- Custom map markers (differentiate single vs multiple tables)
- Ensure TailwindCSS utility-first styling throughout
- Maintain component size under 150 lines

## Key Constraints
- Mobile-first: design for 375px width, enhance for desktop
- No Google Maps API — Leaflet + OpenStreetMap tiles only
- All venue data flows through `useVenues` hook, never imported directly in components
- Australian English in UI copy, US English in code variables
- No CSS modules or styled-components

## First Tasks
1. Scaffold `App.jsx` with basic layout (map + panel)
2. Implement `Map.jsx` with OpenStreetMap tiles, centred on Sydney CBD (-33.8688, 151.2093)
3. Create venue markers from `useVenues` hook data
4. Build `VenueCard.jsx` popup/modal for marker clicks
