import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { ImageSlot } from "@/components/ImageSlot";
import { ArrowRightIcon, ChevronDownIcon, LinkedInIcon } from "@/components/Icons";
import { MediaCards } from "@/components/MediaCards";
import { PageHero } from "@/components/PageHero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { RichText } from "@/components/RichText";
import { StatBlock } from "@/components/StatBlock";
import { StoryCards } from "@/components/StoryCards";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { VisionVenn } from "@/components/VisionVenn";
import criteriaPage from "@/content/pages/investment-criteria.json";
import { getMedia, getStories, getTestimonials, home, team } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(home.meta, "/");

export default function HomePage() {
  const { hero, logoStrip, intro, vision, stats, approach, process, testimonials, closing } = home;
  const stories = getStories();
  const media = getMedia();
  return (
    <>
      <PageHero title={hero.title} eyebrow={hero.eyebrow} video={hero.video} image={hero.image} markPosition="below" size="home">
        <CtaButton variant="light" className="mt-2" />
      </PageHero>

      {/* Portfolio logo strip: scrolls continuously as on the live site (static with reduced motion) */}
      <section className="marquee mt-[clamp(2.5rem,0.5rem+7.5vw,7rem)] overflow-hidden bg-sky py-12" aria-label={logoStrip.label}>
        {/* Four copies so half the track is wider than any screen; the track slides by half and loops seamlessly */}
        <ul className="marquee-track flex w-max items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {[0, 1, 2, 3].flatMap((copy) =>
            logoStrip.logos.map((logo) => (
              <li key={`${copy}-${logo.name}`} aria-hidden={copy > 0 || undefined} className={`flex w-60 shrink-0 items-center px-6 motion-reduce:w-40 sm:motion-reduce:w-60 ${copy > 0 ? "motion-reduce:hidden" : ""}`}>
                <Link
                  href="/investing/"
                  tabIndex={copy > 0 ? -1 : undefined}
                  className="flex h-24 w-full items-center justify-center"
                >
                  {logo.src ? (
                    <ImageSlot image={{ src: logo.src, alt: copy > 0 ? "" : logo.name }} placeholder="light" fit="contain" sizes="240px" className="h-24 w-full bg-transparent! outline-0!" />
                  ) : (
                    <span className="text-2xl font-semibold text-navy/70">{logo.name}</span>
                  )}
                </Link>
              </li>
            )),
          )}
        </ul>
      </section>

      {/* Intro: elevator pitch */}
      <section className="pt-16">
        <Divider wide />
        <div className="container-page reveal mt-14 text-center">
          <p className="text-lead mx-auto max-w-4xl font-normal text-body-soft">
            <RichText text={intro.lead} />
          </p>
          <p className="text-lead mx-auto mt-4 max-w-4xl font-normal text-body-soft">{intro.body}</p>
        </div>
      </section>

      {/* Values up front */}
      <VisionVenn {...vision} />

      {/* Proof points */}
      <section className="pb-(--spacing-section)" aria-labelledby="stats-title">
        <div className="container-wide reveal">
          <h2 id="stats-title" className="type-display mx-auto max-w-5xl text-center font-black uppercase text-balance">
            {stats.title}
          </h2>
          <div className="mt-16">
            <StatBlock items={stats.items} />
          </div>
          <div className="mt-14 flex justify-center">
            <CtaButton />
          </div>
        </div>
      </section>

      {/* Approach: Foundation / Strategy / Execution */}
      <section className="pb-(--spacing-section)" aria-labelledby="approach-title">
        <Divider wide />
        <div className="container-wide mt-16">
          <h2 id="approach-title" className="type-display mx-auto max-w-4xl text-center text-balance">
            {approach.title}
          </h2>
          <ul className="mt-16 grid gap-8 md:grid-cols-3">
            {approach.items.map((item) => (
              <li key={item.label} className="reveal card-lift flex flex-col items-center rounded-card border border-navy/10 bg-white px-6 py-10 text-center">
                <ImageSlot image={item.icon} placeholder="light" fit="contain" sizes="180px" className="size-36 bg-transparent! outline-0!" />
                <h3 className="mt-6 text-[1.375rem] leading-tight font-semibold text-black uppercase">{item.label}</h3>
                <details className="group mt-5 w-full max-w-sm">
                  <summary className="mx-auto flex min-h-11 w-fit cursor-pointer list-none items-center gap-3 text-lg leading-tight font-bold text-blue [&::-webkit-details-marker]:hidden">
                    {item.summary}
                    <ChevronDownIcon className="size-6 rounded-full border-2 border-current p-0.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4">{item.body}</p>
                </details>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex justify-center">
            <CtaButton />
          </div>
        </div>
      </section>

      {/* For business owners: process + criteria snapshot */}
      <ProcessSteps
        eyebrow={process.eyebrow}
        title={process.title}
        steps={process.steps}
        confirmed={process.confirmed}
        note={process.note}
        criteriaTitle={process.criteriaTitle}
        criteria={criteriaPage.criteria.items.slice(0, process.criteriaCount)}
        criteriaLink={process.criteriaLink}
      />

      {/* Exit stories */}
      <section className="bg-sky/40 py-(--spacing-section)" aria-labelledby="stories-title">
        <div className="container-wide">
          <h2 id="stories-title" className="type-display mx-auto max-w-4xl text-center text-balance">
            {stories.title}
          </h2>
          <div className="mt-14">
            <StoryCards stories={stories.items} />
          </div>
          <div className="mt-12 flex justify-center">
            <Link href={home.stories.href} className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold text-navy hover:text-blue">
              {home.stories.cta}
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-(--spacing-section)" aria-labelledby="team-title">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div className="reveal">
            <h2 id="team-title" className="type-display-sm text-balance">
              {home.team.title}
            </h2>
            <p className="mt-5 text-lg">{home.team.body}</p>
            <Link href="/team/" className="mt-6 inline-flex min-h-11 items-center gap-2 text-lg font-semibold text-navy hover:text-blue">
              {home.team.cta}
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2">
            {team.partners.map((p) => (
              <li key={p.name} className="reveal card-lift group overflow-hidden rounded-card border border-navy/10 bg-white">
                <ImageSlot image={p.photo} sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw" className="aspect-[4/5] w-full [&_img]:object-[50%_25%] [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.03]" />
                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{p.name}</h3>
                    <p className="text-sm">{p.role}</p>
                  </div>
                  {p.linkedin?.href ? (
                    <a href={p.linkedin.href} target="_blank" rel="noopener" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linkedin text-white hover:bg-navy">
                      <LinkedInIcon className="size-5" />
                      <span className="sr-only">{p.name} on LinkedIn (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Media */}
      <section className="pb-(--spacing-section)" aria-labelledby="media-title">
        <Divider wide />
        <div className="container-wide mt-16">
          <h2 id="media-title" className="type-display mx-auto max-w-4xl text-center text-balance">
            {media.title}
          </h2>
          <div className="mt-14">
            <MediaCards items={media.items} />
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/newspage/" className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold text-navy hover:text-blue">
              {home.mediaCta}
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      <TestimonialCarousel title={testimonials.title} items={getTestimonials()} />

      <CtaBand title={closing.title} body={closing.body} />
    </>
  );
}
