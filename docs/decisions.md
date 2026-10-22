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

## Remaining pages (initial draft)

23. **Hero CTA on every page** (CLAUDE.md: "a CTA in the hero ... on every page"). On Investors the form is the hero's action.
24. **Investors keeps the top bar** for consistency (the live page hides it).
25. **Contact form** runs on a server action: validation, honeypot and a 3-second time trap (skipped for no-JS submissions so real leads aren't dropped). It sends through the Resend REST API with no SDK, and only when `EMAIL_PROVIDER=resend`. The default logs and sends nothing.
26. **Differentiators** are one content file shared by Values and Investors, so the two pages can't drift apart.
27. **Criteria toggles** without known body text render as plain rows instead of empty expanders.
28. **Team stats**: the broken AUM ("NaN") is left out, so the block shows two numbers.
29. **Investments "Learn More"** links and expand text are not rebuilt (targets unknown); the company website link stays.
30. **Redirects** for common WordPress paths are in `next.config.ts` (see `docs/redirect-map.md`).

## After extracting the live site (21 Oct 2026)

31. **Live URLs kept:** /investing/, /investment-criteria/, /newspage/, and every post at /<slug>/. My earlier guesses (/investments/, /criteria/, /news/) were dropped.
32. **All 170 posts imported** (8 Black Lake, 162 portfolio-company copies) with sanitized HTML, local WebP images (max 1200px), and per-company listings at /newspage/<company>/. Builder-made posts with no body show their featured image (as on the live site).
33. **Criteria** show the live wording and toggle text. The proposed new criteria stay unpublished until approved.
34. **Home expanders** keep the messaging-platform text; the live text ("you continue to steer...") leans on the rejected "control" framing.
35. **Testimonials:** the 8 unique quotes from the live carousel, with names, companies, links and logos. The 12 testimonial posts redirect to the carousel.
36. **Team stats:** 150+ years, $80B+ AUM (the live counter's "NaN"), and the transaction count.
37. **Serif font** corrected to Quattrocento (from the live CSS).
38. **Official logo mark** (164px PNG) replaces my SVG redraw. The divider mark stays an SVG.
39. **Tracking:** the live GTM container and Search Console token, loaded on production only.
40. **Terms and Cookie Policy** dropped from the footer: the live pages don't exist.
41. **"Learn More"** on Investments goes to the company's posts (/newspage/<company>/); Set Solutions has none.

## Platform alignment pass (22 Oct 2026)

42. **The 2026 messaging platform wins every content conflict.** Testimonials stay verbatim (client quotes).
43. Removed the form's "$6M revenue" gate ("The Deal Should Fit the Business").
44. Criteria: platform intro (no "equity recapitalizations" / "middle-market" jargon), thresholds framed as "typically", Strong Management Teams and Shared Values in platform language, subtitle "Is Black Lake the right fit for your business?"
45. Stat labels: "Transactions completed / Across seven platforms" (Home, Investors, Team).
46. Home approach sub-labels are the platform's differentiator headings.
47. Investments intro, Team "Built for agility", Investors form heading and Home meta description reworded to platform language.

## Competitor-site "modern touch" (22 Oct 2026, Chad's feedback)

Source: Drive "Competitor Websites.docx" and Slack (19 Oct). Brand colours, fonts, URLs and the four CTA positions are unchanged.

48. **Header:** a sticky bar with the logo, the five main sections (Appian Way), and "Start a conversation". The hamburger drawer stays below 1024px and still lists every page.
49. **Hero:** a fine line-art ridge over the photo (Astria).
50. **Values up front** (Georgia Oak / LP First / Southstone overlap): an "Our vision" block with the platform Vision and a two-circle diagram (your operating expertise + our investment experience and resources = shared success). All text is platform wording.
51. **Business-owner section** (Southstone): "How we partner", three steps next to a "What we look for" criteria snapshot. **The step names are draft** and are flagged as unconfirmed on staging; the step text is platform copy.
52. **Founder FAQ** on Criteria (#faq). The questions are ours; every answer is platform text.
53. **Exit stories** (Third Century "Your success is our story"): Set Solutions, SpinnakerSCA and A5, using facts from the exit posts or press release and the published testimonials. No multiples. Shown on Home and on Investments (#stories).
54. **Partners teaser** on Home (people-first), plus an **In the media** section (podcast, Axial 2025, Opus Connect) on Home and News. No podcast artwork is available, so a waveform graphic stands in.
55. **Home logo strip** scrolls as on the live site; logos are muted until hover. The "Exited" tags (Canopy) were removed at Ateeq's request (22 Oct); exits show as "Completed" on Investments.
56. **Testimonials stay at the bottom** of Home (Source Capital).
57. **Modern finish:**
    - Cards with hover lift.
    - CSS-only scroll reveal (`.reveal`, scroll-driven animations). Content is visible without JS, in older browsers, and with reduced motion.
