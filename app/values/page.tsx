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
  const { hero, differentTitle, treeline, valuePoints } = content;
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} video={hero.video}>
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
          <div className="mt-14 flex justify-center">
            <CtaButton />
          </div>
        </div>
        <div className="container-wide mt-(--spacing-section)">
          <h2 className="type-display text-center text-balance">{valuePoints.title}</h2>
          <ul className="mt-14 grid gap-12 md:grid-cols-3">
            {valuePoints.items.map((item) => (
              <li key={item.title} className="border-t-4 border-blue pt-6">
                <h3 className="text-2xl leading-none font-bold text-column">{item.title}</h3>
                <p className="mt-6 text-[0.9375rem] leading-[1.8] text-black">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <ImageSlot image={treeline} placeholder="light" fit="cover" sizes="100vw" className="mt-16 aspect-16/3 w-full bg-white! outline-0! [&_img]:object-bottom" />
      </section>

      <CtaBand />
    </>
  );
}
