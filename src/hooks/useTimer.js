/**
 * useTimer.js — Per-guess countdown timer for Time Attack mode.
 *
 * Counts down from `timeLimit` seconds. Calls `onExpire` when it hits 0.
 * Resets whenever `resetKey` changes (we pass the attemptNumber as the key).
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer({ timeLimit, resetKey, onExpire, active }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const intervalRef = useRef(null)
  const expiredRef = useRef(false)

  // Reset when the row changes (resetKey = attemptNumber)
  useEffect(() => {
    setTimeRemaining(timeLimit)
    expiredRef.current = false
  }, [resetKey, timeLimit])

  // Run countdown when active and timeLimit > 0
  useEffect(() => {
    if (!active || !timeLimit) return

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpire()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [active, timeLimit, resetKey, onExpire])

  const getTimeRemaining = useCallback(() => timeRemaining, [timeRemaining])

  return { timeRemaining, getTimeRemaining }
}
