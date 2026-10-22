import Image from "next/image";
import { ArrowRightIcon } from "@/components/Icons";

export type MediaItem = {
  kind: string;
  title: string;
  body: string | null;
  href: string;
  cta: string;
  image: { src: string; alt: string; width: number; height: number } | null;
};

/** Podcasts, recognition and interviews. External links open in a new tab. */
export function MediaCards({ items }: { items: MediaItem[] }) {
  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {items.map((m) => {
        const external = m.href.startsWith("http");
        return (
          <li key={m.href} className="reveal card-lift group relative flex flex-col overflow-hidden rounded-card border border-navy/10 bg-white">
            <div className="relative aspect-[16/9] overflow-hidden bg-navy">
              {m.image ? (
                <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                // Podcast artwork is not available; a waveform stands in.
                <svg viewBox="0 0 320 180" className="size-full" aria-hidden="true">
                  <rect width="320" height="180" fill="#0b274c" />
                  {Array.from({ length: 29 }, (_, i) => {
                    const h = 18 + Math.round(Math.abs(Math.sin(i * 0.9) * 60 + Math.cos(i * 0.37) * 22));
                    return <rect key={i} x={20 + i * 10} y={90 - h / 2} width="5" height={h} rx="2.5" fill={i % 3 ? "#deeeff" : "#1e60ad"} opacity="0.85" />;
                  })}
                </svg>
              )}
            </div>
            <div className="flex flex-1 flex-col p-7">
              <p className="type-eyebrow text-xs!">{m.kind}</p>
              <h3 className="mt-3 text-xl leading-snug font-bold text-ink">{m.title}</h3>
              {m.body ? <p className="mt-3">{m.body}</p> : null}
              <a
                href={m.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener" : undefined}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-navy after:absolute after:inset-0 hover:text-blue"
              >
                {m.cta}
                <span className="sr-only">: {m.title}{external ? " (opens in a new tab)" : ""}</span>
                <ArrowRightIcon className="size-5" />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
