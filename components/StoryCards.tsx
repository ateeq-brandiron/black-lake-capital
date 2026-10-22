import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { ImageSlot } from "@/components/ImageSlot";
import type { ImageRef, Testimonial } from "@/lib/content";

export type Story = {
  id: string;
  company: string;
  sector: string;
  outcome: string;
  summary: string;
  logo: ImageRef;
  href: string;
  quote?: Testimonial;
};

/** Exit stories as cards: outcome, what happened, and the founder's own words. */
export function StoryCards({ stories, readMore = "Read the story" }: { stories: Story[]; readMore?: string }) {
  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {stories.map((s) => (
        <li key={s.id} className="reveal card-lift flex flex-col overflow-hidden rounded-card border border-navy/10 bg-white">
          <div className="flex h-32 items-center justify-center bg-sky/60 px-10">
            <ImageSlot image={s.logo} placeholder="light" fit="contain" sizes="260px" className="h-20 w-full bg-transparent! outline-0!" />
          </div>
          <div className="flex flex-1 flex-col p-7">
            <p className="inline-flex w-fit items-center rounded-full bg-navy px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">{s.outcome}</p>
            <h3 className="mt-4 text-2xl leading-tight font-bold text-ink">{s.company}</h3>
            <p className="mt-1 text-sm text-muted">{s.sector}</p>
            <p className="mt-4">{s.summary}</p>
            {s.quote ? (
              <blockquote className="mt-6 border-l-2 border-blue pl-4 font-quote text-[0.9375rem] leading-snug text-ink">
                <p>&ldquo;{s.quote.quote}&rdquo;</p>
                <footer className="mt-2 text-sm font-bold text-navy not-italic">
                  {s.quote.name}, {s.quote.company}
                </footer>
              </blockquote>
            ) : null}
            <Link href={s.href} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-semibold text-navy hover:text-blue">
              {readMore}
              <span className="sr-only">: {s.company}</span>
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
