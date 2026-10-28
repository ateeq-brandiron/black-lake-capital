"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1600; // ms

/** Splits "$60M+" into prefix "$", number 60, suffix "M+" (decimals kept, e.g. "3.5x"). */
function parse(value: string) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], target: Number(m[2]), decimals: m[2].split(".")[1]?.length ?? 0, suffix: m[3] };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts a stat up from zero the first time it scrolls into view, like the live site.
 * The server renders the final value (no JS, crawlers, reduced motion all see the real number);
 * an invisible copy of the final value reserves the width so nothing shifts while it counts.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const parts = parse(value);
    const el = ref.current;
    if (!parts || parts.target === 0 || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const format = (n: number) => `${parts.prefix}${n.toFixed(parts.decimals)}${parts.suffix}`;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        setShown(format(parts.target * easeOut(t)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.6 },
    );
    // Start from zero only when the number is not already on screen, so nothing flickers above the fold.
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) setShown(format(0));
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="invisible" aria-hidden="true">
        {value}
      </span>
      <span className="absolute inset-0 text-center" aria-hidden="true">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
