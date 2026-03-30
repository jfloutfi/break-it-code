# Break It: Code — Claude Code Build Brief

**Stack:** React + Vite · Deployed on Vercel  
**Aesthetic:** Retro 80s Arcade  
**Reference:** Read the full PRD (`break-it-code-PRD.md`) before writing any code.

---

## Context

You are building a complete, deployable browser game called **Break It: Code** — a customizable Mastermind-inspired logic puzzle game. All game rules, screen flows, scoring formulas, and design specs are in the PRD. Read it entirely before starting.

**Tech stack:**
- React (functional components + hooks)
- Vite (bundler/dev server)
- Plain CSS (no Tailwind, no CSS-in-JS)
- No external game libraries — React + Vite only
- Vercel for deployment

---

## Ground Rules

- **Build milestone by milestone.** Do not skip ahead. Each milestone must be runnable before the next begins.
- **No external game libraries.** React + Vite + plain CSS only. No Phaser, no game engines.
- **No inline styles.** All styling through CSS files or CSS modules.
- **Functional components only.** No class components.
- **Comment all game logic functions.** The developer is non-technical — explain what each function does, its inputs, and its outputs.
- **Test game logic before building UI.** Use `console.log` in the browser console to verify `evaluateGuess` outputs correct results before wiring to any component.
- **Retro aesthetic is non-negotiable.** The game must look like an 80s arcade game. No generic modern UI patterns — no plain shadows, no white backgrounds, no unstyled sans-serif fonts.
- **When in doubt, ask.** If any requirement is ambiguous, stop and ask rather than guess and redo.

---

## Milestones

### Milestone 1: Project Scaffold

**Goal:** A running React + Vite project with the right folder structure and base styles.

**Tasks:**
1. Create a new Vite + React project: `npm create vite@latest break-it-code -- --template react`
2. Remove all boilerplate content (default App, CSS, assets)
3. Create the following folder structure:
   - `src/components/` — React components
   - `src/hooks/` — custom hooks
   - `src/utils/` — pure functions (game logic, scoring)
   - `src/styles/` — CSS files
4. Set up `index.css` with:
   - CSS reset (box-sizing, margin, padding)
   - CSS variables for the full color palette (from PRD Section 5)
   - Google Fonts import: Press Start 2P + Share Tech Mono
   - Global dark background
   - CRT scanline overlay (`:root::after` pseudo-element with a `repeating-linear-gradient`)
5. Create a placeholder `App.jsx` that renders "BREAK IT: CODE" centered on screen in the pixel font
6. Confirm `npm run dev` works with no errors

**Deliverable:** Running dev server showing a dark screen with the game title in pixel font.

---

### Milestone 2: Game Logic (Pure Functions)

**Goal:** All game rules coded and verified before any UI is built.

**Tasks:**
1. Create `src/utils/gameLogic.js` with these exported functions:
   - `generateCode(slots, colors, allowDuplicates)` — returns an array of color indices (the secret code)
   - `calculateMaxAttempts(slots, colors, allowDuplicates, limitedFeedback)` — returns a number using the formula from the PRD
   - `evaluateGuess(guess, code)` — returns `{ blacks, whites }` where blacks = correct position, whites = correct color wrong position
   - `getLimitedFeedback(guess, code)` — returns `{ totalCorrect }` (count only, no position info)
   - `checkWin(guess, code)` — returns boolean
2. Create `src/utils/scoring.js` with:
   - `calculateScore(slots, colors, maxAttempts, attemptsUsed, timeBonus)` — returns integer score
   - `calculateDifficultyMultiplier(slots, colors)` — returns float
   - `calculateEfficiencyMultiplier(maxAttempts, attemptsUsed)` — returns float
3. Write inline comments on every function explaining inputs and outputs
4. Manually verify with `console.log` tests before proceeding (e.g., test `evaluateGuess` with known inputs and confirm output is correct)

**Deliverable:** `gameLogic.js` and `scoring.js` fully implemented and verified correct in the browser console.

---

### Milestone 3: State Management

**Goal:** A central game state hook that drives the entire app.

**Tasks:**
1. Create `src/hooks/useGameState.js`
2. Manage these state slices:
   - `screen` — `'setup' | 'game' | 'end'`
   - `settings` — `{ slots, colors, allowDuplicates, limitedFeedback, timeAttack }`
   - `code` — the secret code array (null until game starts)
   - `guesses` — array of submitted guesses, each `{ colors, feedback }`
   - `currentGuess` — the player's active (unsubmitted) guess array
   - `maxAttempts` — calculated from settings
   - `timeBonus` — accumulated time bonus
   - `result` — `'win' | 'lose' | null`
   - `score` — final score (null until game ends)
3. Expose these actions from the hook:
   - `startGame(settings)` — generate code, calculate attempts, transition to game screen
   - `placeColor(slotIndex, colorIndex)` — place a color in the current guess
   - `removeColor(slotIndex)` — remove a color from the current guess
   - `submitGuess()` — evaluate guess, add feedback, check win/loss, advance row
   - `addTimeBonus()` — increment time bonus for the current guess
   - `endGame(result)` — transition to end screen, calculate score
   - `resetGame()` — return to setup screen
