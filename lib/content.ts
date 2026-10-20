import site from "@/content/site.json";
import stats from "@/content/stats.json";
import testimonials from "@/content/testimonials.json";
import newsJson from "@/content/news.json";
import home from "@/content/pages/home.json";

export { site, home };

export type StatKey = keyof typeof stats;

export type ImageRef = { src: string | null; alt?: string; note?: string };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  company: string;
  logo: ImageRef;
};

export type NewsSource = { id: string; name: string; logo: ImageRef; local: boolean };

export type NewsPost = {
  slug: string;
  source: string;
  title: string;
  author: string;
  date: string | null;
  /** External URL for portfolio-company posts. */
  url: string | null;
  excerpt: string | null;
  body: string | null;
};

export const news = newsJson as { sources: NewsSource[]; posts: NewsPost[] };

/** Show review markers for unconfirmed values (set NEXT_PUBLIC_SHOW_REVIEW_FLAGS=false at launch). */
export const showReviewFlags = process.env.NEXT_PUBLIC_SHOW_REVIEW_FLAGS !== "false";

export function getStat(key: StatKey) {
  return stats[key];
}

/** Replaces {statKey} placeholders in copy with the value from content/stats.json. */
export function fillStats(text: string) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in stats ? stats[key as StatKey].value : match));
}

/** Testimonials with a quote. Entries still waiting for extraction are skipped. */
export function getTestimonials(): Testimonial[] {
  return testimonials.items.filter((t): t is typeof t & { quote: string } => Boolean(t.quote));
}

export function getLocalPosts() {
  const local = new Set(news.sources.filter((s) => s.local).map((s) => s.id));
  return news.posts.filter((p) => local.has(p.source));
}

/** Path for a page that exists in content/pages, e.g. "criteria" -> "/criteria/". */
export function pagePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}/`;
}
