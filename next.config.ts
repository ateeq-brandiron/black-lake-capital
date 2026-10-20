import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress URLs end in a slash (/criteria/); keep them identical.
  trailingSlash: true,
  cacheComponents: true,
  partialPrefetching: true,
  // WordPress URLs with no page of their own on the new site. See docs/redirect-map.md.
  // PROVISIONAL until the sitemap is extracted.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/contact", destination: "/investors/", permanent: true },
      { source: "/contact-us", destination: "/investors/", permanent: true },
      { source: "/feed", destination: "/news/", permanent: true },
      { source: "/news/page/:n", destination: "/news/", permanent: true },
      { source: "/blog", destination: "/news/", permanent: true },
      { source: "/author/:slug*", destination: "/news/", permanent: true },
      { source: "/category/:slug*", destination: "/news/", permanent: true },
      { source: "/tag/:slug*", destination: "/news/", permanent: true },
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
