import type { NextConfig } from "next";
import newsJson from "./content/news.json";

// News from completed (exited) investments is no longer listed (Chad's review); old links go to /newspage/.
const hiddenSources = new Set(newsJson.sources.filter((s) => !s.local).map((s) => s.id));
const hiddenPostRedirects = newsJson.posts
  .filter((p) => hiddenSources.has(p.source))
  .map((p) => ({ source: `/${p.slug}`, destination: "/newspage/", permanent: false }));

const nextConfig: NextConfig = {
  // WordPress URLs end in a slash (/criteria/); keep them identical.
  trailingSlash: true,
  cacheComponents: true,
  partialPrefetching: true,
  // Old WordPress URLs that have no page of their own on the new site. See docs/redirect-map.md.
  async redirects() {
    const news = (from: string, source?: string) => ({ source: from, destination: source ? `/newspage/${source}/` : "/newspage/", permanent: true });
    return [
      // Duplicate or draft pages
      { source: "/home-option", destination: "/", permanent: true },
      { source: "/mytry", destination: "/", permanent: true },
      { source: "/test", destination: "/", permanent: true },
      { source: "/slide-anything-popup-preview", destination: "/", permanent: true },
      { source: "/thank-you", destination: "/investors/", permanent: true },
      // Landing pages (not in the menu). PROVISIONAL: confirm whether campaigns still use them.
      { source: "/blc-tech-landing-page", destination: "/", permanent: true },
      { source: "/blc-investor-landing-page", destination: "/investors/", permanent: true },
      // Old News pages and per-company feeds
      news("/news-4"),
      news("/new-news"),
      news("/blogs"),
      news("/black-lake-capital-posts", "black-lake"),
      news("/a5-corp-posts"),
      news("/a5-2"),
      news("/trapp-posts", "trapp"),
      news("/macrosoft-post", "macrosoft"),
      news("/macrosoft-2", "macrosoft"),
      news("/spinnaker-posts"),
      news("/spinnakersca"),
      news("/ocmo-sumo-posts"),
      news("/omcosumo"),
      { source: "/setsolutions-2", destination: "/investing/", permanent: true },
      // Testimonial posts and the old "Learn More" short links
      { source: "/testimonial/:slug*", destination: "/#testimonials", permanent: true },
      news("/a5-corporation"),
      news("/spinnaker-sca"),
      news("/trapp-technology", "trapp"),
      { source: "/set-solutions", destination: "/investing/", permanent: true },
      // WordPress archives and feeds
      news("/category/:slug*"),
      news("/author/:slug*"),
      news("/tag/:slug*"),
      news("/page/:n"),
      news("/feed"),
      { source: "/wp-content/uploads/2025/10/:file(UPDATED-2025-.*\\.pdf)", destination: "/downloads/:file", permanent: true },
      // The company feeds and posts of completed investments
      ...[...hiddenSources].map((id) => ({ source: `/newspage/${id}`, destination: "/newspage/", permanent: false })),
      ...hiddenPostRedirects,
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
