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
    // A click starts a fresh navigation: clear a flag left by a back/forward that only changed the #hash.
    const onClick = () => {
      fromHistory.current = false;
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
