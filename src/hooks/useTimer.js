/**
 * useTimer.js — Per-guess countdown timer for Time Attack mode.
 *
 * Counts down from `timeLimit` seconds. Calls `onExpire` when it hits 0.
 * Resets whenever `resetKey` changes (we pass the attemptNumber as the key).
 *
 * On reset, a short `refilling` phase is shown first (500 ms) so the bottle
 * visually fills to max before the countdown begins.
 *
 * The bottle visual is driven by requestAnimationFrame using wall-clock time,
 * so it stays accurate even when the browser throttles timers in background tabs.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

// How long the bottle refill animation lasts before countdown begins (ms)
const REFILL_DURATION = 500

export function useTimer({ timeLimit, resetKey, onExpire, active }) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [refilling, setRefilling] = useState(false)
  // Smooth 0–100 percentage driven by rAF, used for the bottle fill
  const [timePct, setTimePct] = useState(100)
  const rafRef = useRef(null)
  const expiredRef = useRef(false)
  // Wall-clock timestamp when the countdown started
  const startTimeRef = useRef(null)
  // Stable ref for onExpire so it never triggers effect re-runs
  const onExpireRef = useRef(onExpire)
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  // On reset: show full bottle for REFILL_DURATION before starting countdown
  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    startTimeRef.current = null
    setTimeRemaining(timeLimit)
    setTimePct(100)
    setRefilling(true)
    expiredRef.current = false

    const refillTimer = setTimeout(() => setRefilling(false), REFILL_DURATION)
    return () => clearTimeout(refillTimer)
  }, [resetKey, timeLimit])

  // Run countdown via requestAnimationFrame after refill phase is complete.
  // Uses wall-clock time so backgrounded tabs snap to the correct position.
  useEffect(() => {
    if (!active || !timeLimit || refilling) return

    startTimeRef.current = Date.now()

    const frame = () => {
      const elapsedMs = Date.now() - startTimeRef.current
      const elapsedSec = elapsedMs / 1000
      const remaining = Math.max(0, timeLimit - elapsedSec)
      const pct = (remaining / timeLimit) * 100

      // Update the integer display (only when the whole second changes)
      setTimeRemaining(Math.ceil(remaining))
      setTimePct(pct)

      if (remaining <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true
          onExpireRef.current()
        }
        return // stop the loop
      }

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(rafRef.current)
  }, [active, timeLimit, resetKey, refilling])

  const getTimeRemaining = useCallback(() => timeRemaining, [timeRemaining])

  return { timeRemaining, timePct, refilling, getTimeRemaining }
}
