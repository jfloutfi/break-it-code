/**
 * useGameState.js — Central state hook for Break It: Code
 *
 * Manages all game phases: 'setup' → 'playing' → 'end'
 * All state transitions go through this hook — no ad-hoc setState elsewhere.
 */

import { useReducer, useCallback } from 'react'
import { DEFAULT_SETTINGS } from '../utils/constants.js'
import { generateCode, calculateMaxAttempts, evaluateGuess, isWin } from '../utils/gameLogic.js'
import { calculateScore, shouldAwardTimeBonus, TIME_BONUS_PER_ATTEMPT } from '../utils/scoring.js'

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  screen: 'setup',       // 'setup' | 'playing' | 'end'
  settings: { ...DEFAULT_SETTINGS },

  // Gameplay
  code: [],              // secret code (array of color indices)
  maxAttempts: 0,
  guesses: [],           // [{ colors: number[], feedback: object }]
  activeGuess: [],       // current in-progress guess (array of color indices or null)
  selectedColor: null,   // color index currently picked from palette
  attemptNumber: 0,      // 1-based, how many guesses submitted so far

  // Time attack
  timeBonus: 0,          // accumulated time bonus points

  // End state
  result: null,          // 'win' | 'loss'
  gaveUp: false,         // true when player pressed Give Up
  finalScore: null,      // score breakdown object
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state, action) {
  switch (action.type) {

    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.payload }
      return { ...state, settings }
    }

    case 'START_GAME': {
      const { settings } = state
      const maxAttempts = calculateMaxAttempts(settings.slots, settings.duplicates, settings.feedbackMode, settings.timeAttack, settings.colors)
      const code = generateCode(settings.slots, settings.colors, settings.duplicates)
      return {
        ...state,
        screen: 'playing',
        code,
        maxAttempts,
        guesses: [],
        activeGuess: Array(settings.slots).fill(null),
        selectedColor: null,
        attemptNumber: 0,
        timeBonus: 0,
        result: null,
        finalScore: null,
      }
    }

    case 'SELECT_COLOR': {
      // Toggle off if same color clicked again, or if null passed (Escape key)
      const selectedColor = (action.payload === null || state.selectedColor === action.payload)
        ? null
        : action.payload
      return { ...state, selectedColor }
    }

    case 'PLACE_COLOR': {
      // Place selectedColor into slot at index, or clear if same color
      if (state.selectedColor === null) return state
      const activeGuess = [...state.activeGuess]
      activeGuess[action.payload] = state.selectedColor
      return { ...state, activeGuess }
    }

    case 'CLEAR_SLOT': {
      const activeGuess = [...state.activeGuess]
      activeGuess[action.payload] = null
      return { ...state, activeGuess }
    }

    case 'CLEAR_GUESS': {
      // Wipe all slots in the active row and deselect the current colour
      return {
        ...state,
        activeGuess: Array(state.settings.slots).fill(null),
        selectedColor: null,
      }
    }

    case 'SUBMIT_GUESS': {
      const { code, settings, guesses, maxAttempts, timeBonus } = state
      const { timeRemaining, timerExpired } = action.payload || {}

      // If timer expired and guess isn't full, fill missing slots with null → treated as wrong
      // We use -1 as a sentinel for "expired slot" (will never match any code color)
      const guess = timerExpired
        ? state.activeGuess.map((c) => (c === null ? -1 : c))
        : state.activeGuess

      // Don't submit if not full and timer didn't expire
      if (!timerExpired && guess.some((c) => c === null)) return state

      // Evaluate the guess
      const feedback = evaluateGuess(guess, code, settings.feedbackMode)
      const newGuesses = [...guesses, { colors: guess, feedback, expired: !!timerExpired }]
      const attemptNumber = newGuesses.length

      // Check for time bonus
      let newTimeBonus = timeBonus
      if (settings.timeAttack && timeRemaining !== undefined) {
        if (shouldAwardTimeBonus(settings.timeAttack, timeRemaining)) {
          newTimeBonus += TIME_BONUS_PER_ATTEMPT
        }
      }

      // Check win
      if (isWin(guess, code)) {
        const finalScore = calculateScore({
          maxAttempts,
          attemptsUsed: attemptNumber,
          slots: settings.slots,
          numColors: settings.colors,
          timeBonus: newTimeBonus,
        })
        return {
          ...state,
          guesses: newGuesses,
          attemptNumber,
          timeBonus: newTimeBonus,
          screen: 'end',
          result: 'win',
          finalScore,
        }
      }

      // Check loss (used all attempts)
      if (attemptNumber >= maxAttempts) {
        const finalScore = calculateScore({
          maxAttempts,
          attemptsUsed: attemptNumber,
          slots: settings.slots,
          numColors: settings.colors,
          timeBonus: newTimeBonus,
        })
        return {
          ...state,
          guesses: newGuesses,
          attemptNumber,
          timeBonus: newTimeBonus,
          screen: 'end',
          result: 'loss',
          finalScore,
        }
      }

      // Next row
      return {
        ...state,
        guesses: newGuesses,
        attemptNumber,
        timeBonus: newTimeBonus,
        activeGuess: Array(settings.slots).fill(null),
        selectedColor: null,
      }
    }

    case 'GIVE_UP': {
      // Player surrendered — score is always zero
      const finalScore = { base: 0, efficiency: 0, difficulty: 0, timeBonus: 0, total: 0 }
      return {
        ...state,
        screen: 'end',
        result: 'loss',
        gaveUp: true,
        finalScore,
      }
    }

    case 'ADD_TIME_BONUS': {
      return { ...state, timeBonus: state.timeBonus + TIME_BONUS_PER_ATTEMPT }
    }

    case 'PLAY_AGAIN': {
      return { ...initialState }
    }

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const updateSettings  = useCallback((patch) => dispatch({ type: 'UPDATE_SETTINGS', payload: patch }), [])
  const startGame       = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const selectColor     = useCallback((idx) => dispatch({ type: 'SELECT_COLOR', payload: idx }), [])
  const placeColor      = useCallback((slotIdx) => dispatch({ type: 'PLACE_COLOR', payload: slotIdx }), [])
  const clearSlot       = useCallback((slotIdx) => dispatch({ type: 'CLEAR_SLOT', payload: slotIdx }), [])
  const clearGuess      = useCallback(() => dispatch({ type: 'CLEAR_GUESS' }), [])
  const submitGuess     = useCallback((opts) => dispatch({ type: 'SUBMIT_GUESS', payload: opts }), [])
  const giveUp          = useCallback(() => dispatch({ type: 'GIVE_UP' }), [])
  const playAgain       = useCallback(() => dispatch({ type: 'PLAY_AGAIN' }), [])

  // Derived: is the activeGuess fully filled?
  const canSubmit = state.screen === 'playing' && state.activeGuess.every((c) => c !== null)

  return {
    ...state,
    canSubmit,
    updateSettings,
    startGame,
    selectColor,
    placeColor,
    clearSlot,
    clearGuess,
    submitGuess,
    giveUp,
    playAgain,
  }
}
