# Design tokens

Tokens live in `app/tokens.css` (Tailwind 4 `@theme`, which replaces `tailwind.config.js`).

**Source:** pixel-sampled from `/reference/*.png` (1366px wide). The live CSS could not be read because this build environment blocks blacklakecap.com. Re-check against `content/_source/css/` after `npm run extract`.

## Differences from the approximate tokens in CLAUDE.md

| Token | CLAUDE.md | Sampled | Note |
| --- | --- | --- | --- |
| Brand blue | `#1d5fb0` | `#1e60ad` | Close (within 3 steps). Headings, numerals, testimonial band. |
| Navy | `#262d4a` | `#2e3b54` | Noticeably lighter and bluer. Top bar, menu drawer, buttons, lake mark top half. |
| Light blue band | `#e3effc` | `#deeeff` | Slightly more saturated. |
| Footer | "dark footer navy" | `#d9d9d9` light grey + `#171717` bottom bar | The footer is light grey on every page, not navy. |
| Deep navy | (none) | `#0b274c` | Stat band on Investors. |
| Charcoal | (none) | `#373536` | Lake mark bottom half. |
| Text | (none) | `#333333` headings, `#6b6b6b` body | |
| Headings/body font | Montserrat | Montserrat | Confirmed visually. |
| Stat numerals | "a light serif" | Arapey (closest Google match) | Visual match only; confirm the font name in the live CSS. |
| Other fonts on the live site | (none) | Century Gothic (testimonials), Lato (Investments cards) | Folded into Montserrat for a tighter type hierarchy. |
