import { ImageSlot } from "@/components/ImageSlot";
import { LakeMark } from "@/components/LakeMark";
import type { ImageRef } from "@/lib/content";

type Props = {
  title: string;
  eyebrow?: string | null;
  subtitle?: string | null;
  image?: ImageRef;
  video?: { src: string | null; poster: string | null };
  /** Where the lake mark sits relative to the title (Home has it below, inner pages above). */
  markPosition?: "above" | "below";
  /** Short label for the image placeholder while assets are missing. */
  imageLabel?: string;
  /** Live H1 sizes: Home 63px, inner pages 58px, Team 54px. */
  size?: "home" | "page" | "compact";
  /** Live subtitles: 30px medium (Values, News), 34px bold (Investments), 28px bold (Criteria). */
  subtitleWeight?: "medium" | "bold" | "bold-sm";
  children?: React.ReactNode;
};

/** Full-bleed photo/video hero with the lake mark and the curved bottom edge. */
export function PageHero({ title, eyebrow, subtitle, image, video, markPosition = "above", imageLabel, size = "page", subtitleWeight = "medium", children }: Props) {
  const mark = <LakeMark className="size-20 drop-shadow-lg sm:size-26" />;
  return (
    <section className="relative isolate flex min-h-[min(56rem,92svh)] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-36 text-center text-white sm:pb-44">
      <div className="absolute inset-0 -z-10">
        {video?.src ? (
          <video className="size-full object-cover motion-reduce:hidden" autoPlay muted loop playsInline poster={video.poster ?? undefined} aria-hidden="true">
            <source src={video.src} type="video/mp4" />
          </video>
        ) : null}
        <ImageSlot image={video?.poster ? { src: video.poster, alt: "" } : (image ?? { src: null })} label={imageLabel} sizes="100vw" priority className={`size-full ${video?.src ? "motion-safe:hidden" : ""}`} />
        {/* Overlay keeps white text at AA contrast on bright skies */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.15)_0%,rgb(0_0_0/0.35)_60%,rgb(0_0_0/0.1)_100%)]" />
      </div>

      <div className="flex max-w-6xl flex-col items-center gap-6">
        {markPosition === "above" ? mark : null}
        {eyebrow ? <p className="text-sm font-semibold tracking-[0.2em] uppercase [text-shadow:0_2px_6px_rgb(0_0_0/0.5)] sm:text-base">{eyebrow}</p> : null}
        <h1 className={`${size === "home" ? "type-hero-home" : "type-hero"} ${size === "compact" ? "text-[clamp(2.125rem,1.2rem+3vw,3.375rem)]" : ""} text-balance`}>{title}</h1>
        {subtitle ? (
          <p
            className={`max-w-4xl leading-tight [text-shadow:0_2px_6px_rgb(0_0_0/0.5)] ${{ bold: "text-[clamp(1.375rem,0.95rem+1.4vw,2.125rem)] font-bold", "bold-sm": "text-[clamp(1.25rem,0.95rem+1vw,1.75rem)] font-bold", medium: "text-[clamp(1.25rem,0.9rem+1.1vw,1.875rem)] font-medium" }[subtitleWeight]}`}
          >
            {subtitle}
          </p>
        ) : null}
        {markPosition === "below" ? mark : null}
        {children}
      </div>

      {/* Curved bottom edge with the translucent grey swoosh from the live site */}
      <svg className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-28 lg:h-36" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 Q720 300 1440 0 V160 H0 Z" fill="rgb(255 255 255 / 0.45)" />
        <path d="M0 18 Q720 300 1440 18 V160 H0 Z" fill="#fff" />
      </svg>
    </section>
  );
}
