/**
 * SetupScreen — Game configuration screen.
 * Player adjusts all settings before starting. Shows live attempt count.
 */

import { useState } from 'react'
import { calculateMaxAttempts } from '../utils/gameLogic.js'
import { LIMITS, TIME_ATTACK_OPTIONS } from '../utils/constants.js'
import './SetupScreen.css'

export default function SetupScreen({ settings, onUpdate, onStart }) {
  const maxAttempts = calculateMaxAttempts(settings.slots, settings.duplicates, settings.feedbackMode, settings.timeAttack, settings.colors)
  const [htpOpen, setHtpOpen] = useState(false)

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
          <p className="setup__tip">More slots = harder code to crack</p>
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
          <p className="setup__tip">More colors = more possible combinations</p>
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
          <p className="setup__tip">ON: the same color can appear more than once</p>
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
          <p className="setup__tip">Standard: exact + partial matches · Limited: count only</p>
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
          <p className="setup__tip">Guess before the timer runs out or lose the attempt</p>
        </div>

        {/* ── Attempts Preview ── */}
        <div className="setup__attempts">
          YOU GET <span className="setup__attempts-count">{maxAttempts}</span> ATTEMPTS
        </div>

      </div>

      {/* ── How to Play ── */}
      <div className="setup__htp">
        <button
          className="setup__htp-toggle"
          onClick={() => setHtpOpen((o) => !o)}
          aria-expanded={htpOpen}
        >
          HOW TO PLAY <span className="setup__htp-arrow">{htpOpen ? '▴' : '▾'}</span>
        </button>

        {htpOpen && (
          <div className="setup__htp-body">

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">OBJECTIVE</h3>
              <p className="setup__htp-text">Crack the hidden color sequence before your attempts run out.</p>
            </div>

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">GUESSING</h3>
              <p className="setup__htp-text">Pick a color from the palette, then click the slots to fill them. Hit SUBMIT when all slots are filled. Use CLEAR to wipe the row and start it over.</p>
            </div>

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">FEEDBACK — STANDARD</h3>
              <p className="setup__htp-text">
                Neon peg: right color, right position.<br />
                White peg: right color, wrong position.<br />
                Empty: color not in the code.
              </p>
            </div>

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">FEEDBACK — LIMITED</h3>
              <p className="setup__htp-text">Only shows the total number of correct colors. No position info.</p>
            </div>

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">TIME ATTACK</h3>
              <p className="setup__htp-text">Each guess has a countdown bottle. If it empties and the row is full, it auto-submits. If incomplete, the attempt is burned — no feedback (red ! shown).</p>
            </div>

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">SCORING</h3>
              <p className="setup__htp-text">Fewer guesses + harder settings = higher score. Speed bonuses apply when you submit with more than half the time remaining.</p>
            </div>

            <div className="setup__htp-section">
              <h3 className="setup__htp-heading">GIVE UP</h3>
              <p className="setup__htp-text">Ends the game immediately. Score is zero.</p>
            </div>

          </div>
        )}
      </div>

      <button className="setup__start-btn" onClick={onStart}>
        START GAME
      </button>
    </div>
  )
}
