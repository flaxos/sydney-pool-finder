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