4. Import and use the utility functions from Milestone 2

**Deliverable:** `useGameState.js` fully implemented. No UI yet — logic verified through the hook.

---

### Milestone 4: Setup Screen

**Goal:** A fully functional, styled Setup Screen.

**Tasks:**
1. Create `src/components/SetupScreen.jsx`
2. Render the game logo ("BREAK IT: CODE") with neon glow effect
3. Add a subtitle ("CRACK THE SEQUENCE")
4. Render controls for each setting:
   - Slots: row of 4 buttons (3 / 4 / 5 / 6), selected one highlighted
   - Colors: row of 5 buttons (4 / 5 / 6 / 7 / 8), selected one highlighted
   - Duplicates: toggle switch (ON / OFF)
   - Feedback mode: toggle switch (STANDARD / LIMITED)
   - Time attack: row of 4 buttons (OFF / 15s / 30s / 60s)
5. Show live "YOU GET X ATTEMPTS" — updates as settings change
6. Large START GAME button wired to `startGame(settings)`
7. Style to match the retro arcade aesthetic: neon borders, glowing selected states, monospace labels, pixel font headings

**Deliverable:** Complete styled Setup Screen. Clicking START transitions state (game screen can show a placeholder for now).

---

### Milestone 5: Game Board

**Goal:** The core gameplay screen — board, palette, and submit button.

**Tasks:**
1. Create `src/components/GameScreen.jsx`
2. Create `src/components/GuessRow.jsx`:
   - Props: `slots`, `colors`, `feedback`, `isActive`
   - Slot circles: filled with color or empty ring
   - Feedback pegs: small grid of black/white/empty circles
   - Active row: highlighted border; submitted rows: dimmed
3. Create `src/components/ColorPalette.jsx`:
   - N color circles (based on settings)
   - Click to select; selected color has a glowing ring
4. Create `src/components/GameBoard.jsx`:
   - Renders all rows (`maxAttempts` total)
   - Active row = last unsubmitted
5. Game screen layout:
   - Top bar: "ATTEMPT X OF Y" + live score
   - Center: the game board
   - Bottom: color palette + SUBMIT button + GIVE UP button
6. Wire SUBMIT to `submitGuess()` — only enabled when all slots filled
7. Wire GIVE UP to `endGame('lose')`
8. Wire palette clicks to `placeColor()` via a selected-color intermediate state

**Deliverable:** Fully playable game board. Players can guess, receive feedback, and reach a win or loss state.

---

### Milestone 6: Time Attack

**Goal:** Per-guess countdown timer (only active when time attack is enabled in settings).

**Tasks:**
1. Create `src/hooks/useTimer.js`:
   - Takes `duration` (seconds) and `onExpire` callback
   - Returns `{ timeLeft, isRunning, reset }`
   - Uses `setInterval` internally, cleans up on unmount
2. In `GameScreen.jsx`, if `settings.timeAttack !== 'off'`:
   - Show a depleting countdown bar above the active row
   - Show numeric seconds remaining
   - On expire: auto-submit if guess is full, otherwise skip the row (counts as a failed attempt)
   - Award time bonus if >50% time remained when player manually submits — call `addTimeBonus()`
3. Reset timer on each new row

**Deliverable:** Working time attack mode. Timer visible, functional, and bonus correctly applied.

---

### Milestone 7: End Screen

**Goal:** Win and loss screens with score display.

**Tasks:**
1. Create `src/components/EndScreen.jsx`
2. Win state: "YOU CRACKED IT!" in pixel font with neon glow
3. Lose state: "CODE UNBROKEN" in a dimmer color
4. Both states:
   - Reveal the secret code (display actual color circles)
   - Show score breakdown: base, efficiency multiplier, difficulty multiplier, time bonus, total
   - Show attempts used vs max
   - PLAY AGAIN button calling `resetGame()`
5. Add a CSS scan-in animation when the screen appears

**Deliverable:** Complete End Screen for both win and loss outcomes.

---

### Milestone 8: Polish & Deployment

**Goal:** A shippable, polished game live on Vercel.

**Tasks:**
1. **Responsiveness:** Ensure the game is usable at 768px+ width. Desktop-first is fine; just prevent layout breakage on tablets.
2. **Keyboard support:**
   - Enter = submit guess (if all slots filled)
   - Escape = deselect current color
3. **Visual polish:**
   - Brief flash/pulse animation when feedback is revealed
   - "Peg drop" animation when a color is placed in a slot (CSS transform)
   - Scanline flicker on screen transitions
4. **Error safety:** Ensure the game never crashes on edge cases (submitting with empty slots, etc.)
5. **Build verification:** Run `npm run build` — resolve all errors until it exits with code 0
6. **Deploy to Vercel:**
   - `git init && git add . && git commit -m "Initial release"`
   - Push to GitHub and connect to Vercel, or use `vercel --prod` CLI
   - Confirm the live URL works end-to-end
7. **README.md:** Write a short README with:
   - 2–3 sentence game description
   - How to run locally (`npm install && npm run dev`)
   - How to deploy to Vercel

**Deliverable:** Live Vercel URL. Game fully playable in production.
