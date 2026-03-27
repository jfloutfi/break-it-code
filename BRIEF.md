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

- Set up the project with a clean, well-organized folder structure
- Establish the global design system: CSS variables, fonts (Press Start 2P + Share Tech Mono from Google Fonts), dark background, and CRT scanline overlay
- Confirm the dev server runs with no errors

**Deliverable:** Running dev server showing a dark screen with the game title in pixel font.

---

### Milestone 2: Game Logic (Pure Functions)

**Goal:** All game rules coded and verified before any UI is built.

- Implement all core game logic as pure, well-commented utility functions: code generation, attempt calculation, guess evaluation (standard and limited feedback modes), and win detection
- Implement the scoring system: base score, efficiency multiplier, difficulty multiplier, and time bonus
- Verify all logic is correct before touching any UI

**Deliverable:** Game logic and scoring fully implemented and verified correct.

---

### Milestone 3: State Management

**Goal:** A central game state hook that drives the entire app.

- Design and implement a state management approach that cleanly handles all game phases: setup, gameplay, and end
- State should cover: current screen, settings, secret code, submitted guesses with feedback, active guess, attempt tracking, time bonus, result, and final score
- All state transitions should be predictable and bug-free

**Deliverable:** State management fully implemented and wired to the game logic utilities.

---

### Milestone 4: Setup Screen

**Goal:** A fully functional, styled Setup Screen.

- Render the game logo with neon glow and a subtitle
- Controls for all five settings: slots (3–6), colors (4–8), duplicates toggle, feedback mode toggle, time attack options
- Live attempt count that updates as settings change
- START GAME button that kicks off the game
- Full retro arcade styling throughout

**Deliverable:** Complete styled Setup Screen. Clicking START transitions to the game.

---

### Milestone 5: Game Board

**Goal:** The core gameplay screen — board, palette, and submit button.

- A game board showing all attempt rows, with clear visual distinction between active, submitted, and upcoming rows
- Color palette for selecting and placing colors into slots
- Feedback display after each submission (standard: black/white pegs; limited: count only)
- Attempt counter, live score, SUBMIT button (active only when all slots filled), and GIVE UP button

**Deliverable:** Fully playable game board. Players can guess, receive feedback, and reach a win or loss state.

---

### Milestone 6: Time Attack

**Goal:** Per-guess countdown timer (only active when time attack is enabled in settings).

- Visible countdown per guess row (bar + numeric display)
- Auto-submit or skip row on expiry
- Time bonus awarded when player submits with time to spare
- Timer resets cleanly on each new row

**Deliverable:** Working time attack mode. Timer visible, functional, and bonus correctly applied.

---

### Milestone 7: End Screen

**Goal:** Win and loss screens with score display.

- Win state: celebratory message with neon glow
- Lose state: failure message in a dimmer tone
- Both states: reveal the secret code, show score breakdown, show attempts used, and a PLAY AGAIN button
- Entrance animation on screen appear

**Deliverable:** Complete End Screen for both win and loss outcomes.

---

### Milestone 8: Polish & Deployment

**Goal:** A shippable, polished game live on Vercel.

- Responsive layout usable at 768px+ width
- Keyboard shortcuts: Enter to submit, Escape to deselect color
- Micro-animations: feedback reveal, peg placement, screen transitions
- Edge case safety: no crashes or broken states under any interaction
- Clean production build with zero errors
- Deployed to Vercel and confirmed working end-to-end
- Short README with game description, local dev instructions, and deploy steps

**Deliverable:** Live Vercel URL. Game fully playable in production.

---

## Before You Start

Before writing any code, follow these instructions:

- Maintain an internal task list and keep it updated as you complete each step.
- The Git repository is already set up. Commit after completing each task.
- Maintain a `CLAUDE.md` file with your core instructions. Keep it short and straight to the point.
- You are a product designer with a PhD in human-computer interaction, and a super senior principal engineer building architecture that scales and is bug-free. Design and build accordingly.
