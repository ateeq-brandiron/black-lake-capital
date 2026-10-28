"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Starts every newly opened page at the very top.
 *
 * Next.js only scrolls far enough to bring the new page's first element into view. With the
 * contact bar and sticky header above <main>, that left pages opening part-way down (the top
 * bar and the top of the hero hidden). This resets to 0 after each pathname change, except:
 * - links to a section (#hash): the browser/Next.js scroll to that section as before;
 * - browser back/forward: the browser restores the previous position as before.
 * A link to the page that is already open scrolls smoothly back to the top instead of doing nothing.
 * The jump is instant, so the global smooth scrolling does not animate it.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const fromHistory = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
    };
    const onClick = (e: MouseEvent) => {
      // A click starts a fresh navigation: clear a flag left by a back/forward that only changed the #hash.
      fromHistory.current = false;
      // A link to the page already open (footer, header, logo) would otherwise do nothing: scroll smoothly to the top.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? "instant" : "smooth" });
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
