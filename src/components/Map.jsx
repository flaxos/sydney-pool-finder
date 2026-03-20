import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const SYDNEY_CENTER = [-33.8688, 151.2093]
const DEFAULT_ZOOM = 13

function createMarkerIcon(venue) {
  const isMulti = venue.tables.count > 1
  const className = `venue-marker ${isMulti ? 'venue-marker--multi' : 'venue-marker--single'}`
  return L.divIcon({
    className: '',
    html: `<div class="${className}">${venue.tables.count || '?'}</div>`,
    iconSize: isMulti ? [36, 36] : [32, 32],
    iconAnchor: isMulti ? [18, 18] : [16, 16],
    popupAnchor: [0, -20],
  })
}

export function Map({ venues, onSelectVenue, selectedVenue, userPosition }) {
  return (
    <MapContainer center={SYDNEY_CENTER} zoom={DEFAULT_ZOOM} className="z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userPosition && (
        <CircleMarker
          center={[userPosition.lat, userPosition.lng]}
          radius={10}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.35,
            weight: 2,
          }}
        >
          <Popup>
            <span className="text-sm font-medium">You are here</span>
          </Popup>
        </CircleMarker>
      )}
      {venues.map((venue) => (
        <Marker
          key={venue.id}
          position={[venue.lat, venue.lng]}
          icon={createMarkerIcon(venue)}
          eventHandlers={{
            click: () => onSelectVenue(venue),
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{venue.name}</strong>
              <br />
              {venue.suburb} &middot; {venue.tables.count} table{venue.tables.count !== 1 ? 's' : ''}
              {venue.pricing.standard && (
                <>
                  <br />
                  {venue.pricing.standard}
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {selectedVenue && <FlyToVenue venue={selectedVenue} />}
    </MapContainer>
  )
}

function FlyToVenue({ venue }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([venue.lat, venue.lng], 15, { duration: 0.5 })
  }, [venue, map])
  return null
}
