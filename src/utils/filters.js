export function matchesSuburb(venue, suburb) {
  if (!suburb) return true
  return venue.suburb.toLowerCase() === suburb.toLowerCase()
}

export function matchesTableCount(venue, filter) {
  if (!filter) return true
  if (filter === 'single') return venue.tables.count === 1
  if (filter === 'multiple') return venue.tables.count > 1
  return true
}

export function matchesFeatures(venue, features) {
  if (!features || features.length === 0) return true
  return features.every((f) => venue.features.includes(f))
}

export function matchesSearch(venue, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    venue.name.toLowerCase().includes(q) ||
    venue.suburb.toLowerCase().includes(q) ||
    venue.address.toLowerCase().includes(q)
  )
}

function getTodayName() {
  return new Date().toLocaleDateString('en-AU', { weekday: 'long' })
}

export function matchesFreeTonight(venue) {
  const today = getTodayName()
  return (
    Array.isArray(venue.pricing?.freeNights) &&
    venue.pricing.freeNights.some((d) => d.toLowerCase() === today.toLowerCase())
  )
}

export function matchesCompTonight(venue) {
  const today = getTodayName()
  return (
    Array.isArray(venue.pricing?.compNights) &&
    venue.pricing.compNights.some((d) => d.toLowerCase() === today.toLowerCase())
  )
}

export function matchesHasHappyHour(venue) {
  return Boolean(venue.pricing?.happyHour)
}

export function matchesBrand(venue, brand) {
  if (!brand) return true
  return (
    Array.isArray(venue.tables?.brands) &&
    venue.tables.brands.some((b) => b.toLowerCase() === brand.toLowerCase())
  )
}
