import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocalPosts, news } from "@/lib/content";

/**
 * Real 404 status for unknown top-level URLs.
 *
 * Posts live at /<slug>/ and company news at /newspage/<company>/, so unknown URLs there reach a dynamic route. With Cache
 * Components an unknown slug streams the not-found page with a 200 status (a "soft 404").
 * Unknown slugs are rewritten to a path no route matches, which Next.js answers with the
 * not-found page and a 404. Old WordPress URLs are redirected in next.config.ts first.
 */
const PAGES = new Set(["investing", "investment-criteria", "investors", "team", "values", "newspage", "privacy-policy"]);
const POSTS = new Set(getLocalPosts().map((p) => p.slug));
const SOURCES = new Set(news.sources.map((s) => s.id));

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/|\/$/g, "");
  const [first, second] = path.split("/");
  const known = second === undefined ? PAGES.has(first) || POSTS.has(first) || first.startsWith("_next") : first === "newspage" && SOURCES.has(second);
  if (known) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found-page/404/", request.url));
}

// Single-segment paths and /newspage/<company>/, without a file extension (assets).
export const config = {
  matcher: ["/:slug([^/.]+)", "/newspage/:source([^/.]+)"],
};
