# Open items

Updated after extracting the live site (21 Oct 2026).

## Client decisions

Content rule (from the user): where sources conflict, the 2026 messaging platform wins. Form delivery questions are on hold.

**22 Oct:** per Ateeq, every open question below stays as currently built unless the messaging platform changes. The platform was last edited 19 Oct and is already applied, so nothing changed.
1. RESOLVED (27 Oct): criteria now show "$10M+ revenue, around $2M+ EBITDA" (approved at the 25 Aug BrandStorm; $1.5M floor is internal). Previously: **Criteria wording.** Aligned with the messaging platform: deal-by-deal intro, thresholds shown as "typically $2M+ EBITDA and $8M+ revenue", platform voice for Shared Values. The proposed update ($3M–$6M EBITDA etc.) is not published.
2. RESOLVED: the $6M revenue gate is removed from the form (platform: no investment formula).
3. RESOLVED: "Start a conversation" goes to the contact form on /investors/ (the email link did nothing without a desktop mail app).
4. **Where form inquiries go** (recipient address) and an email service (Resend API key + verified sender).
5. **Founder process steps** and **case-study multiples** (Set Solutions 16x, Spinnaker SCA 32x, A5 22x): publish or leave out.
6. **Sales sheet and deck PDFs** (2025 v7.2) say $50M+ founder value and predate 18 transactions, so they conflict with the platform. Hidden from the menu until updated PDFs are supplied (old links still work).
7. **Landing pages** /blc-tech-landing-page/ and /blc-investor-landing-page/: still used in campaigns? Currently redirected (temporary).
8. **Terms and Conditions / Cookie Policy:** shown as plain text in the live footer, but the pages don't exist. Supply text or leave them out (current).
9. RESOLVED (27 Oct): company LinkedIn https://www.linkedin.com/company/blacklakecap/ in the footer and the Organization structured data.
10. **Phone on the live News page** reads 303-327-9701; everywhere else (720) 770-0079 (used).
11. **News feed** includes 162 portfolio-company posts, many AI-themed. CLAUDE.md says not to make AI a selling point. Keep all (current), filter, or drop?
12. RESOLVED (23 Oct): Macrosoft rebranded as **Innovatix Technology Partners** (Drive press release, 20 Aug 2025): card renamed, website innovatixinc.com, location Bedminster, NJ (release dateline; live card said Parsippany).
13. RESOLVED (27 Oct): Aaron Nack headshot updated (1080px).
14. RESOLVED: official vector logo found in Drive and in use.
15. PARTLY RESOLVED (23 Oct): the 2025 **Independent Sponsor of the Year** press release (Drive, distributed via EIN Presswire 17 Apr 2025) is now a News post and media card. **Michael Doyle's comment** on the messaging platform (more hard-hitting facts, "deal of the year"): needs approved facts before anything is added.

See also docs/slack-drive-review.md (competitor-site feedback, criteria sources, launch checklist).

## From the competitor redesign (22 Oct)
- **High-res originals (done 22 Oct):** the Criteria, Investments, News and Team heroes now use the 2000px Drive originals ("Client Media Review/Images"; WordPress had 1600px). Those originals are only 2000px. Still 1600px: Investors hero and testimonial background (not in Drive). The Video folder holds watermarked stock previews and the 4K clips; the Home hero video is already 4K.
- **Headshots:** using the live website's photos (per Ateeq, 22 Oct). Chad's is now the full 1600×2400 live upload. RESOLVED (27 Oct): Aaron's photo is now the 1080px headshot from Drive.
- RESOLVED (22 Oct): "How we partner" step names and FAQ questions kept as is.
- Podcast cover art (optional), to replace the waveform graphic.
- **Axial Top 20 Independent Sponsors 2026** (added 22–23 Oct from Chad's email via Katrina): post and media card now use the email's Axial cover (featured image) and closed-deals chart (in the post). The email's decorative lake photo is not used. Still missing: a direct link to Axial's ranking article (the email only has tracking links), so "Axial" links to axial.net.

## Resolved by the extraction
- All images, hero video, logos, icons, headshots, treeline art, official logo mark, favicon.
- All 8 carousel testimonials with names, companies and logos.
- Criteria toggle text, Home expander text (replaced by messaging platform copy), Investments "Since 2013".
- Team AUM: stored as "$80B+" (the live counter shows NaN).
- Team LinkedIn URLs for all five people.
- GTM container GTM-ND3Z87WN and Search Console token.
- Full sitemap and redirect map (`docs/redirect-map.md`).
- Live meta: titles are generic ("Team|Black Lake Capital | Welcome") and no page has a meta description, so the new titles and descriptions replace them.

## Technical
- RESOLVED (22 Oct): unknown URLs now return a real HTTP 404 with a branded not-found page (`proxy.ts`).

## Document sweep (23 Oct)
- Added: 2025 Independent Sponsor of the Year post with award photos (Drive Press Release folder).
- A5 story card now uses the approved April 2026 press release facts (Ramsey Solutions, Cloudware Connections, SnapBI add-ons; Salesforce Ventures investment). The release itself is not posted: its date is still "[Date]" and no distribution record was found.
- Removed 3 imported Macrosoft-feed posts that Katrina flagged as spam in March 2026 (Chad: "I did not post them"); their URLs now return 404.
- Media cards: Axial 2026, Sponsor of the Year 2025, podcast, Axial 2025 (Opus Connect stays in News).

## Answers doc follow-up (28 Oct)
- A5 press release: published 23 Apr 2026 ([EIN Presswire](https://www.einpresswire.com/article/907526001/black-lake-capital-announces-successful-exit-of-a5-through-acquisition-by-accordion)). Now a News post; the A5 success-story card links to it.
- Landing pages: not used by current campaigns (Ahmad). The redirects (tech → Home, investor → /investors/) are now permanent. /investors/ is the page to use for future campaigns; it already carries the platform messaging and the US/Canada technology ICP questions.
- Contact form → ActiveCampaign: BUILT (29 Oct). Inquiries are submitted to the existing ActiveCampaign form 2 (embed code from Ateeq), so its list, tags and notifications apply; no API key. The $6M revenue question (field 31) is no longer sent. Needs one real test submission after launch. The login in the answers doc should be removed and its password changed.

## Hosting (29 Oct)
- Vercel is staging only. The live site (blacklakecap.com) will be hosted on **Hostinger**, so "live" no longer depends on Vercel: `SITE_ENV=production` (set at build time on Hostinger) makes the site indexable and loads Tag Manager. Vercel staging is now `noindex` with no analytics (it was indexable before).
- The Hostinger plan must run Node.js apps (the form, 404 handling and redirects run on the server); plain static or PHP-only hosting will not work. See README → Hosting.
