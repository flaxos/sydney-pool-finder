import { useMemo, useState, useEffect } from 'react'
import { fetchVenues } from '../services/venueService'
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
  const [allVenues, setAllVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [suburb, setSuburb] = useState('')
  const [tableFilter, setTableFilter] = useState('')
  const [featureFilters, setFeatureFilters] = useState([])
  const [freeTonight, setFreeTonight] = useState(false)
  const [compTonight, setCompTonight] = useState(false)
  const [happyHour, setHappyHour] = useState(false)
  const [brandFilter, setBrandFilter] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchVenues()
        if (!cancelled) {
          setAllVenues(data)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to load venues:', err)
        if (!cancelled) {
          setError(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const suburbs = useMemo(
    () => [...new Set(allVenues.map((v) => v.suburb))].sort(),
    [allVenues]
  )

  const brands = useMemo(
    () =>
      [
        ...new Set(
          allVenues.flatMap((v) =>
            Array.isArray(v.tables?.brands) ? v.tables.brands : []
          )
        ),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [allVenues]
  )

  const filtered = useMemo(() => {
    const results = allVenues.filter(
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
  }, [allVenues, search, suburb, tableFilter, featureFilters, freeTonight, compTonight, happyHour, brandFilter, userPosition])

  return {
    venues: filtered,
    allVenues,
    suburbs,
    brands,
    loading,
    error,
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
