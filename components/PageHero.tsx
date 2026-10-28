import { ImageSlot } from "@/components/ImageSlot";
import { LakeMark } from "@/components/LakeMark";
import type { ImageRef } from "@/lib/content";

type Props = {
  title: string;
  eyebrow?: string | null;
  subtitle?: string | null;
  image?: ImageRef;
  /** srcMobile: a lighter 720p encode for phones (served via <source media>). */
  video?: { src: string | null; srcMobile?: string | null; poster: string | null };
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
    <section className="relative isolate flex min-h-[min(56rem,92svh)] flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-36 text-center text-white sm:pb-44">
      {/* Media stops 4px short of the bottom edge: the curve covers it, and it keeps a video hairline from showing under the curve at fractional zoom levels */}
      <div className="absolute inset-x-0 top-0 bottom-1 -z-10">
        {video?.src ? (
          <video className="size-full object-cover motion-reduce:hidden" autoPlay muted loop playsInline poster={video.poster ?? undefined} aria-hidden="true">
            {video.srcMobile ? <source src={video.srcMobile} type="video/mp4" media="(max-width: 767px)" /> : null}
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

      {/* Fine line-art ridge over the photo */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-14 h-28 w-full opacity-60 sm:bottom-24 sm:h-44 lg:bottom-28" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 170 L120 120 L190 140 L320 60 L410 115 L470 95 L600 20 L700 105 L760 80 L880 130 L980 50 L1080 120 L1160 90 L1290 140 L1440 85" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <path d="M0 185 L150 150 L260 165 L380 110 L520 160 L640 100 L760 150 L900 120 L1040 165 L1180 125 L1320 160 L1440 140" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Curved bottom edge: the live site's double-transparency divider (30% and 50% white bands over solid white) */}
      <svg className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-28 lg:h-[149px]" viewBox="0 0 1280 140" preserveAspectRatio="none" aria-hidden="true">
        <g fill="#fff">
          <path d="M725.29 101.2C325.22 122.48 0 0 0 0v140h1280V0s-154.64 79.92-554.71 101.2z" fillOpacity="0.3" />
          <path d="M556.45 119.74C953.41 140 1280 14 1280 14v126H0V0s159.5 99.48 556.45 119.74z" fillOpacity="0.5" />
          <path d="M640 140c353.46 0 640-140 640-139v140H0V0s286.54 140 640 140z" />
        </g>
      </svg>
    </section>
  );
}
