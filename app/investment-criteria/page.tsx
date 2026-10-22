import { Accordion } from "@/components/Accordion";
import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { PageHero } from "@/components/PageHero";
import { Unconfirmed } from "@/components/Unconfirmed";
import content from "@/content/pages/investment-criteria.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investment-criteria/");

export default function CriteriaPage() {
  const { hero, intro, criteria } = content;
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
          <div className="mt-16 flex justify-center">
            <CtaButton />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
