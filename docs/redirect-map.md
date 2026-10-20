# Redirect map

PROVISIONAL: built from the screenshots and common WordPress paths. Re-check against `content/_source/inventory.md` after `npm run extract`, and add a row for every old URL that changes.

## URLs kept as-is (no redirect)

| Old URL | New route |
| --- | --- |
| / | / |
| /investments/ | /investments/ |
| /investors/ | /investors/ |
| /criteria/ | /criteria/ |
| /team/ | /team/ |
| /values/ | /values/ |
| /news/ | /news/ |
| /terms-and-conditions/ | /terms-and-conditions/ (path unverified) |
| /cookie-policy/ | /cookie-policy/ (path unverified) |
| /privacy-policy/ | /privacy-policy/ (path unverified) |

Paths without a trailing slash (e.g. `/criteria`) 308-redirect to the slash version, as WordPress does.

## Redirects (in `next.config.ts`, all permanent)

| Old URL | Redirects to | Why |
| --- | --- | --- |
| /home | / | Common WordPress duplicate of the front page |
| /contact, /contact-us | /investors/ | The contact form lives on Investors ("Contact Us" in the menu) |
| /feed | /news/ | RSS feed (footer RSS icon); no feed on the new site |
| /news/page/:n | /news/ | WordPress pagination; the new listing is one page |
| /blog | /news/ | Common alias |
| /author/*, /category/*, /tag/* | /news/ | WordPress archives |

## To confirm after extraction

- **Black Lake's own posts**: the new URL is `/news/<slug>/`. If WordPress serves them elsewhere (e.g. `/<slug>/` or `/2024/05/<slug>/`), add one redirect per post.
- **Portfolio-company posts** on the News page link out to their own sites and have no local URL.
- **The two "Download Our Summary" PDFs** under `/wp-content/uploads/...`: copy them to `public/` and redirect the old paths, or the links in old emails break.
- Any page found in the sitemap that is not in the menu.
