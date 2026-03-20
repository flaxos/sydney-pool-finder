import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'pool-finder-submissions'

// Submit a venue suggestion
export async function submitVenue(data) {
  if (!supabase) {
    // localStorage fallback
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const updated = [...existing, { ...data, created_at: new Date().toISOString() }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return { success: true, source: 'local' }
  }

  const { error } = await supabase.from('submissions').insert({
    venue_name: data.name,
    address: data.address || '',
    suburb: data.suburb || '',
    tables_count: data.tablesCount || 1,
    pricing: data.pricing || '',
    notes: data.notes || '',
  })

  if (error) {
    console.error('Supabase submission failed, saving locally:', error)
    // Fall back to localStorage
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, { ...data, created_at: new Date().toISOString() }]))
    return { success: true, source: 'local' }
  }

  return { success: true, source: 'supabase' }
}
