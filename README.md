# Break It: Code

A customizable Mastermind-inspired logic puzzle game. Crack the hidden color sequence before your attempts run out.

**Stack:** React + Vite · Plain CSS · No external game libraries

**Live:** [break-it-code.vercel.app](https://break-it-code.vercel.app/)

---

## Play

Configure your difficulty (slots, colors, duplicates, feedback mode, time attack), then deduce the secret code from feedback pegs:

- **Black peg** — right color, right position
- **White peg** — right color, wrong position
- **Limited mode** — only shows total correct colors, no position info

Use the **CLEAR** button to wipe the active row and start it over. Score is based on efficiency (fewer guesses = higher score), difficulty settings, and time bonuses.

Fully playable on desktop and mobile browsers.

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Build & Deploy

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

Deploy to Vercel: connect the repo to [vercel.com](https://vercel.com) for automatic deploys on push, or run `npx vercel` from the project root.
