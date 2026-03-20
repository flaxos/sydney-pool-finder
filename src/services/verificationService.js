import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'pool-finder-verifications'
const SESSION_KEY = 'pool-finder-verified-this-session'

// Get a unique-ish session ID for spam prevention
function getSessionId() {
  let id = sessionStorage.getItem('pool-finder-session-id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('pool-finder-session-id', id)
  }
  return id
}

// Fetch verification counts for all venues
export async function fetchVerifications() {
  if (!supabase) {
    // localStorage fallback
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch { return {} }
  }

  // Aggregate counts from Supabase
  const { data, error } = await supabase
    .from('verifications')
    .select('venue_id, verified_at')

  if (error) {
    console.error('Failed to fetch verifications:', error)
    return {}
  }

  // Group by venue_id
  const grouped = {}
  for (const row of data) {
    if (!grouped[row.venue_id]) {
      grouped[row.venue_id] = { count: 0, lastVerified: row.verified_at }
    }
    grouped[row.venue_id].count++
    if (row.verified_at > grouped[row.venue_id].lastVerified) {
      grouped[row.venue_id].lastVerified = row.verified_at
    }
  }
  return grouped
}

// Submit a verification
export async function verifyVenue(venueId) {
  const sessionId = getSessionId()

  if (!supabase) {
    // localStorage fallback
    const verifications = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const existing = verifications[venueId] || { count: 0, lastVerified: null }
    verifications[venueId] = {
      count: existing.count + 1,
      lastVerified: new Date().toISOString().split('T')[0],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verifications))
    return { success: true }
  }

  const { error } = await supabase.from('verifications').insert({
    venue_id: venueId,
    session_id: sessionId,
  })

  if (error) {
    console.error('Verification failed:', error)
    return { success: false }
  }

  return { success: true }
}

// Check if current session already verified this venue
export function isSessionVerified(venueId) {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const set = raw ? new Set(JSON.parse(raw)) : new Set()
    return set.has(venueId)
  } catch { return false }
}

// Mark a venue as verified in this session
export function markSessionVerified(venueId) {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const set = raw ? new Set(JSON.parse(raw)) : new Set()
    set.add(venueId)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]))
  } catch { /* ignore */ }
}
