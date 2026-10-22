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

## Typography (measured on the live site at 1366px, 22 Oct 2026)

Computed styles of 223 matching text elements on 9 pages were compared live vs new; 221 match in font, size and weight. The two exceptions are deliberate: the Home H1 is now the platform tagline (the old "Investors in technology" headline is a small eyebrow), and one imported post shows a plain "Learn more" link instead of a button.

| Role | Live spec |
| --- | --- |
| Body, bios, posts, privacy | Montserrat 16px / 500 / 27px, #666; inline links navy #2e3c54 |
| Hero H1 | 58px / 700 / 1.3, uppercase (Home 63px, Team 54px) |
| Hero subtitle | 30px / 500 (Values, News); 34px / 700 (Investments); 28px / 700 (Criteria) |
| Section headings | 60px / 700 / 1.3 blue (Home stats 900); Team sections 46px; Advisory Board 54px / 800 |
| Stat numerals / labels / text | Quattrocento 80px #165fac / Montserrat 22px 500 #165fac / 21px 500 #6b6b6b |
| Intro line | 21px / 400 #6b6b6b, bold phrase 700 |
| Approach | label 22px / 600 black; sub-label 18px / 700 blue |
| Testimonials | Century Gothic 18px, line height ~1; title 60px (Investors 26px uppercase) |
| Investments cards | Lato: name 21px, text 18px / 27px; location black; links navy; "Learn More" 700 |
| Columns (Investors, Values) | heading 24px / 700 #0c71c3; text 15px / 27px black |
| Criteria | intro 24px / 400; toggles 22px / 500 #666 |
| Team cards | name 32px / 500 #333; role 16px #165fac; contact 16px navy, 88px icon rings |
| News cards | title 18px / 500 / 1.0 #333; "by" 16px; "read more" 16px navy (no date) |
| Post page | no hero; title 30px / 500 #333; meta 14px |
| Buttons | 20px / 500 |
| Menu | 20px / 400; top bar 12px / 600 |
| Footer | 16px / 500 / 27px; headings 18px / 600 blue |

Century Gothic is a licensed system font with no web version; the stack is "Century Gothic", AppleGothic, then Questrial (free, close match). Lato and Questrial load through next/font. Footer grey is #5c5c5c instead of the live #6b6b6b so it passes WCAG AA on #d9d9d9; form fields stay 44px tall for touch.
