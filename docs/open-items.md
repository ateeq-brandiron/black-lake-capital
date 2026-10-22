# Open items

Updated after extracting the live site (21 Oct 2026).

## Client decisions
1. **Criteria wording.** The site shows the live wording ("$2M+ in EBITDA and $8M+ in Revenue"). The proposed update (EBITDA $3M–$6M, floor ~$1.5M, revenue $10M–$40M, 4–12 years, US/Canada, technology distribution and implementation) is not approved for publication yet.
2. **Contact form revenue question** says $6M (live form). Criteria say $8M+. Align?
3. RESOLVED: "Start a conversation" goes to the contact form on /investors/ (the email link did nothing without a desktop mail app).
4. **Where form inquiries go** (recipient address) and an email service (Resend API key + verified sender).
5. **Founder process steps** and **case-study multiples** (Set Solutions 16x, Spinnaker SCA 32x, A5 22x): publish or leave out.
6. **Sales sheet and deck PDFs** (menu downloads) are the 2025 v7.2 files. They may still say 15 transactions; the site now says 18 (messaging platform).
7. **Landing pages** /blc-tech-landing-page/ and /blc-investor-landing-page/: still used in campaigns? Currently redirected (temporary).
8. **Terms and Conditions / Cookie Policy:** shown as plain text in the live footer, but the pages don't exist. Supply text or leave them out (current).
9. **Company LinkedIn URL:** the live footer icons are unlinked theme defaults.
10. **Phone on the live News page** reads 303-327-9701; everywhere else (720) 770-0079 (used).
11. **News feed** includes 162 portfolio-company posts, many AI-themed. CLAUDE.md says not to make AI a selling point. Keep all (current), filter, or drop?
12. **Innovatix** card links to macrosoftinc.com (as on the live site). Confirm.
13. **Aaron Nack:** updated headshot and LinkedIn (the live ones are used for now).
14. **Vector logo:** only a 164px PNG exists on the live site. An SVG would be sharper on high-density screens.
15. **Michael Doyle's comment** on the messaging platform (more hard-hitting facts, "deal of the year"): needs approved facts before anything is added.

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
