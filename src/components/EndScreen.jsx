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
            {gaveUp ? (
              <div className="end__score-row end__score-row--total">
                <span className="end__score-key">TOTAL</span>
                <span className="end__score-val end__score-val--total">0</span>
              </div>
            ) : (
              <>
                {/* Performance */}
                <div className="end__score-section-header">PERFORMANCE</div>
                <div className="end__score-row">
                  <span className="end__score-key">Guesses used</span>
                  <span className="end__score-val">{finalScore.attemptsUsed} of {finalScore.maxAttempts}</span>
                </div>

                <div className="end__score-divider" />

                {/* Difficulty Settings */}
                <div className="end__score-section-header">DIFFICULTY SETTINGS</div>
                <div className="end__score-row">
                  <span className="end__score-key">Code length</span>
                  <span className="end__score-val">{finalScore.slots} slots</span>
                </div>
                <div className="end__score-row">
                  <span className="end__score-key">Color pool</span>
                  <span className="end__score-val">{finalScore.numColors} colors</span>
                </div>
                <div className="end__score-row">
                  <span className="end__score-key">Duplicates</span>
                  <span className={`end__score-val${finalScore.duplicates ? ' end__score-val--harder' : ''}`}>
                    {finalScore.duplicates ? 'ALLOWED' : 'OFF'}
                  </span>
                </div>
                <div className="end__score-row">
                  <span className="end__score-key">Feedback mode</span>
                  <span className={`end__score-val${finalScore.feedbackMode === 'limited' ? ' end__score-val--harder' : ''}`}>
                    {finalScore.feedbackMode === 'limited' ? 'LIMITED' : 'STANDARD'}
                  </span>
                </div>

                <div className="end__score-divider" />

                <div className="end__score-row">
                  <span className="end__score-key end__score-key--label">SCORE</span>
                  <span className="end__score-val">{finalScore.subtotal}</span>
                </div>

                {finalScore.timeBonus > 0 && (
                  <div className="end__score-row">
                    <span className="end__score-key">Time bonus</span>
                    <span className="end__score-val end__score-val--bonus">+{finalScore.timeBonus}</span>
                  </div>
                )}

                <div className="end__score-divider" />

                <div className="end__score-row end__score-row--total">
                  <span className="end__score-key">TOTAL</span>
                  <span className="end__score-val end__score-val--total">{finalScore.total}</span>
                </div>
              </>
            )}
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
