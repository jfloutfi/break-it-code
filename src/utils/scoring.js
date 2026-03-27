/**
 * scoring.js — Scoring system for Break It: Code
 *
 * All scoring is client-side only, no backend needed.
 * Formula from PRD:
 *   Final = Base × Efficiency × Difficulty + TimeBonus  (rounded to nearest int)
 */

/**
 * calculateScore
 * Computes the final score after a game ends.
 *
 * @param {object} params
 * @param {number} params.maxAttempts    - Total attempts allowed
 * @param {number} params.attemptsUsed   - How many guesses the player made
 * @param {number} params.slots          - Number of slots in the code
 * @param {number} params.numColors      - Number of colors available
 * @param {number} params.timeBonus      - Accumulated time bonus (50 pts per qualifying attempt)
 * @returns {{ base, efficiency, difficulty, timeBonus, total }} Score breakdown
 */
export function calculateScore({ maxAttempts, attemptsUsed, slots, numColors, timeBonus = 0 }) {
  const base = 1000
  const efficiency = (maxAttempts - attemptsUsed + 1) / maxAttempts
  const difficulty = (slots * numColors) / 24
  const total = Math.round(base * efficiency * difficulty + timeBonus)

  return {
    base,
    efficiency: Math.round(efficiency * 1000) / 1000, // 3 decimal places for display
    difficulty: Math.round(difficulty * 1000) / 1000,
    timeBonus,
    total,
  }
}

/**
 * shouldAwardTimeBonus
 * Returns true if a time bonus should be awarded for this attempt.
 * Bonus is given when the player submits with more than 50% of the time remaining.
 *
 * @param {number} timeLimit      - Time limit per attempt in seconds (0 = off)
 * @param {number} timeRemaining  - Seconds left when player submitted
 * @returns {boolean}
 */
export function shouldAwardTimeBonus(timeLimit, timeRemaining) {
  if (!timeLimit) return false
  return timeRemaining > timeLimit * 0.5
}

/** Points awarded per qualifying attempt in time attack mode */
export const TIME_BONUS_PER_ATTEMPT = 50
