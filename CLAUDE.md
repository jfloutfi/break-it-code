# CLAUDE.md — Break It: Code

## Stack
React (functional components + hooks) · Vite · Plain CSS · No external game libraries · Vercel

## Key Files
- `src/utils/gameLogic.js` — pure game logic (code gen, guess evaluation, win detection)
- `src/utils/scoring.js` — scoring formula
- `src/hooks/useGameState.js` — central state via useReducer; all game state lives here
- `src/hooks/useTimer.js` — countdown timer for time attack mode
- `src/components/SetupScreen` — game configuration UI
- `src/components/GameBoard` — gameplay (rows, palette, submit)
- `src/components/EndScreen` — win/loss result

## Rules
- No class components. No inline styles. No external game libraries.
- All game logic must stay in pure utility functions in `src/utils/`.
- All state transitions go through `useGameState` reducer — no local state in game components.
- CSS variables defined in `src/index.css`. Follow the retro 80s arcade aesthetic.
- Comment all game logic functions (non-technical audience).
- Commit after each milestone.
