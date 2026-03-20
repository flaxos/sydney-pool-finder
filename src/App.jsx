import { useState } from 'react'
import { Map } from './components/Map'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { VenueList } from './components/VenueList'
import { VenueCard } from './components/VenueCard'
import { Legend } from './components/Legend'
import { useVenues } from './hooks/useVenues'

function App() {
  const {
    venues,
    suburbs,
    search,
    setSearch,
    suburb,
    setSuburb,
    tableFilter,
    setTableFilter,
    featureFilters,
    setFeatureFilters,
  } = useVenues()

  const [selectedVenue, setSelectedVenue] = useState(null)
  const [panelOpen, setPanelOpen] = useState(true)

  const handleSelectVenue = (venue) => {
    setSelectedVenue(venue)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Map */}
      <div className="relative flex-1 min-h-[40vh] lg:min-h-0">
        <Map
          venues={venues}
          onSelectVenue={handleSelectVenue}
          selectedVenue={selectedVenue}
        />
        <Legend />

        {/* Mobile toggle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="lg:hidden absolute top-3 right-3 z-[1000] bg-white shadow-md rounded-lg px-3 py-1.5 text-sm font-medium"
        >
          {panelOpen ? 'Hide List' : `Show List (${venues.length})`}
        </button>
      </div>

      {/* Side panel */}
      <div
        className={`${
          panelOpen ? 'flex' : 'hidden'
        } lg:flex flex-col w-full lg:w-96 bg-white border-l border-gray-200 overflow-hidden`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h1 className="text-base font-bold text-gray-900">
            Sydney Pool Table Finder
          </h1>
          <p className="text-xs text-gray-500">
            {venues.length} venue{venues.length !== 1 ? 's' : ''}
          </p>
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
        />

        {/* Venue detail or list */}
        <div className="flex-1 overflow-y-auto">
          {selectedVenue ? (
            <VenueCard
              venue={selectedVenue}
              onClose={() => setSelectedVenue(null)}
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
    </div>
  )
}

export default App
