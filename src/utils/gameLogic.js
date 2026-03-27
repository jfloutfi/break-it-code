/**
 * gameLogic.js — Core game logic for Break It: Code
 *
 * All functions are pure (no side effects, same input = same output).
 * Each function is documented with its purpose, inputs, and outputs.
 */

import { COLORS } from './constants.js'

/**
 * generateCode
 * Creates a random secret code for the player to guess.
 *
 * @param {number} slots      - How many pegs in the code (3–6)
 * @param {number} numColors  - How many colors are available (4–8)
 * @param {boolean} duplicates - Whether the same color can appear more than once
 * @returns {number[]} Array of color indices, e.g. [0, 3, 1, 3]
 */
export function generateCode(slots, numColors, duplicates) {
  const available = Array.from({ length: numColors }, (_, i) => i)
  const code = []

  if (duplicates) {
    // With duplicates: pick any color each time
    for (let i = 0; i < slots; i++) {
      code.push(available[Math.floor(Math.random() * numColors)])
    }
  } else {
    // Without duplicates: shuffle and take the first N
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, slots)
  }

  return code
}

/**
 * calculateMaxAttempts
 * Determines how many guesses the player gets based on current settings.
 * Formula from PRD: Base ceil(slots * 1.5 + 2), +2 for duplicates, +2 for limited mode, capped 6–15.
 * Time attack adds extra attempts to compensate for the difficulty: 15s→+3, 30s→+2, 60s→+1.
 *
 * @param {number} slots        - Number of slots in the code
 * @param {boolean} duplicates  - Whether duplicates are allowed
 * @param {string} feedbackMode - 'standard' or 'limited'
 * @param {number} timeAttack   - Seconds per attempt (0 = off)
 * @returns {number} Max attempts, between 6 and 15
 */
export function calculateMaxAttempts(slots, duplicates, feedbackMode, timeAttack = 0) {
  let attempts = Math.ceil(slots * 1.5 + 2)
  if (duplicates) attempts += 2
  if (feedbackMode === 'limited') attempts += 2
  // Faster time limits are harder, so reward the player with more attempts
  if (timeAttack === 15) attempts += 3
  else if (timeAttack === 30) attempts += 2
  else if (timeAttack === 60) attempts += 1
  return Math.min(15, Math.max(6, attempts))
}

/**
 * evaluateGuess
 * Compares a guess to the secret code and returns feedback.
 * Standard mode: counts exact matches (black pegs) and color matches in wrong positions (white pegs).
 * Limited mode: only returns total correct colors regardless of position.
 *
 * @param {number[]} guess        - The player's guess, array of color indices
 * @param {number[]} code         - The secret code, array of color indices
 * @param {string} feedbackMode   - 'standard' or 'limited'
 * @returns {{ black: number, white: number } | { count: number }}
 *   Standard: { black, white } — black = right color + right position, white = right color + wrong position
 *   Limited:  { count }        — total colors that appear in the code (any position)
 */
export function evaluateGuess(guess, code, feedbackMode) {
  if (feedbackMode === 'limited') {
    // Count how many colors in the guess appear anywhere in the code
    // We account for duplicates by tracking used counts
    const codeCounts = {}
    for (const c of code) {
      codeCounts[c] = (codeCounts[c] || 0) + 1
    }
    const guessCounts = {}
    for (const c of guess) {
      guessCounts[c] = (guessCounts[c] || 0) + 1
    }
    let count = 0
    for (const color in guessCounts) {
      if (codeCounts[color]) {
        count += Math.min(guessCounts[color], codeCounts[color])
      }
    }
    return { count }
  }

  // Standard mode: classic Mastermind feedback
  let black = 0 // correct color, correct position
  let white = 0 // correct color, wrong position

  const codeRemaining = []
  const guessRemaining = []

  // First pass: find exact matches (black pegs)
  for (let i = 0; i < code.length; i++) {
    if (guess[i] === code[i]) {
      black++
    } else {
      codeRemaining.push(code[i])
      guessRemaining.push(guess[i])
    }
  }

  // Second pass: find color matches in remaining slots (white pegs)
  for (const color of guessRemaining) {
    const idx = codeRemaining.indexOf(color)
    if (idx !== -1) {
      white++
      codeRemaining.splice(idx, 1) // remove so we don't double-count
    }
  }

  return { black, white }
}

/**
 * isWin
 * Returns true if the guess matches the code exactly (all black pegs).
 *
 * @param {number[]} guess - The player's guess
 * @param {number[]} code  - The secret code
 * @returns {boolean}
 */
export function isWin(guess, code) {
  return guess.length === code.length && guess.every((c, i) => c === code[i])
}
