# Redirect map

From the live sitemap (`content/_source/inventory.md`, extracted 21 Oct 2026). Redirects live in `next.config.ts`.

## URLs kept exactly as they are

| URL | Page |
| --- | --- |
| / | Home |
| /investing/ | Investments |
| /investors/ | Investors (contact form; "Contact Us" in the menu) |
| /investment-criteria/ | Criteria |
| /team/ | Team |
| /values/ | Values |
| /newspage/ | News |
| /privacy-policy/ | Privacy Policy |
| /&lt;post-slug&gt;/ | All 170 posts keep their WordPress URL |

URLs without a trailing slash 308-redirect to the slash version, as WordPress does.

## New URLs

| URL | What |
| --- | --- |
| /newspage/black-lake/, /a5/, /trapp/, /macrosoft/, /spinnaker/, /omco-sumo/ | All posts from one company (replaces the old per-company feed pages) |
| /downloads/UPDATED-2025-*.pdf | Sales sheet and sales deck (were under /wp-content/uploads/2025/10/) |

## Redirects (permanent unless noted)

| Old URL | Goes to | Why |
| --- | --- | --- |
| /home-option/, /mytry/, /test/, /slide-anything-popup-preview/ | / | Draft/test pages |
| /thank-you/ | /investors/ | Old form confirmation page; the new form confirms in place |
| /blc-tech-landing-page/ | / (temporary) | Landing page outside the menu. **Confirm whether campaigns still use it** |
| /blc-investor-landing-page/ | /investors/ (temporary) | Same |
| /news-4/, /new-news/, /blogs/ | /newspage/ | Old or duplicate News pages |
| /black-lake-capital-posts/ | /newspage/black-lake/ | Per-company feed page |
| /a5-corp-posts/, /a5-2/, /a5-corporation | /newspage/a5/ | Feed pages and the old Investments "Learn More" link |
| /trapp-posts/, /trapp-technology | /newspage/trapp/ | Same |
| /macrosoft-post/, /macrosoft-2/ | /newspage/macrosoft/ | Same |
| /spinnaker-posts/, /spinnakersca/, /spinnaker-sca | /newspage/spinnaker/ | Same |
| /ocmo-sumo-posts/, /omcosumo/ | /newspage/omco-sumo/ | Same |
| /setsolutions-2/, /set-solutions | /investing/ | Set Solutions has no posts |
| /testimonial/* (12 posts) | /#testimonials | Testimonials now live in the carousel only |
| /category/*, /author/*, /tag/*, /page/N/ | /newspage/ | WordPress archives |
| /feed/ | /newspage/ | RSS feed (footer icon); no feed on the new site |
| /wp-content/uploads/2025/10/UPDATED-2025-*.pdf | /downloads/… | Keeps links in old emails working |

## Not redirected

- `/terms-and-conditions/` and `/cookie-policy/` already return 404 on the live site.
- Other `/wp-content/uploads/` files (post images) are not redirected; every image the new site uses is served locally.
