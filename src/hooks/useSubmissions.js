import { useState, useCallback } from 'react'

const STORAGE_KEY = 'pool-finder-submissions'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(submissions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState(readFromStorage)

  const addSubmission = useCallback((data) => {
    const updated = [...readFromStorage(), data]
    writeToStorage(updated)
    setSubmissions(updated)
  }, [])

  const clearSubmissions = useCallback(() => {
    writeToStorage([])
    setSubmissions([])
  }, [])

  return { submissions, addSubmission, clearSubmissions }
}
