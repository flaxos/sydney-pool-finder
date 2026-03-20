import { useMemo, useState } from 'react'
import venueData from '../data/venues.json'
import { matchesSuburb, matchesTableCount, matchesFeatures, matchesSearch } from '../utils/filters'

export function useVenues() {
  const [search, setSearch] = useState('')
  const [suburb, setSuburb] = useState('')
  const [tableFilter, setTableFilter] = useState('')
  const [featureFilters, setFeatureFilters] = useState([])

  const suburbs = useMemo(
    () => [...new Set(venueData.map((v) => v.suburb))].sort(),
    []
  )

  const filtered = useMemo(() => {
    return venueData.filter(
      (v) =>
        matchesSearch(v, search) &&
        matchesSuburb(v, suburb) &&
        matchesTableCount(v, tableFilter) &&
        matchesFeatures(v, featureFilters)
    )
  }, [search, suburb, tableFilter, featureFilters])

  return {
    venues: filtered,
    allVenues: venueData,
    suburbs,
    search,
    setSearch,
    suburb,
    setSuburb,
    tableFilter,
    setTableFilter,
    featureFilters,
    setFeatureFilters,
  }
}
