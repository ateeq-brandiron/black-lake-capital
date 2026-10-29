import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { isLive } from "@/lib/env";

/** Only the live site is indexable; Vercel staging and previews are not. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  if (!isLive) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
