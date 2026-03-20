import { useState } from 'react'

export function VenueCard({ venue, onClose, onVerify, verification, alreadyVerified }) {
  const [copied, setCopied] = useState(false)
  const [justVerified, setJustVerified] = useState(false)

  if (!venue) return null

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?venue=${venue.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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

      <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="capitalize">{venue.status}</span>
            {verification && verification.count > 0 && (
              <span className="text-green-600">
                Verified by {verification.count} {verification.count === 1 ? 'person' : 'people'}
              </span>
            )}
          </div>
          <button
            onClick={handleCopyLink}
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span>
            {verification?.lastVerified
              ? `Last verified: ${verification.lastVerified}`
              : venue.lastVerified
                ? `Last verified: ${venue.lastVerified}`
                : 'Not yet verified'}
          </span>
          {onVerify && (
            <button
              onClick={() => {
                if (!alreadyVerified) {
                  onVerify(venue.id)
                  setJustVerified(true)
                  setTimeout(() => setJustVerified(false), 1500)
                }
              }}
              disabled={alreadyVerified}
              className={`
                px-3 py-1 rounded-full font-medium text-xs border transition-all duration-200
                ${alreadyVerified
                  ? 'border-green-300 bg-green-50 text-green-500 cursor-default'
                  : justVerified
                    ? 'border-green-500 bg-green-500 text-white scale-105'
                    : 'border-green-500 text-green-600 hover:bg-green-50 active:bg-green-100 cursor-pointer'
                }
              `}
            >
              {alreadyVerified ? (
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Confirmed
                </span>
              ) : justVerified ? (
                'Confirmed!'
              ) : (
                'Still here'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
