import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import type { ImageRef } from "@/lib/content";

type PageContent = {
  hero: { eyebrow: string | null; title: string; subtitle: string | null; image: ImageRef & { note?: string } };
  status: string;
};

/** Route placeholder used until the page body is built (Step 7). Shares the real hero and CTA band. */
export function PageStub({ content }: { content: PageContent }) {
  const { hero } = content;
  return (
    <>
      <PageHero title={hero.title} eyebrow={hero.eyebrow} subtitle={hero.subtitle} image={hero.image} imageLabel={hero.image.note} />
      <div className="container-page py-20 text-center">
        <p className="mx-auto max-w-xl rounded-card border border-dashed border-muted px-6 py-8 text-sm">{content.status}</p>
      </div>
      <CtaBand />
    </>
  );
}
