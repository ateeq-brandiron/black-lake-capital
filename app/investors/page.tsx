import { ContactForm } from "@/components/ContactForm";
import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Differentiators } from "@/components/Differentiators";
import { ImageSlot } from "@/components/ImageSlot";
import { StatBlock } from "@/components/StatBlock";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import content from "@/content/pages/investors.json";
import { getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investors/");

export default function InvestorsPage() {
  const { hero, form, stats, whyTitle, testimonials } = content;
  return (
    <>
      {/* Hero with the inquiry form: the form is this section's one action */}
      <section id="contact" className="relative isolate scroll-mt-4 overflow-hidden py-14 text-white lg:py-14">
        <ImageSlot image={hero.image} sizes="100vw" priority className="absolute! inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-black/30" />
        <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-24">
          <div className="lg:pt-24">
            <h1 className="text-[clamp(1.75rem,1.4rem+1.2vw,2rem)] leading-none font-bold [text-shadow:0_2px_8px_rgb(0_0_0/0.5)]">{hero.title}</h1>
            <p className="mt-4 text-lg leading-[1.78] font-bold [text-shadow:0_2px_8px_rgb(0_0_0/0.5)]">{hero.subtitle}</p>
          </div>
          <ContactForm labels={form} />
        </div>
      </section>

      <section className="bg-navy-deep py-(--spacing-section)" aria-label="Track record">
        <div className="container-page">
          <StatBlock items={stats.items} tone="dark" />
        </div>
      </section>

      <section className="py-(--spacing-section)" aria-labelledby="why-title">
        <div className="container-wide">
          <h2 id="why-title" className="text-center text-[clamp(1.75rem,1.4rem+1.2vw,2.125rem)] leading-none font-bold text-ink">
            {whyTitle}
          </h2>
          <div className="mt-16">
            <Differentiators />
          </div>
          <div className="mt-14 flex justify-center">
            <CtaButton href="#contact" />
          </div>
        </div>
      </section>

      <TestimonialCarousel
        title={testimonials.title}
        titleSize="small"
        items={getTestimonials()}
        background={<ImageSlot image={testimonials.background} sizes="100vw" className="size-full" />}
      />

      <CtaBand />
    </>
  );
}
