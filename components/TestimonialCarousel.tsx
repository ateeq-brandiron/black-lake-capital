"use client";

import { useState } from "react";
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

/**
 * One testimonial at a time with dot navigation, as on the live site.
 * No autoplay: rotating content needs a pause control under WCAG 2.2.2, and manual is calmer.
 * Without JS the first testimonial shows.
 */
export function TestimonialCarousel({ title, items, background, titleSize = "large" }: Props) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  return (
    <section id="testimonials" className="relative isolate overflow-hidden bg-blue-deep py-(--spacing-section) text-white" aria-roledescription="carousel" aria-labelledby="testimonials-title">
      {background ? <div className="absolute inset-0 -z-10">{background}</div> : null}
      <div className="container-wide">
        <h2
          id="testimonials-title"
          className={`text-center font-bold text-balance ${titleSize === "large" ? "text-[clamp(2rem,0.9rem+3.35vw,3.75rem)] leading-[1.3]" : "text-[1.625rem] leading-tight uppercase"}`}
        >
          {title}
        </h2>
        <div className="mt-14 grid">
          {items.map((t, i) => (
            <figure
              key={t.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              hidden={i !== index}
              className="col-start-1 row-start-1 grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16"
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
              <blockquote className="relative order-1 pl-12 font-quote text-lg leading-[1.05] font-normal md:order-2">
                <span className="absolute top-0 left-0 font-numeral text-6xl leading-none text-white/80" aria-hidden="true">
                  &ldquo;
                </span>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
            </figure>
          ))}
        </div>
        {items.length > 1 ? (
          <div className="mt-12 flex justify-center gap-1">
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
          </div>
        ) : null}
      </div>
    </section>
  );
}
