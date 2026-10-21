# Design tokens

Tokens live in `app/tokens.css` (Tailwind 4 `@theme`, which replaces `tailwind.config.js`).

**Source:** live CSS (`content/_source/css/`, extracted 21 Oct 2026), cross-checked with the screenshots. The sampled values were confirmed: navy `#2e3b54` (CSS also uses `#2e3c54` and `#2d3b53`), blue `#1e60ad`, stat numerals `#165fac`.

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
| Stat numerals | "a light serif" | **Quattrocento** 72px, `#165fac` | Confirmed in the live CSS (number counters). |
| Other fonts on the live site | (none) | Lato, Merriweather (old landing pages), Century Gothic (testimonials) | Folded into Montserrat for a tighter type hierarchy. |
