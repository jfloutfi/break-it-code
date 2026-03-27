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
 * All 5 difficulty modifiers are reflected in the score:
 *   slots, numColors → base difficulty multiplier
 *   duplicates ON    → × 1.25 (larger search space)
 *   feedbackMode 'limited' → × 1.25 (less information per guess)
 *   timeAttack       → time bonus points added per qualifying attempt
 *
 * @param {object} params
 * @param {number}  params.maxAttempts    - Total attempts allowed
 * @param {number}  params.attemptsUsed   - How many guesses the player made
 * @param {number}  params.slots          - Number of slots in the code
 * @param {number}  params.numColors      - Number of colors available
 * @param {boolean} params.duplicates     - Whether duplicates were allowed
 * @param {string}  params.feedbackMode   - 'standard' or 'limited'
 * @param {number}  params.timeBonus      - Accumulated time bonus (50 pts per qualifying attempt)
 * @returns {{ base, efficiency, difficulty, timeBonus, total }} Score breakdown
 */
export function calculateScore({ maxAttempts, attemptsUsed, slots, numColors, duplicates = false, feedbackMode = 'standard', timeBonus = 0 }) {
  const base = 1000
  const efficiency = (maxAttempts - attemptsUsed + 1) / maxAttempts
  let difficulty = (slots * numColors) / 24
  if (duplicates) difficulty *= 1.25
  if (feedbackMode === 'limited') difficulty *= 1.25

  const subtotal = Math.round(base * efficiency * difficulty)
  const total = Math.round(subtotal + timeBonus)

  return {
    base,
    efficiency: Math.round(efficiency * 1000) / 1000,
    difficulty: Math.round(difficulty * 1000) / 1000,
    subtotal,
    timeBonus,
    total,
    // context values for detailed display
    attemptsUsed,
    maxAttempts,
    slots,
    numColors,
    duplicates,
    feedbackMode,
  }
}

/**
 * getTimeBonus
 * Returns the time bonus earned for a single attempt based on how much time remained.
 *   > 50% remaining → 50 pts
 *   > 25% remaining → 25 pts
 *   else            → 0 pts
 *
 * @param {number} timeLimit      - Time limit per attempt in seconds (0 = off)
 * @param {number} timeRemaining  - Seconds left when player submitted
 * @returns {number} Bonus points (50, 25, or 0)
 */
export function getTimeBonus(timeLimit, timeRemaining) {
  if (!timeLimit) return 0
  if (timeRemaining > timeLimit * 0.5) return 50
  if (timeRemaining > timeLimit * 0.25) return 25
  return 0
}
