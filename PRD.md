# Break It: Code — Product Requirements Document

**Version:** 2.1
**Date:** March 28, 2026
**Stack:** React + Vite · Deployed on Vercel  
**Aesthetic:** Retro 80s Arcade

---

## 1. Overview

**Break It: Code** is a single-player, browser-based logic puzzle game inspired by the classic board game Mastermind. The player must deduce a hidden sequence of colored pegs within a limited number of attempts, using feedback from each guess to narrow down the answer. The game is fully configurable so players can design their own challenge level.

**One-line pitch:** Break It: Code is a customizable logic puzzle game where players design their own challenge and try to crack the hidden sequence efficiently.

---

## 2. Goals

- Deliver a fully playable, polished browser game with no external dependencies
- Give players meaningful control over difficulty via settings
- Reward strategic play through a scoring system
- Deploy publicly via Vercel within one day

---

## 3. User Flows

### Flow 1: Setup Screen

The player lands on the Setup Screen and configures their game before starting.

**Configurable settings:**

| Setting | Options | Default |
|---|---|---|
| Number of slots | 3, 4, 5, or 6 | 4 |
| Number of colors | 4, 5, 6, 7, or 8 | 6 |
| Allow duplicate colors | Yes / No | No |
| Feedback mode | Standard (positional) / Limited (count only) | Standard |
| Time attack | Off / 15s / 30s / 45s per guess | Off |

**Auto-calculated attempts:** The game calculates a fair number of attempts based on settings. The formula should make the game winnable but not trivial:

- Base: `Math.ceil(slots * 1.5 + 2)`
- +2 if duplicates are allowed
- +2 if feedback mode is limited
- +1 for 45s time attack · +2 for 30s · +3 for 15s (faster = harder = more attempts)
- +1 for 6 colors · +2 for 7–8 colors (more colors = larger search space)
- Cap between 6 and 15

**Setup screen elements:**
- Game logo/title ("BREAK IT: CODE")
- Each setting rendered as a labeled control (buttons or toggle)
- Live preview showing "You get X attempts" as settings change
- A prominent START button

---

### Flow 2: Gameplay Screen

The player makes guesses and receives feedback.

**Board layout:**
- Rows = one per allowed attempt (e.g., 10 rows for 10 attempts)
- Each row has: slot circles (for the current guess) + feedback pegs (shown after submission)
- Active row is highlighted; submitted rows are locked and dimmed slightly
- A color palette at the bottom lets the player pick colors to place in slots

**Interaction:**
- Click a color from the palette → click any slot to place or replace it
- Click a filled slot with no color selected to clear it
- Click an empty slot with no color selected → a "PICK A COLOR FIRST!" hint flashes
- A SUBMIT button activates only when all slots are filled
- A CLEAR button wipes all slots in the active row instantly
- After submission, feedback is shown for that row and the next row activates

**Feedback display — Standard mode:**
- Black peg = correct color, correct position
- White peg = correct color, wrong position
- Empty = not in code at all
- Pegs are displayed without revealing *which slot* they correspond to (classic rules)

**Feedback display — Limited mode:**
- Only shows a number: total correct colors regardless of position
- No positional information

**Time attack (if enabled):**
- Countdown bottle timer visible per guess (vertical on desktop, horizontal pill on mobile)
- If time runs out and the row is full, it auto-submits
- If time runs out and the row is incomplete, the attempt is burned — no feedback, red ! shown
- Timer resets (refills) on each new row

**UI elements:**
- Attempt counter: "Attempt 3 of 10"
- Score tracker (live, updates after each guess)
- GIVE UP button (triggers end screen with loss state)

---

### Flow 3: End Screen

Shown on win or loss.

**Win state:**
- "YOU CRACKED IT!" message
- Show the secret code (revealed)
- Show final score with full breakdown: performance (guesses used of max), difficulty settings (code length, color pool, duplicates, feedback mode), subtotal, time bonus, total — no raw multipliers or formula notation shown to the player
- Play Again button (returns to Setup Screen)

**Lose state:**
- "CODE UNBROKEN" or "YOU GAVE UP" message
- Reveal the secret code
- Score shown as 0 if player gave up; otherwise shows what score would have been
- Play Again button

---

## 4. Scoring System

All scoring is calculated client-side with no backend needed.

| Component | Formula |
|---|---|
| Base score | `1000` |
| Efficiency multiplier | `(maxAttempts - attemptsUsed + 1) / maxAttempts` |
| Difficulty multiplier | `(slots × colors) / 24 × 1.25 if duplicates × 1.25 if limited feedback` |
| Time bonus | `+50 per attempt where >50% time remained · +25 where >25% remained · else 0` |
| Final score | `Base × Efficiency × Difficulty + TimeBonus` (rounded to nearest integer) |

---

## 5. Visual Design

**Aesthetic:** Retro 80s Arcade

**Palette:**
- Background: very dark navy/black (`#0a0a1a`)
- Primary accent: neon yellow-green (`#b8ff00`) or hot pink (`#ff0080`) — alternate per element
- Secondary accent: electric cyan (`#00ffff`)
- Text: off-white (`#f0f0e0`)
- Inactive/locked rows: desaturated dark gray

**Typography:**
- Headlines: "Press Start 2P" (Google Fonts) — pixel/blocky
- Body/labels: "Share Tech Mono" or "Courier Prime" (Google Fonts) — clean monospace

**UI details:**
- CRT scanline overlay effect (subtle CSS `repeating-linear-gradient`)
- Color pegs rendered as glowing circles with neon CSS `box-shadow`
- Feedback pegs rendered as small circles (black/white/empty) inside a grid
- Button hover states: slight scale + glow shift
- Screen transitions: fast pixel-dissolve or scanline-wipe (CSS animation)

**Game colors (8 pegs):**

| # | Color | Hex |
|---|---|---|
| 1 | Red | `#ff3333` |
| 2 | Blue | `#3399ff` |
| 3 | Yellow | `#ffee00` |
| 4 | Green | `#33ff66` |
| 5 | Orange | `#ff8800` |
| 6 | Purple | `#cc33ff` |
| 7 | Cyan | `#00ffee` |
| 8 | Pink | `#ff66aa` |

---

## 6. Technical Requirements

- **Framework:** React (functional components + hooks)
- **Bundler:** Vite
- **No backend:** All logic runs in the browser, no API calls
- **No external game libraries:** Pure React + CSS
- **Fonts:** Loaded from Google Fonts
- **State management:** React `useState` / `useReducer` — no Redux needed
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics + Speed Insights (injected via `@vercel/analytics` and `@vercel/speed-insights`)
- **Browser support:** Modern browsers only (Chrome, Firefox, Safari, Edge) — desktop and mobile
- **Responsive:** Fully playable on desktop and mobile browsers

---

## 7. Out of Scope (v2)

- Multiplayer or leaderboards
- Sound effects or music
- Account creation or score persistence
- Accessibility (ARIA) — nice to have but not required
