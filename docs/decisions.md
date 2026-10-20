# Decisions (shared layout + Home)

1. **Screenshots moved** from `public/images/blc-*.png` to `reference/<page>.png` so they are not served publicly.
2. **Tokens from pixels, not CSS**: the live site is blocked in the build environment. See `docs/design-tokens.md`.
3. **Fonts**: Montserrat everywhere, Arapey for stat numerals. Century Gothic and Lato from the live site are dropped.
4. **Trailing slashes kept** (`trailingSlash: true`) so every URL matches WordPress (`/criteria/`). `/criteria` 308-redirects to `/criteria/`.
5. **Menu**: the hamburger + slide-in drawer is kept (no visible desktop nav, same as live). The header stays fixed in the top right. The drawer closes with Escape and returns focus.
6. **"Contact Us"** in the menu points to `/investors/`, which holds the live contact form.
7. **Primary CTA** "Start a conversation" is a mailto to info@BlackLakeCap.com until the client picks mailto or the form. One field in `content/site.json` changes every CTA.
8. **CTA placement on Home**: hero, after the stats, after the approach section, closing band. Every other page gets the closing band (`CtaBand`).
9. **Closing band** is a new section (CLAUDE.md requires it on every page). It uses the sign-off "Your Vision. Your People. Your Success." with "You don't have to carry it alone."
10. **Home hero**: the H1 is now the tagline. "Investors in technology" (the old H1) stays as a small eyebrow so the technology focus is mentioned in passing.
11. **Home intro** line replaced with the elevator pitch.
12. **Stats**: second-bite now reads $60M+ (unconfirmed). The approved 3.5x proof point sits under it as the italic line. The old italic lines were dropped because they did not match the approved wording.
13. **Approach section**: heading is the value proposition. The three approved differentiators sit behind Foundation / Strategy / Execution (expandable, native `<details>`, works without JS). The mapping is a proposal.
14. **Testimonials**: manual dots only, no autoplay (WCAG 2.2.2). Entries without quote text are hidden.
15. **Accessibility tweaks**: footer text darkened from #6b6b6b to #333 (the live grey fails AA on #d9d9d9). Hero overlay keeps white text readable. 44px tap targets. Skip link.
16. **Placeholders**: missing images render a labelled gradient ("Image pending: ...") at the right size. Logos render as text.
17. **Lake mark** is a temporary SVG redraw until the official file is extracted.
18. **Unconfirmed values** show a dotted amber underline with a tooltip while `NEXT_PUBLIC_SHOW_REVIEW_FLAGS` is not `false`.
19. **News**: the listing keeps the live four-column layout (one column per source). Black Lake posts use `/news/<slug>/`; portfolio posts link out. Titles and bylines are seeded from the screenshot.
20. **Legal pages** created at WordPress default paths so footer links don't 404; the paths and text are unverified.
21. **Not built**: the "back to top" buttons, the logo carousel arrows (static row for now), and the Spotify embed on News (it shows "not available in your region" in the screenshot).
22. **No dependencies added** beyond the Next.js starter. GA4 loads via `next/script` from `NEXT_PUBLIC_GA_MEASUREMENT_ID`; Search Console via `GOOGLE_SITE_VERIFICATION`.
