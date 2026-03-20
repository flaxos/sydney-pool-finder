#!/usr/bin/env node

// Reads src/data/venues.json and generates SQL INSERT statements
// for the Supabase venues table.
//
// Usage: node data/seed-to-supabase.js > data/seed-insert.sql

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const venuesPath = resolve(__dirname, '..', 'src', 'data', 'venues.json')
const venues = JSON.parse(readFileSync(venuesPath, 'utf-8'))

/** Escape a string for use in a SQL single-quoted literal. */
function esc(value) {
  if (value == null) return "''"
  return "'" + String(value).replace(/'/g, "''") + "'"
}

/** Format a JS array as a Postgres text[] literal. */
function pgArray(arr) {
  if (!arr || arr.length === 0) return "'{}'::text[]"
  const items = arr.map((v) => '"' + String(v).replace(/"/g, '\\"') + '"').join(',')
  return "'{" + items + "}'::text[]"
}

/** Format a date string or null for a SQL date column. */
function pgDate(value) {
  if (!value) return 'null'
  return esc(value)
}

console.log('-- Auto-generated seed data from src/data/venues.json')
console.log('-- Generated at: ' + new Date().toISOString())
console.log()

for (const v of venues) {
  const columns = [
    'id',
    'name',
    'address',
    'suburb',
    'lat',
    'lng',
    'tables_count',
    'tables_brands',
    'tables_felt_colour',
    'tables_felt_notes',
    'pricing_standard',
    'pricing_happy_hour',
    'pricing_free_nights',
    'pricing_comp_nights',
    'features',
    'status',
    'source',
    'last_verified',
    'notes',
  ]

  const values = [
    esc(v.id),
    esc(v.name),
    esc(v.address),
    esc(v.suburb),
    v.lat,
    v.lng,
    v.tables?.count ?? 1,
    pgArray(v.tables?.brands),
    esc(v.tables?.feltColour ?? ''),
    esc(v.tables?.feltNotes ?? ''),
    esc(v.pricing?.standard ?? ''),
    esc(v.pricing?.happyHour ?? ''),
    pgArray(v.pricing?.freeNights),
    pgArray(v.pricing?.compNights),
    pgArray(v.features),
    esc(v.status ?? 'unverified'),
    esc(v.source ?? 'community'),
    pgDate(v.lastVerified),
    esc(v.notes ?? ''),
  ]

  console.log(
    `INSERT INTO venues (${columns.join(', ')}) VALUES\n  (${values.join(', ')})\n  ON CONFLICT (id) DO NOTHING;\n`
  )
}
