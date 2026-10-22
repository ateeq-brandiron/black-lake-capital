# Slack (#blc-black-lake-capital) and Drive review — 22 Oct 2026

## Applied to the site
- **Official vector logo** (Drive: BLC_logo_Stacked_svg4000x2785.svg, 2024) → `public/images/brand/lake-mark.svg`, `app/icon.svg`, `app/apple-icon.png` (180px). Replaces the 164px PNG.
- **A5 is an exit**: acquired by Accordion (Drive: "BLC April 2026 Press Release", approved per Slack 21 Apr 2026). Investments now shows A5 as Completed.
- **Imported posts checked for the 2025–26 WordPress compromise** (re-added users, spam CTA posts, fake Cloudflare "verify" prompt): no scripts, iframes, hidden content or suspicious domains in any of the 170 posts; all outbound links go to portfolio sites, BLC's ActiveCampaign links, or reputable sources.

## Key dates (10/19/26 client agenda)
- Website internal QC: Oct 19–23. **Client review with Chad: Mon Oct 26.** Revisions Oct 26–30. Outbound email/LinkedIn launch early–mid Nov alongside the site.

## Decisions needed (found in Slack/Drive)
1. **Chad's competitor-site feedback** (Drive: "Competitor Websites.docx"; Slack 19 Oct) asks for a people-first hero, values up front, a business-owner section with a simple process and criteria snapshot (Southstone: "conversation and fit, transparent diligence, seamless transition"), case studies as stories, a **media section for podcasts/news**, testimonials at the bottom of the landing page (Source Capital), blurred exited investments (Canopy). The 10/19 deck says to incorporate this "competitor-site feedback". CLAUDE.md says keep the current structure and ask before adding sections. These are new sections/scope.
2. **Criteria numbers** now have three newer sources: 2026 Ideal Acquisitions Profile (Aug 2026): "typically $10M+ revenue and ~$1M+ EBITDA"; April 2026 press release: "$2M to $12M in annual cash flow"; CLAUDE.md proposal: EBITDA $3M–$6M, revenue $10M–$40M. Site shows the live "$2M+ EBITDA / $8M+ revenue". Pick one.
3. **Hard-hitting facts** (Michael Doyle's platform comment): Drive shows Charles Scripps was named **Independent Sponsor of the Year** (2025 press release quote) and the A5 deal included a **Salesforce Ventures** investment and three add-on acquisitions. Not in the messaging platform; add only with approval.
4. **A5 press release as a News post?** The release has a "[Date]" placeholder; confirm the publish date before posting it.
5. **Podcast**: Chad on "PE Insight Series – Deal Risks" (Apple Podcasts). A media section would be new scope (see 1).
6. **Landing pages**: Drive "Landing Pages/Investor LP" and "Tech LP" (2024 copy) match /blc-investor-landing-page/ and /blc-tech-landing-page/. Currently redirected; rebuild only if campaigns still use them.

## Launch checklist items from Slack
- **Email/DNS**: domain DNS is at Hostinger; mail is Google Workspace (MX records fixed July 2026). When pointing blacklakecap.com to Vercel, change only the web records (A/CNAME); keep MX, SPF and other mail records exactly as they are.
- **Search Console**: verification was failing via the GTM method because the old GTM snippet was misplaced (May 2026). The new site outputs the GTM snippet correctly and the verification meta tag; re-run verification after launch, then review the "Blocked due to other 4xx" indexing errors.
- **Security**: a WordPress admin password was posted in the channel on 17 Jun 2026. Rotate it and delete the message. Keep WordPress locked down while it remains the fallback.

## Assets available in Drive (not used yet)
- High-resolution originals of the landscape photos (Client Media Review/Images, 2–4 MB each) and stock hero videos (Client Media Review/Video). The site uses the live 1600px versions; originals can replace them for sharper high-density displays.
- Logo variants: white text, white outline, stacked, horizontal (SVG/AI/EPS/PNG); portfolio logos incl. OMCO SUMO SVG, Accelogix.
