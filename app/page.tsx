import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { ImageSlot } from "@/components/ImageSlot";
import { ChevronDownIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { StatBlock } from "@/components/StatBlock";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { getTestimonials, home } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(home.meta, "/");

export default function HomePage() {
  const { hero, logoStrip, intro, stats, approach, testimonials, closing } = home;
  return (
    <>
      <PageHero title={hero.title} eyebrow={hero.eyebrow} video={hero.video} image={hero.image} imageLabel="hero video" markPosition="below">
        <CtaButton variant="light" className="mt-4" />
      </PageHero>

      {/* Portfolio logo strip */}
      <section className="bg-sky py-12" aria-label={logoStrip.label}>
        <ul className="container-wide grid grid-cols-2 items-center gap-8 sm:grid-cols-4">
          {logoStrip.logos.map((logo) => (
            <li key={logo.name} className="flex h-24 items-center justify-center">
              {logo.src ? (
                <ImageSlot image={{ src: logo.src, alt: logo.name }} placeholder="light" fit="contain" sizes="240px" className="h-20 w-full" />
              ) : (
                <span className="text-2xl font-semibold text-navy/70">{logo.name}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Intro: elevator pitch */}
      <section className="pt-16 pb-(--spacing-section)">
        <Divider wide />
        <div className="container-page mt-14 text-center">
          <p className="text-lead mx-auto max-w-4xl">
            <RichText text={intro.lead} />
          </p>
          <p className="text-lead mx-auto mt-4 max-w-4xl">{intro.body}</p>
        </div>
      </section>

      {/* Proof points */}
      <section className="pb-(--spacing-section)" aria-labelledby="stats-title">
        <div className="container-wide">
          <h2 id="stats-title" className="type-display mx-auto max-w-5xl text-center uppercase text-balance">
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
      <section aria-labelledby="approach-title">
        <Divider wide />
        <div className="container-wide mt-16">
          <h2 id="approach-title" className="type-display mx-auto max-w-4xl text-center font-bold text-balance">
            {approach.title}
          </h2>
          <ul className="mt-16 grid gap-12 md:grid-cols-3">
            {approach.items.map((item) => (
              <li key={item.label} className="flex flex-col items-center text-center">
                <ImageSlot image={item.icon} label={`${item.label.toLowerCase()} icon`} placeholder="light" fit="contain" sizes="180px" className="size-40" />
                <h3 className="mt-6 text-xl font-medium tracking-wide text-ink uppercase">{item.label}</h3>
                <details className="group mt-5 w-full max-w-sm">
                  <summary className="mx-auto flex min-h-11 w-fit cursor-pointer list-none items-center gap-3 font-semibold text-blue [&::-webkit-details-marker]:hidden">
                    {item.summary}
                    <ChevronDownIcon className="size-6 rounded-full border-2 border-current p-0.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 text-lg leading-relaxed">
                    <p className="font-semibold text-ink">{item.heading}</p>
                    <p className="mt-2">{item.body}</p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <div className="mt-16 flex justify-center">
            <CtaButton />
          </div>
        </div>
        <div className="mt-(--spacing-section) pb-4">
          <Divider wide />
        </div>
      </section>

      <TestimonialCarousel title={testimonials.title} items={getTestimonials()} />

      <CtaBand title={closing.title} body={closing.body} />
    </>
  );
}
