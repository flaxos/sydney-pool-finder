import { useState, useCallback } from 'react'
import { submitVenue } from '../services/submissionService'

const STORAGE_KEY = 'pool-finder-submissions'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState(readFromStorage)

  const addSubmission = useCallback(async (data) => {
    const result = await submitVenue(data)
    // Re-read from storage to stay in sync (submitVenue writes to localStorage in fallback mode)
    setSubmissions(readFromStorage())
    return result
  }, [])

  const clearSubmissions = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    setSubmissions([])
  }, [])

  return { submissions, addSubmission, clearSubmissions }
}
