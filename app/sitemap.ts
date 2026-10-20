import type { MetadataRoute } from "next";
import { getLocalPosts, site } from "@/lib/content";

const PAGES = ["/", "/investments/", "/investors/", "/criteria/", "/team/", "/values/", "/news/", "/terms-and-conditions/", "/cookie-policy/", "/privacy-policy/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  const posts = getLocalPosts()
    .filter((p) => p.body)
    .map((p) => `/news/${p.slug}/`);
  return [...PAGES, ...posts].map((path) => ({ url: new URL(path, base).href }));
}
