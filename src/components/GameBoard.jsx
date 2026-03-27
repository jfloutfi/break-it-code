/**
 * GameBoard — The main gameplay screen.
 * Shows all attempt rows, the color palette, and controls.
 */

import { useEffect, useCallback, useRef } from 'react'
import { COLORS } from '../utils/constants.js'
import { useTimer } from '../hooks/useTimer.js'
import './GameBoard.css'

export default function GameBoard({
  settings,
  guesses,
  activeGuess,
  selectedColor,
  attemptNumber,
  maxAttempts,
  finalScore,
  canSubmit,
  onSelectColor,
  onPlaceColor,
  onClearSlot,
  onSubmit,
  onGiveUp,
}) {
  const palette = COLORS.slice(0, settings.colors)
  const timeLimit = settings.timeAttack || 0

  // Capture latest canSubmit in a ref so the timer callback always sees current value
  const canSubmitRef = useRef(canSubmit)
  useEffect(() => { canSubmitRef.current = canSubmit }, [canSubmit])

  const handleTimerExpire = useCallback(() => {
    // Auto-submit if full, otherwise skip (burn the attempt via submit with empty slots forced)
    onSubmit({ timerExpired: true })
  }, [onSubmit])

  const { timeRemaining } = useTimer({
    timeLimit,
    resetKey: attemptNumber,
    onExpire: handleTimerExpire,
    active: true,
  })

  const timePct = timeLimit ? (timeRemaining / timeLimit) * 100 : 100
  const timerDanger = timeLimit && timeRemaining <= Math.ceil(timeLimit * 0.25)

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && canSubmit) onSubmit({ timeRemaining })
    if (e.key === 'Escape') onSelectColor(null)
  }, [canSubmit, onSubmit, onSelectColor])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Live score estimate (not final yet)
  const liveScore = finalScore?.total ?? null

  return (
    <div className="board">

      {/* ── Header ── */}
      <header className="board__header">
        <span className="board__attempt-counter">
          ATTEMPT <span className="board__counter-num">{attemptNumber + 1}</span> OF <span className="board__counter-num">{maxAttempts}</span>
        </span>
        <h1 className="board__logo">
          <span className="board__logo--green">BREAK IT:</span>
          <span className="board__logo--pink"> CODE</span>
        </h1>
        <button className="board__give-up-btn" onClick={onGiveUp}>GIVE UP</button>
      </header>

      {/* ── Timer Bar (Time Attack only) ── */}
      {timeLimit > 0 && (
        <div className="board__timer">
          <div
            className={`board__timer-bar ${timerDanger ? 'board__timer-bar--danger' : ''}`}
            style={{ width: `${timePct}%` }}
          />
          <span className={`board__timer-num ${timerDanger ? 'board__timer-num--danger' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
      )}

      {/* ── Guess Rows ── */}
      <div className="board__rows">
        {Array.from({ length: maxAttempts }, (_, rowIdx) => {
          const isSubmitted = rowIdx < guesses.length
          const isActive = rowIdx === guesses.length
          const guess = isSubmitted ? guesses[rowIdx] : null

          return (
            <div
              key={rowIdx}
              className={`board__row ${isSubmitted ? 'board__row--submitted' : ''} ${isActive ? 'board__row--active' : ''}`}
            >
              {/* Row number */}
              <span className="board__row-num">{maxAttempts - rowIdx}</span>

              {/* Slots */}
              <div className="board__slots">
                {Array.from({ length: settings.slots }, (_, slotIdx) => {
                  const colorIdx = isSubmitted
                    ? guess.colors[slotIdx]
                    : isActive
                    ? activeGuess[slotIdx]
                    : null

                  const color = colorIdx !== null && colorIdx !== undefined ? COLORS[colorIdx] : null

                  return (
                    <button
                      key={slotIdx}
                      className={`board__slot ${color ? 'board__slot--filled' : 'board__slot--empty'} ${isActive ? 'board__slot--clickable' : ''}`}
                      style={color ? { backgroundColor: color.hex, boxShadow: `0 0 8px ${color.hex}, 0 0 20px ${color.hex}66` } : {}}
                      onClick={() => isActive && (color ? onClearSlot(slotIdx) : onPlaceColor(slotIdx))}
                      disabled={!isActive}
                      aria-label={color ? `${color.name} peg, click to clear` : 'Empty slot'}
                    />
                  )
                })}
              </div>

              {/* Feedback */}
              <div className="board__feedback">
                {isSubmitted && <Feedback feedback={guess.feedback} slots={settings.slots} mode={settings.feedbackMode} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Sticky Controls: Palette + Submit ── */}
      <div className="board__controls">
        <div className="board__palette-section">
          <div className="board__palette">
            {palette.map((color, idx) => (
              <button
                key={idx}
                className={`board__color-btn ${selectedColor === idx ? 'board__color-btn--selected' : ''}`}
                style={{ backgroundColor: color.hex, boxShadow: selectedColor === idx ? `0 0 12px ${color.hex}, 0 0 30px ${color.hex}` : `0 0 4px ${color.hex}88` }}
                onClick={() => onSelectColor(idx)}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
          {selectedColor !== null && (
            <p className="board__selected-hint">
              {COLORS[selectedColor].name.toUpperCase()} SELECTED — CLICK A SLOT
            </p>
          )}
        </div>

        <button
          className={`board__submit-btn ${canSubmit ? 'board__submit-btn--ready' : ''}`}
          onClick={() => onSubmit({ timeRemaining })}
          disabled={!canSubmit}
        >
          SUBMIT GUESS
        </button>
      </div>
    </div>
  )
}

// ── Feedback Pegs ────────────────────────────────────────────────────────────

function Feedback({ feedback, slots, mode }) {
  if (mode === 'limited') {
    return (
      <div className="feedback feedback--limited">
        <span className="feedback__count">{feedback.count}</span>
      </div>
    )
  }

  // Standard mode: render black/white/empty pegs
  const pegs = []
  for (let i = 0; i < feedback.black; i++) pegs.push('black')
  for (let i = 0; i < feedback.white; i++) pegs.push('white')
  while (pegs.length < slots) pegs.push('empty')

  return (
    <div className="feedback feedback--standard" style={{ '--peg-cols': Math.ceil(Math.sqrt(slots)) }}>
      {pegs.map((type, i) => (
        <span key={i} className={`feedback__peg feedback__peg--${type}`} />
      ))}
    </div>
  )
}
