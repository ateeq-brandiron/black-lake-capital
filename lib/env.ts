/**
 * True only on the live site (blacklakecap.com, hosted on Hostinger), where SITE_ENV=production
 * must be set for the build. Everywhere else (Vercel staging, local) the site is noindex and
 * Tag Manager stays off. Read at build time, so changing it needs a rebuild.
 */
export const isLive = process.env.SITE_ENV === "production";
