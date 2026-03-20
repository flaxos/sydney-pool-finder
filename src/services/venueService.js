import { supabase } from '../lib/supabase'
import venueDataFallback from '../data/venues.json'

// Map flat DB row to nested venue object (matching the JSON schema)
function rowToVenue(row) {
  const {
    tables_count,
    tables_brands,
    tables_felt_colour,
    tables_felt_notes,
    pricing_standard,
    pricing_happy_hour,
    pricing_free_nights,
    pricing_comp_nights,
    last_verified,
    ...rest
  } = row

  return {
    ...rest,
    tables: {
      count: tables_count ?? null,
      brands: tables_brands ?? [],
      feltColour: tables_felt_colour ?? null,
      feltNotes: tables_felt_notes ?? null,
    },
    pricing: {
      standard: pricing_standard ?? null,
      happyHour: pricing_happy_hour ?? null,
      freeNights: pricing_free_nights ?? [],
      compNights: pricing_comp_nights ?? [],
    },
    lastVerified: last_verified ?? null,
  }
}

// Fetch all venues — Supabase if configured, JSON fallback otherwise
export async function fetchVenues() {
  if (!supabase) return venueDataFallback

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('name')

  if (error) {
    console.error('Failed to fetch venues from Supabase, using fallback:', error)
    return venueDataFallback
  }

  return data.map(rowToVenue)
}
