export function VenueCard({ venue, onClose }) {
  if (!venue) return null

  return (
    <div className="bg-white rounded-t-2xl lg:rounded-2xl shadow-xl p-5 max-h-[60vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-bold text-gray-900">{venue.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-3">{venue.address}</p>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="font-medium text-gray-700">Tables:</span>{' '}
          {venue.tables.count}
          {venue.tables.brands.length > 0 && (
            <span className="text-gray-500"> ({venue.tables.brands.join(', ')})</span>
          )}
        </div>
        {venue.tables.feltColour && (
          <div>
            <span className="font-medium text-gray-700">Felt:</span>{' '}
            {venue.tables.feltColour}
          </div>
        )}
        {venue.pricing.standard && (
          <div>
            <span className="font-medium text-gray-700">Price:</span>{' '}
            {venue.pricing.standard}
          </div>
        )}
        {venue.pricing.happyHour && (
          <div>
            <span className="font-medium text-gray-700">Happy hour:</span>{' '}
            {venue.pricing.happyHour}
          </div>
        )}
      </div>

      {venue.pricing.freeNights.length > 0 && (
        <p className="text-sm text-green-700 mb-2">
          Free pool: {venue.pricing.freeNights.join(', ')}
        </p>
      )}

      {venue.pricing.compNights.length > 0 && (
        <p className="text-sm text-blue-700 mb-2">
          Comp nights: {venue.pricing.compNights.join(', ')}
        </p>
      )}

      {venue.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {venue.features.map((f) => (
            <span
              key={f}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {venue.notes && (
        <p className="text-sm text-gray-500 italic">{venue.notes}</p>
      )}

      {venue.tables.feltNotes && (
        <p className="text-xs text-gray-400 mt-2">{venue.tables.feltNotes}</p>
      )}

      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-400">
        <span className="capitalize">{venue.status}</span>
        {venue.lastVerified && <span>Verified: {venue.lastVerified}</span>}
      </div>
    </div>
  )
}
