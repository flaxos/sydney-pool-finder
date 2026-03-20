import { useState, useCallback, useRef } from 'react'

const STORAGE_KEY = 'pool-finder-verifications'
const SESSION_KEY = 'pool-finder-verified-this-session'

function loadVerifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function loadSessionVerified() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function useVerifications() {
  const [verifications, setVerifications] = useState(loadVerifications)
  const sessionVerifiedRef = useRef(loadSessionVerified())

  const getVerification = useCallback(
    (venueId) => verifications[venueId] || null,
    [verifications]
  )

  const isVerifiedByUser = useCallback(
    (venueId) => sessionVerifiedRef.current.has(venueId),
    []
  )

  const verify = useCallback((venueId) => {
    if (sessionVerifiedRef.current.has(venueId)) return

    const today = new Date().toISOString().split('T')[0]

    setVerifications((prev) => {
      const existing = prev[venueId] || { count: 0, lastVerified: null }
      const next = {
        ...prev,
        [venueId]: {
          count: existing.count + 1,
          lastVerified: today,
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })

    sessionVerifiedRef.current.add(venueId)
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify([...sessionVerifiedRef.current])
    )
  }, [])

  return { getVerification, verify, isVerifiedByUser }
}
