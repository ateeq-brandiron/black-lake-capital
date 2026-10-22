import site from "@/content/site.json";
import stats from "@/content/stats.json";
import testimonials from "@/content/testimonials.json";
import newsJson from "@/content/news.json";
import home from "@/content/pages/home.json";
import differentiators from "@/content/differentiators.json";
import portfolio from "@/content/portfolio.json";
import team from "@/content/team.json";
import storiesJson from "@/content/stories.json";
import mediaJson from "@/content/media.json";

export { site, home, differentiators, portfolio, team };

export type StatKey = keyof typeof stats;

export type ImageRef = { src: string | null; alt?: string; note?: string };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  company: string;
  companyUrl?: string;
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
  featuredImage?: { src: string; alt: string; width: number; height: number } | null;
  categories?: string[];
  /** Sanitized HTML (scripts/import-posts.py). */
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

/** Posts hosted on this site (all imported WordPress posts), newest first. */
export function getLocalPosts() {
  const local = new Set(news.sources.filter((s) => s.local).map((s) => s.id));
  // Some builder-made posts are only a featured image (e.g. a press clipping), with no body text.
  return news.posts.filter((p) => local.has(p.source) && (p.body || p.featuredImage));
}

export function getPost(slug: string) {
  return getLocalPosts().find((p) => p.slug === slug);
}

export function getSource(id: string) {
  return news.sources.find((s) => s.id === id);
}

/** WordPress posts live at the site root: /<slug>/. */
export function postPath(slug: string) {
  return `/${slug}/`;
}

/** "April 17, 2023", or "Apr 17, 2023" for the post meta line (as on the live site). */
export function formatDate(iso: string, style: "long" | "short" = "long") {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: style, day: "numeric" });
}

/** Path for a page that exists in content/pages, e.g. "criteria" -> "/criteria/". */
export function pagePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}/`;
}

/** Exit stories with their testimonial quote attached. */
export function getStories() {
  const quotes = getTestimonials();
  return {
    title: storiesJson.title,
    lead: storiesJson.lead as string | null,
    items: storiesJson.items.map(({ testimonial, ...story }) => ({ ...story, quote: quotes.find((t) => t.id === testimonial) })),
  };
}

/** Media items; "image" names a post whose featured image is used. */
export function getMedia() {
  return {
    title: mediaJson.title,
    items: mediaJson.items.map((m) => ({ ...m, image: (m.image && news.posts.find((p) => p.slug === m.image)?.featuredImage) || null })),
  };
}
