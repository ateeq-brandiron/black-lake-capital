import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Differentiators } from "@/components/Differentiators";
import { Divider } from "@/components/Divider";
import { ImageSlot } from "@/components/ImageSlot";
import { PageHero } from "@/components/PageHero";
import content from "@/content/pages/values.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/values/");

export default function ValuesPage() {
  const { hero, differentTitle, treeline } = content;
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} imageLabel={hero.image.note}>
        <CtaButton variant="light" className="mt-2" />
      </PageHero>

      <section className="pt-16" aria-labelledby="different-title">
        <Divider wide />
        <div className="container-wide mt-16">
          <h2 id="different-title" className="type-display text-center text-balance">
            {differentTitle}
          </h2>
          <div className="mt-16">
            <Differentiators />
          </div>
          <div className="mt-16 flex justify-center">
            <CtaButton />
          </div>
        </div>
        <ImageSlot image={treeline} label={treeline.note} placeholder="light" sizes="100vw" className="mt-16 h-24 w-full sm:h-32" />
      </section>

      <CtaBand />
    </>
  );
}
