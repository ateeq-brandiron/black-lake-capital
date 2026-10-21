import type { NextConfig } from "next";

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
      { source: "/blc-tech-landing-page", destination: "/", permanent: false },
      { source: "/blc-investor-landing-page", destination: "/investors/", permanent: false },
      // Old News pages and per-company feeds
      news("/news-4"),
      news("/new-news"),
      news("/blogs"),
      news("/black-lake-capital-posts", "black-lake"),
      news("/a5-corp-posts", "a5"),
      news("/a5-2", "a5"),
      news("/trapp-posts", "trapp"),
      news("/macrosoft-post", "macrosoft"),
      news("/macrosoft-2", "macrosoft"),
      news("/spinnaker-posts", "spinnaker"),
      news("/spinnakersca", "spinnaker"),
      news("/ocmo-sumo-posts", "omco-sumo"),
      news("/omcosumo", "omco-sumo"),
      { source: "/setsolutions-2", destination: "/investing/", permanent: true },
      // Testimonial posts and the old "Learn More" short links
      { source: "/testimonial/:slug*", destination: "/#testimonials", permanent: true },
      news("/a5-corporation", "a5"),
      news("/spinnaker-sca", "spinnaker"),
      news("/trapp-technology", "trapp"),
      { source: "/set-solutions", destination: "/investing/", permanent: true },
      // WordPress archives and feeds
      news("/category/:slug*"),
      news("/author/:slug*"),
      news("/tag/:slug*"),
      news("/page/:n"),
      news("/feed"),
      { source: "/wp-content/uploads/2025/10/:file(UPDATED-2025-.*\\.pdf)", destination: "/downloads/:file", permanent: true },
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
