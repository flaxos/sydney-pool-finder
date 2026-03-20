import { useState, useCallback, useEffect } from 'react'
import {
  fetchVerifications,
  verifyVenue,
  isSessionVerified,
  markSessionVerified,
} from '../services/verificationService'

export function useVerifications() {
  const [verifications, setVerifications] = useState({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      const data = await fetchVerifications()
      if (!cancelled) {
        setVerifications(data)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const getVerification = useCallback(
    (venueId) => verifications[venueId] || null,
    [verifications]
  )

  const isVerifiedByUser = useCallback(
    (venueId) => isSessionVerified(venueId),
    []
  )

  const verify = useCallback(async (venueId) => {
    if (isSessionVerified(venueId)) return

    const result = await verifyVenue(venueId)
    if (result.success) {
      markSessionVerified(venueId)

      // Update local state to reflect the new verification
      setVerifications((prev) => {
        const existing = prev[venueId] || { count: 0, lastVerified: null }
        return {
          ...prev,
          [venueId]: {
            count: existing.count + 1,
            lastVerified: new Date().toISOString().split('T')[0],
          },
        }
      })
    }

    return result
  }, [])

  return { getVerification, verify, isVerifiedByUser }
}
