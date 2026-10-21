import type { MetadataRoute } from "next";
import { getLocalPosts, news, postPath, site } from "@/lib/content";

const PAGES = ["/", "/investing/", "/investors/", "/investment-criteria/", "/team/", "/values/", "/newspage/", "/privacy-policy/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  const listings = [...PAGES, ...news.sources.map((s) => `/newspage/${s.id}/`)].map((path) => ({ url: new URL(path, base).href }));
  const posts = getLocalPosts().map((p) => ({ url: new URL(postPath(p.slug), base).href, lastModified: p.date ?? undefined }));
  return [...listings, ...posts];
}
