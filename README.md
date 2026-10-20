# blacklakecap.com rebuild

Next.js (App Router, TypeScript, Tailwind CSS 4) rebuild of the WordPress site at blacklakecap.com. Project rules live in `CLAUDE.md` (kept as a Google Doc for now).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run build` | Production build |
| `npm run extract` | Read-only extraction of the live WordPress site (see below) |

## Folders

- `content/`: site copy as JSON/Markdown. Components never hard-code text.
- `content/_source/`: raw extraction from WordPress (inventory, per-page text, WP REST JSON, CSS, nav, testimonials, news).
- `public/images/`: images and the hero video from the live site, plus `manifest.json` (alt text, source URL, pages).
- `reference/`: full-page screenshots of the live site, one per page (`<slug>.png`).

## Extraction

`npm run extract` (or `node scripts/extract-wordpress.mjs --base https://blacklakecap.com`) reads the sitemap, crawls every page and post with headless Chromium, and writes everything listed at the top of the script. It only issues GET requests and blocks any other method from the page, so the live site is never changed. Existing screenshots in `reference/` are never overwritten.

Playwright is not a project dependency. The script uses the globally installed copy (`npm i -g playwright` if it is missing). Flags: `--no-screenshots`, `--no-media`.
