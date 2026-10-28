import { Accordion } from "@/components/Accordion";
import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { PageHero } from "@/components/PageHero";
import { Unconfirmed } from "@/components/Unconfirmed";
import content from "@/content/pages/investment-criteria.json";
import { fillStats } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investment-criteria/");

export default function CriteriaPage() {
  const { hero, intro, criteria, faq } = content;
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} subtitleWeight="bold-sm">
        <CtaButton variant="light" className="mt-2" />
      </PageHero>

      <section className="py-16">
        <Divider />
        <p className="container-page mt-14 max-w-5xl text-center text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)] leading-[1.15] font-normal">
          <Unconfirmed confirmed={content.introConfirmed} note="Draft wording for the focus line">
            {intro}
          </Unconfirmed>
        </p>
      </section>

      <section className="pb-(--spacing-section)" aria-label="Investment criteria">
        <div className="container-page">
          <Unconfirmed confirmed={criteria.confirmed} note={criteria.note} block>
            <Accordion items={criteria.items} />
          </Unconfirmed>
          <div className="mt-14 flex justify-center">
            <CtaButton />
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-sky/40 py-(--spacing-section)" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 id="faq-title" className="type-display-sm text-balance">
            {faq.title}
          </h2>
          <Accordion items={faq.items.map((q) => ({ ...q, body: fillStats(q.body) }))} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
