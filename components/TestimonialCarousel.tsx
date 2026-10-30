"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/Icons";
import { ImageSlot } from "@/components/ImageSlot";
import type { Testimonial } from "@/lib/content";

type Props = {
  title: string;
  /** Live: 60px on Home ("Success stories..."), 26px uppercase on Investors ("What our partners say"). */
  titleSize?: "large" | "small";
  items: Testimonial[];
  /** Optional background photo (Investors uses a night sky); otherwise the brand blue band. */
  background?: React.ReactNode;
};

const INTERVAL_MS = 7000;
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * One testimonial at a time, as on the live site: it advances on its own (live: every 4s; 7s here
 * so the longer quotes can be read), with previous/next arrows, dots and swipe.
 * Autoplay runs only while the carousel is on screen, pauses on hover or keyboard focus, has a
 * pause button (WCAG 2.2.2) and is off for reduced motion. Without JS the first testimonial shows.
 */
export function TestimonialCarousel({ title, items, background, titleSize = "large" }: Props) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  // null until the visitor presses pause/play; until then autoplay follows the motion setting.
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reducedMotion;
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const count = items.length;
  const go = (i: number) => setIndex((i + count) % count);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rotating = playing && !held && inView && count > 1;
  useEffect(() => {
    if (!rotating) return;
    // Restarts after every change, so a manual step gets a full interval too.
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, index, count]);

  if (!count) return null;
  return (
    <section
      ref={section}
      id="testimonials"
      className="relative isolate overflow-hidden bg-blue-deep py-(--spacing-section) text-white"
      aria-roledescription="carousel"
      aria-labelledby="testimonials-title"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      {background ? <div className="absolute inset-0 -z-10">{background}</div> : null}
      <div className="container-wide">
        <h2
          id="testimonials-title"
          className={`text-center font-bold text-balance ${titleSize === "large" ? "text-[clamp(2rem,0.9rem+3.35vw,3.75rem)] leading-[1.3]" : "text-[1.625rem] leading-tight uppercase"}`}
        >
          {title}
        </h2>
        <div
          className="mt-14 grid"
          aria-live={rotating ? "off" : "polite"}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          }}
        >
          {items.map((t, i) => (
            <figure
              key={t.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className={`col-start-1 row-start-1 grid items-start gap-8 transition-opacity duration-500 motion-reduce:transition-none md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              <figcaption className="order-2 flex flex-col items-center md:order-1 md:items-start md:pl-[10%]">
                <ImageSlot image={t.logo} placeholder="light" fit="contain" sizes="240px" className="mb-4 h-24 w-60 bg-white/0" />
                <span className="font-quote text-lg leading-tight font-bold uppercase">{t.name}</span>
                {t.companyUrl ? (
                  <a href={t.companyUrl} target="_blank" rel="noopener" className="inline-block py-1 font-quote text-lg leading-tight font-normal uppercase hover:underline">
                    {t.company}
                  </a>
                ) : (
                  <span className="font-quote text-lg leading-tight font-normal uppercase">{t.company}</span>
                )}
              </figcaption>
              <blockquote className="relative order-1 pl-12 font-quote text-lg leading-relaxed font-normal md:order-2">
                <span className="absolute top-0 left-0 font-numeral text-6xl leading-none text-white/80" aria-hidden="true">
                  &ldquo;
                </span>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
            </figure>
          ))}
        </div>
        {count > 1 ? (
          <div className="mt-12 flex items-center justify-center gap-1">
            <button type="button" onClick={() => go(index - 1)} className="flex size-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white">
              <ChevronLeftIcon className="size-6" />
              <span className="sr-only">Previous testimonial</span>
            </button>
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className="group flex size-11 items-center justify-center"
              >
                <span className="sr-only">Show testimonial {i + 1}</span>
                <span className="size-2.5 rounded-full bg-white/60 group-hover:bg-white group-aria-[current=true]:bg-white group-aria-[current=true]:ring-2 group-aria-[current=true]:ring-white/50" />
              </button>
            ))}
            <button type="button" onClick={() => go(index + 1)} className="flex size-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white">
              <ChevronRightIcon className="size-6" />
              <span className="sr-only">Next testimonial</span>
            </button>
            <button
              type="button"
              onClick={() => setChoice(!playing)}
              className="ml-2 flex size-11 items-center justify-center rounded-full border border-white/40 text-white/80 hover:bg-white/10 hover:text-white"
            >
              {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
              <span className="sr-only">{playing ? "Pause testimonials" : "Play testimonials"}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
