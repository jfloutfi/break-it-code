/**
 * EndScreen — Win and loss screen with score breakdown.
 * Shown after the player wins, loses, or gives up.
 */

import { COLORS } from '../utils/constants.js'
import './EndScreen.css'

export default function EndScreen({ result, gaveUp, code, finalScore, attemptNumber, maxAttempts, onPlayAgain }) {
  const isWin = result === 'win'

  return (
    <div className={`end ${isWin ? 'end--win' : 'end--loss'}`}>

      {/* ── Result Message ── */}
      <div className="end__message">
        <h1 className={`end__title ${isWin ? 'end__title--win' : 'end__title--loss'}`}>
          {isWin ? 'YOU CRACKED IT!' : gaveUp ? 'YOU GAVE UP' : 'CODE UNBROKEN'}
        </h1>
        <p className="end__subtitle">
          {isWin
            ? `SOLVED IN ${attemptNumber} OF ${maxAttempts} ATTEMPTS`
            : gaveUp
            ? 'BETTER LUCK NEXT TIME'
            : 'THE CODE REMAINS A MYSTERY'}
        </p>
      </div>

      {/* ── Secret Code Reveal ── */}
      <div className="end__code-section">
        <p className="end__code-label">THE SECRET CODE WAS</p>
        <div className="end__code">
          {code.map((colorIdx, i) => {
            const color = COLORS[colorIdx] || COLORS[0]
            return (
              <div
                key={i}
                className="end__code-peg"
                style={{ backgroundColor: color.hex, boxShadow: `0 0 12px ${color.hex}, 0 0 30px ${color.hex}66` }}
                title={color.name}
              />
            )
          })}
        </div>
      </div>

      {/* ── Score Breakdown ── */}
      {finalScore && (
        <div className="end__score-section">
          <p className="end__score-label">{isWin ? 'YOUR SCORE' : gaveUp ? 'FINAL SCORE' : 'SCORE WOULD HAVE BEEN'}</p>
          <div className="end__score-breakdown">
            <div className="end__score-row">
              <span className="end__score-key">BASE</span>
              <span className="end__score-val">{finalScore.base}</span>
            </div>
            <div className="end__score-row">
              <span className="end__score-key">× EFFICIENCY</span>
              <span className="end__score-val">{finalScore.efficiency.toFixed(3)}</span>
            </div>
            <div className="end__score-row">
              <span className="end__score-key">× DIFFICULTY</span>
              <span className="end__score-val">{finalScore.difficulty.toFixed(3)}</span>
            </div>
            {finalScore.timeBonus > 0 && (
              <div className="end__score-row">
                <span className="end__score-key">+ TIME BONUS</span>
                <span className="end__score-val end__score-val--bonus">+{finalScore.timeBonus}</span>
              </div>
            )}
            <div className="end__score-divider" />
            <div className="end__score-row end__score-row--total">
              <span className="end__score-key">TOTAL</span>
              <span className="end__score-val end__score-val--total">{finalScore.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Play Again ── */}
      <button className="end__play-again-btn" onClick={onPlayAgain}>
        PLAY AGAIN
      </button>

    </div>
  )
}
