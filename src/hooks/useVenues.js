import { useMemo, useState } from 'react'
import venueData from '../data/venues.json'
import {
  matchesSuburb,
  matchesTableCount,
  matchesFeatures,
  matchesSearch,
  matchesFreeTonight,
  matchesCompTonight,
  matchesHasHappyHour,
  matchesBrand,
} from '../utils/filters'
import { haversine } from '../utils/distance'

export function useVenues(userPosition) {
  const [search, setSearch] = useState('')
  const [suburb, setSuburb] = useState('')
  const [tableFilter, setTableFilter] = useState('')
  const [featureFilters, setFeatureFilters] = useState([])
  const [freeTonight, setFreeTonight] = useState(false)
  const [compTonight, setCompTonight] = useState(false)
  const [happyHour, setHappyHour] = useState(false)
  const [brandFilter, setBrandFilter] = useState('')

  const suburbs = useMemo(
    () => [...new Set(venueData.map((v) => v.suburb))].sort(),
    []
  )

  const brands = useMemo(
    () =>
      [
        ...new Set(
          venueData.flatMap((v) =>
            Array.isArray(v.tables?.brands) ? v.tables.brands : []
          )
        ),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    []
  )

  const filtered = useMemo(() => {
    const results = venueData.filter(
      (v) =>
        matchesSearch(v, search) &&
        matchesSuburb(v, suburb) &&
        matchesTableCount(v, tableFilter) &&
        matchesFeatures(v, featureFilters) &&
        (!freeTonight || matchesFreeTonight(v)) &&
        (!compTonight || matchesCompTonight(v)) &&
        (!happyHour || matchesHasHappyHour(v)) &&
        matchesBrand(v, brandFilter)
    )

    if (!userPosition) return results

    const withDistance = results.map((v) => ({
      ...v,
      distance: Math.round(
        haversine(userPosition.lat, userPosition.lng, v.lat, v.lng) * 10
      ) / 10,
    }))

    withDistance.sort((a, b) => a.distance - b.distance)
    return withDistance
  }, [search, suburb, tableFilter, featureFilters, freeTonight, compTonight, happyHour, brandFilter, userPosition])

  return {
    venues: filtered,
    allVenues: venueData,
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
  }
}
