# Open items

## Blocked on extraction (network access to blacklakecap.com)
- Sitemap / full page inventory (any pages not in the menu), exact URLs of legal pages.
- Meta titles and descriptions of every page (current ones in `content/pages/*.json` are provisional, `confirmed: false`).
- Exact CSS values and font names (`docs/design-tokens.md`).
- All images: hero video, page hero photos, portfolio logos, approach icons, team headshots, official logo SVG.
- All 10 carousel testimonials (only Trapp is visible; Third Century / Preston Moister quote text needed).
- News: post URLs, dates, excerpts, bodies; portfolio feed source.
- Company LinkedIn URL (footer), two "Download Our Summary" PDFs (menu), GA4 ID and Search Console token.
- Approach section expand/collapse text on the live Home page.

## Client decisions (CLAUDE.md open items, all `confirmed: false`)
- Transaction count: 15 / 16 / 18 (`content/stats.json`).
- Second-bite figure: $60M+ vs $60–65M (`content/stats.json`).
- Criteria public wording; founder process steps; case-study multiples.
- Aaron Nack headshot and LinkedIn.
- CTA target: mailto vs contact form.

## Found in the screenshots
- Team page shows "NaN" for assets under management (broken counter on the live site).
- News page footer shows a different phone number: 303-327-9701 (other pages: (720) 770-0079).
- Footer social icons differ by page: LinkedIn on Home/Investments/Investors, Facebook + X on Criteria/Team/Values/News.
- Footer quick links differ by page (Investors and Values missing on some).
- News feed includes AI-themed portfolio posts; CLAUDE.md says not to make AI a selling point. Keep, filter, or drop?
- Investors page form asks "at least $6M in revenue"; CLAUDE.md criteria say $10M–$40M revenue. Criteria page says "$2M+ in EBITDA and $8M+ in Revenue".
- Live copyright says © 2023.

## Technical
- Unknown `/news/<slug>/` URLs render the 404 page with `noindex` but return HTTP 200 (partial prerendering streams the status). Fine for SEO; revisit if a hard 404 is needed.
