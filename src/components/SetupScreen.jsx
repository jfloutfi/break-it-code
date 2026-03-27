/**
 * SetupScreen — Game configuration screen.
 * Player adjusts all settings before starting. Shows live attempt count.
 */

import { calculateMaxAttempts } from '../utils/gameLogic.js'
import { LIMITS, TIME_ATTACK_OPTIONS } from '../utils/constants.js'
import './SetupScreen.css'

export default function SetupScreen({ settings, onUpdate, onStart }) {
  const maxAttempts = calculateMaxAttempts(settings.slots, settings.duplicates, settings.feedbackMode)

  return (
    <div className="setup">
      <header className="setup__header">
        <h1 className="setup__title">
          <span className="setup__title--green">BREAK IT:</span>
          <br />
          <span className="setup__title--pink">CODE</span>
        </h1>
        <p className="setup__subtitle">CRACK THE CODE. BEAT THE MACHINE.</p>
      </header>

      <div className="setup__panel">

        {/* ── Slots ── */}
        <div className="setup__row">
          <label className="setup__label">SLOTS</label>
          <div className="setup__options">
            {[3, 4, 5, 6].map((n) => (
              <button
                key={n}
                className={`setup__opt-btn ${settings.slots === n ? 'setup__opt-btn--active' : ''}`}
                onClick={() => onUpdate({ slots: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* ── Colors ── */}
        <div className="setup__row">
          <label className="setup__label">COLORS</label>
          <div className="setup__options">
            {[4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                className={`setup__opt-btn ${settings.colors === n ? 'setup__opt-btn--active' : ''}`}
                onClick={() => onUpdate({ colors: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* ── Duplicates ── */}
        <div className="setup__row">
          <label className="setup__label">DUPLICATES</label>
          <div className="setup__options">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                className={`setup__opt-btn ${settings.duplicates === val ? 'setup__opt-btn--active' : ''}`}
                onClick={() => onUpdate({ duplicates: val })}
              >
                {val ? 'ON' : 'OFF'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Feedback Mode ── */}
        <div className="setup__row">
          <label className="setup__label">FEEDBACK</label>
          <div className="setup__options">
            {['standard', 'limited'].map((mode) => (
              <button
                key={mode}
                className={`setup__opt-btn setup__opt-btn--wide ${settings.feedbackMode === mode ? 'setup__opt-btn--active' : ''}`}
                onClick={() => onUpdate({ feedbackMode: mode })}
              >
                {mode === 'standard' ? 'STANDARD' : 'LIMITED'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Time Attack ── */}
        <div className="setup__row">
          <label className="setup__label">TIME ATTACK</label>
          <div className="setup__options">
            {TIME_ATTACK_OPTIONS.map((t) => (
              <button
                key={t}
                className={`setup__opt-btn ${settings.timeAttack === t ? 'setup__opt-btn--active' : ''}`}
                onClick={() => onUpdate({ timeAttack: t })}
              >
                {t === 0 ? 'OFF' : `${t}S`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Attempts Preview ── */}
        <div className="setup__attempts">
          YOU GET <span className="setup__attempts-count">{maxAttempts}</span> ATTEMPTS
        </div>

      </div>

      <button className="setup__start-btn" onClick={onStart}>
        START GAME
      </button>
    </div>
  )
}
