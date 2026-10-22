# Open items

Updated after extracting the live site (21 Oct 2026).

## Client decisions

Content rule (from the user): where sources conflict, the 2026 messaging platform wins. Form delivery questions are on hold.
1. **Criteria wording.** Aligned with the messaging platform: deal-by-deal intro, thresholds shown as "typically $2M+ EBITDA and $8M+ revenue", platform voice for Shared Values. The proposed update ($3M–$6M EBITDA etc.) is not published.
2. RESOLVED: the $6M revenue gate is removed from the form (platform: no investment formula).
3. RESOLVED: "Start a conversation" goes to the contact form on /investors/ (the email link did nothing without a desktop mail app).
4. **Where form inquiries go** (recipient address) and an email service (Resend API key + verified sender).
5. **Founder process steps** and **case-study multiples** (Set Solutions 16x, Spinnaker SCA 32x, A5 22x): publish or leave out.
6. **Sales sheet and deck PDFs** (2025 v7.2) say $50M+ founder value and predate 18 transactions, so they conflict with the platform. Hidden from the menu until updated PDFs are supplied (old links still work).
7. **Landing pages** /blc-tech-landing-page/ and /blc-investor-landing-page/: still used in campaigns? Currently redirected (temporary).
8. **Terms and Conditions / Cookie Policy:** shown as plain text in the live footer, but the pages don't exist. Supply text or leave them out (current).
9. **Company LinkedIn URL:** the live footer icons are unlinked theme defaults.
10. **Phone on the live News page** reads 303-327-9701; everywhere else (720) 770-0079 (used).
11. **News feed** includes 162 portfolio-company posts, many AI-themed. CLAUDE.md says not to make AI a selling point. Keep all (current), filter, or drop?
12. **Innovatix** card links to macrosoftinc.com (as on the live site). Confirm.
13. **Aaron Nack:** updated headshot and LinkedIn (the live ones are used for now).
14. RESOLVED: official vector logo found in Drive and in use.
15. **Michael Doyle's comment** on the messaging platform (more hard-hitting facts, "deal of the year"): needs approved facts before anything is added.

See also docs/slack-drive-review.md (competitor-site feedback, criteria sources, launch checklist).

## From the competitor redesign (22 Oct)
- **High-res originals:** the site uses the 1600px WordPress images (there are no larger originals on WordPress). The Drive "Client Media Review/Images" and "Video" folders hold the originals, but this environment's network policy blocks Drive downloads. Allow `drive.google.com` and `drive.usercontent.google.com`, or add the files to the repo.
- Approve the "How we partner" step names and the FAQ questions.
- Podcast cover art (optional), to replace the waveform graphic.

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
- Unknown URLs that match the post route render the 404 page with noindex but can return HTTP 200 (partial prerendering). Fine for SEO.
