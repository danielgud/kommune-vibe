# Kommune Flip – Copilot Instructions

A Norwegian municipality (kommune) card game site. UI text is in Norwegian throughout.

## Commands

```sh
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + build (tsc -b && vite build)
npm run lint      # ESLint with zero warnings allowed
npm run preview   # Preview production build
```

No test suite exists.

## Architecture

**Routing**: React Router v6 with `BrowserRouter`. Three routes:
- `/` → `src/pages/LandingPage.tsx` — game picker
- `/memory` → `src/pages/MemoryGame.tsx` — municipality memory card game
- `/battleship` → `src/components/battleship/Battleship.tsx` — battleship game

**Vercel deployment**: `vercel.json` rewrites all non-API paths to `/index.html` for SPA routing. `api/leaderboard.js` is a Vercel serverless function using `@vercel/kv` (Redis) for leaderboard storage, keyed by `leaderboard_${cardCount}`.

**Memory game** (`src/components/` + `src/pages/MemoryGame.tsx`):
- `MemoryGame.tsx` — state machine: SplashScreen → (TwoPlayerPrompt) → Game
- `Game.tsx` — all game logic: card flipping, match detection, scoring, timer, leaderboard
- `assets/kommuner.ts` — all Norwegian municipalities from Kartverket. Exports `Kommune` type (`{ navn, nr, image }`) and `randomKommuner(n)`. Cards match when `firstCard.image === secondCard.image`.
- `utils/storage.ts` — leaderboard I/O: writes localStorage immediately for instant feedback, then fire-and-forget to cloud API
- Valid card counts: 16, 20, 36, 64. `getColumnClass` map in `Game.tsx` must be updated for new counts.

**Battleship game** (`src/components/battleship/`):
- `Battleship.tsx` — game state machine: lobby → placing → pass → battle → finished
- `BattleshipLobby.tsx` — player name entry + room code UI stub (online multiplayer not yet implemented)
- `ShipPlacement.tsx` — 10×10 grid placement with hover preview, rotation, validation
- `BattleBoard.tsx` — dual 10×10 grids (own board + opponent's), click-to-shoot
- `PassDevice.tsx` — cover screen between turns for pass-and-play
- `types.ts` / `constants.ts` / `utils.ts` — shared types, ship definitions (5 ships), board helpers

**Pass-and-play multiplayer**: Online multiplayer is stubbed (room code shown, join disabled). Real-time play uses a "pass the device" flow — `PassDevice` covers the screen between turns.

## Key Conventions

**Tailwind**: Custom classes used throughout — `shadow-card`, `shadow-card-hover`, `ring-focus`, `bg-custom-radial`, `rotate-y-180`, `backface-hidden`, `animate-wiggle`, `animate-ray`, `animate-cloud`. All defined in `tailwind.config.js`. Use `classnames` package for conditional class application.

**Accessibility**: Use `aria-live="polite"` + `sr-only` for game announcements. Focus styles use `ring-focus` (yellow, `#ffdd00`).

**Norwegian**: All user-facing strings are in Norwegian (bokmål). Game/ship names: Hangarskip(5), Slagskip(4), Krysser(3), Ubåt(3), Destroyer(2).

