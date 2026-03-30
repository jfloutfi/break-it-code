/**
 * useTimer.js — Per-guess countdown timer for Time Attack mode.
 *
 * Counts down from `timeLimit` seconds. Calls `onExpire` when it hits 0.
 * Resets whenever `resetKey` changes (we pass the attemptNumber as the key).
 *
 * On reset, a short `refilling` phase is shown first (600 ms) so the bottle
 * visually fills to max before the countdown begins.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

// How long the bottle refill animation lasts before countdown begins (ms)
const REFILL_DURATION = 500

export function useTimer({ timeLimit, resetKey, onExpire, active }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [refilling, setRefilling] = useState(false)
  // True when time jumped >2s (tab return) — bottle should skip CSS transition
  const [jumping, setJumping] = useState(false)
  const intervalRef = useRef(null)
  const expiredRef = useRef(false)
  const prevRemainingRef = useRef(timeLimit)
  // Wall-clock timestamp when the countdown started
  const startTimeRef = useRef(null)
  // Stable ref for onExpire so it never triggers effect re-runs
  const onExpireRef = useRef(onExpire)
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  // On reset: show full bottle for REFILL_DURATION before starting countdown
  useEffect(() => {
    clearInterval(intervalRef.current)
    startTimeRef.current = null
    prevRemainingRef.current = timeLimit
    setTimeRemaining(timeLimit)
    setRefilling(true)
    setJumping(false)
    expiredRef.current = false

    const refillTimer = setTimeout(() => setRefilling(false), REFILL_DURATION)
    return () => clearTimeout(refillTimer)
  }, [resetKey, timeLimit])

  // Run countdown only after refill phase is complete.
  // Uses wall-clock time so backgrounded tabs don't cause rapid catch-up ticks.
  useEffect(() => {
    if (!active || !timeLimit || refilling) return

    startTimeRef.current = Date.now()

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, timeLimit - elapsed)
      const gap = prevRemainingRef.current - remaining

      // If time jumped >2s (tab was backgrounded), skip the CSS transition
      if (gap > 2) setJumping(true)
      else setJumping(false)

      prevRemainingRef.current = remaining
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        clearInterval(intervalRef.current)
        if (!expiredRef.current) {
          expiredRef.current = true
          onExpireRef.current()
        }
      }
    }

    intervalRef.current = setInterval(tick, 1000)

    return () => clearInterval(intervalRef.current)
  }, [active, timeLimit, resetKey, refilling])

  const getTimeRemaining = useCallback(() => timeRemaining, [timeRemaining])

  return { timeRemaining, refilling, jumping, getTimeRemaining }
}
