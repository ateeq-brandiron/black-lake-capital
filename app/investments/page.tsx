import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { PageHero } from "@/components/PageHero";
import { PortfolioCard } from "@/components/PortfolioCard";
import content from "@/content/pages/investments.json";
import { fillStats, portfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investments/");

export default function InvestmentsPage() {
  const { hero, intro, statusLabels } = content;
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} imageLabel={hero.image.note}>
        <CtaButton variant="light" className="mt-2" />
      </PageHero>

      <section className="pt-8 pb-16">
        <div className="container-page text-center">
          <p className="mx-auto max-w-4xl text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-tight font-extrabold text-[#555] text-balance">{fillStats(intro)}</p>
          <div className="mt-10 flex justify-center">
            <CtaButton />
          </div>
        </div>
        <div className="mt-16">
          <Divider />
        </div>
      </section>

      <section className="pb-(--spacing-section)" aria-label="Portfolio companies">
        <div className="container-wide grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.companies.map((c) => (
            <PortfolioCard key={c.name} company={c} completedLabel={statusLabels.completed} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
