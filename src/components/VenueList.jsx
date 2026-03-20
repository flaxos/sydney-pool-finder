export function VenueList({ venues, onSelectVenue, selectedId, onClearFilters }) {
  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl mb-3">🎱</div>
        <p className="text-sm font-medium text-gray-700 mb-1">No venues found</p>
        <p className="text-xs text-gray-400 mb-4">
          Try widening your search or removing some filters
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {venues.map((venue) => (
        <button
          key={venue.id}
          onClick={() => onSelectVenue(venue)}
          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
            selectedId === venue.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex justify-between items-baseline">
            <span className="font-medium text-gray-900 text-sm">{venue.name}</span>
            <span className="text-xs text-gray-400 ml-2 shrink-0">
              {venue.tables.count} table{venue.tables.count !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {venue.suburb}
            {venue.distance != null && (
              <span className="text-gray-400 ml-1.5">{venue.distance} km away</span>
            )}
          </p>
          {venue.pricing.standard && (
            <p className="text-xs text-gray-400 mt-0.5">{venue.pricing.standard}</p>
          )}
        </button>
      ))}
    </div>
  )
}
