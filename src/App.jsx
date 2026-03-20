import { useState, useEffect } from 'react'
import { Map } from './components/Map'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { VenueList } from './components/VenueList'
import { VenueCard } from './components/VenueCard'
import { Legend } from './components/Legend'
import { SuggestVenueForm } from './components/SuggestVenueForm'
import { useVenues } from './hooks/useVenues'
import { useGeolocation } from './hooks/useGeolocation'
import { useVerifications } from './hooks/useVerifications'

function App() {
  const { position, error: geoError, loading: geoLoading, locate } = useGeolocation()
  const { getVerification, verify, isVerifiedByUser } = useVerifications()
  const [nearMeActive, setNearMeActive] = useState(false)

  const {
    venues,
    suburbs,
    brands,
    search,
    setSearch,
    suburb,
    setSuburb,
    tableFilter,
    setTableFilter,
    featureFilters,
    setFeatureFilters,
    freeTonight,
    setFreeTonight,
    compTonight,
    setCompTonight,
    happyHour,
    setHappyHour,
    brandFilter,
    setBrandFilter,
    allVenues,
  } = useVenues(nearMeActive ? position : null)

  const handleNearMe = () => {
    setNearMeActive(true)
    locate()
  }

  const handleClearNearMe = () => {
    setNearMeActive(false)
  }

  // Check URL for a venue param on mount to set initial state
  const initialVenue = () => {
    const params = new URLSearchParams(window.location.search)
    const venueId = params.get('venue')
    if (venueId) {
      return allVenues.find((v) => v.id === venueId) || null
    }
    return null
  }

  const [selectedVenue, setSelectedVenue] = useState(initialVenue)
  const [panelOpen, setPanelOpen] = useState(true)
  const [showSuggestForm, setShowSuggestForm] = useState(false)

  // Sync selectedVenue to URL
  useEffect(() => {
    const url = new URL(window.location)
    if (selectedVenue) {
      url.searchParams.set('venue', selectedVenue.id)
    } else {
      url.searchParams.delete('venue')
    }
    window.history.replaceState({}, '', url)
  }, [selectedVenue])

  const handleSelectVenue = (venue) => {
    setSelectedVenue(venue)
  }

  return (
    <div className="relative h-full lg:flex lg:flex-row">
      {/* Map — full viewport on mobile, flex-1 on desktop */}
      <div className="absolute inset-0 lg:relative lg:flex-1">
        <Map
          venues={venues}
          onSelectVenue={handleSelectVenue}
          selectedVenue={selectedVenue}
          userPosition={nearMeActive ? position : null}
        />
        <Legend />
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-[1000]
          transition-transform duration-300 ease-in-out
          ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}
          h-[50vh] flex flex-col
          bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)]
          lg:relative lg:translate-y-0 lg:h-full lg:w-96 lg:rounded-none
          lg:shadow-none lg:border-l lg:border-gray-200
        `}
      >
        {/* Drag handle — mobile only */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="lg:hidden flex flex-col items-center py-2 cursor-pointer"
          aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'}
        >
          <div className="w-10 h-1 rounded-full bg-gray-300" />
          <span className="text-xs text-gray-500 mt-1">
            {panelOpen ? 'Tap to collapse' : `${venues.length} venues — tap to expand`}
          </span>
        </button>

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">
                Sydney Pool Table Finder
              </h1>
              <p className="text-xs text-gray-500">
                {venues.length} venue{venues.length !== 1 ? 's' : ''}
                {nearMeActive && position && ' — sorted by distance'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {nearMeActive && position && (
                <button
                  onClick={handleClearNearMe}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleNearMe}
                disabled={geoLoading}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  nearMeActive && position
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                } disabled:opacity-50`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {geoLoading ? 'Locating...' : 'Near me'}
              </button>
            </div>
          </div>
          {geoError && nearMeActive && (
            <p className="text-xs text-red-500 mt-1">
              Could not get your location: {geoError}
            </p>
          )}
          <button
            onClick={() => setShowSuggestForm(true)}
            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
          >
            Suggest a venue
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <FilterBar
          suburbs={suburbs}
          suburb={suburb}
          onSuburbChange={setSuburb}
          tableFilter={tableFilter}
          onTableFilterChange={setTableFilter}
          featureFilters={featureFilters}
          onFeatureFiltersChange={setFeatureFilters}
          freeTonight={freeTonight}
          onFreeTonightChange={setFreeTonight}
          compTonight={compTonight}
          onCompTonightChange={setCompTonight}
          happyHour={happyHour}
          onHappyHourChange={setHappyHour}
          brandFilter={brandFilter}
          onBrandFilterChange={setBrandFilter}
          brands={brands}
        />

        {/* Venue detail or list */}
        <div className="flex-1 overflow-y-auto">
          {selectedVenue ? (
            <VenueCard
              venue={selectedVenue}
              onClose={() => setSelectedVenue(null)}
              onVerify={verify}
              verification={getVerification(selectedVenue.id)}
              alreadyVerified={isVerifiedByUser(selectedVenue.id)}
            />
          ) : (
            <VenueList
              venues={venues}
              onSelectVenue={handleSelectVenue}
              selectedId={selectedVenue?.id}
            />
          )}
        </div>
      </div>

      {showSuggestForm && (
        <SuggestVenueForm onClose={() => setShowSuggestForm(false)} />
      )}
    </div>
  )
}

export default App
