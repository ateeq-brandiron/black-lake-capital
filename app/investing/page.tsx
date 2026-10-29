import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { PageHero } from "@/components/PageHero";
import { PortfolioCard } from "@/components/PortfolioCard";
import { StoryCards } from "@/components/StoryCards";
import content from "@/content/pages/investing.json";
import { fillStats, getStories, portfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investing/");

export default function InvestmentsPage() {
  const { hero, intro, statusLabels, learnMoreLabel } = content;
  const stories = getStories();
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} subtitleWeight="bold">
        <CtaButton variant="light" className="mt-2" />
      </PageHero>

      <section className="pt-24 pb-16">
        <div className="container-page text-center">
          <p className="mx-auto max-w-4xl text-[clamp(1.5rem,1.1rem+1.3vw,2.125rem)] leading-[1.2] font-black text-body text-balance">{fillStats(intro)}</p>
          <div className="mt-10 flex justify-center">
            <CtaButton />
          </div>
        </div>
        <div className="mt-16">
          <Divider />
        </div>
      </section>

      <section className="pb-(--spacing-section)" aria-labelledby="portfolio-title">
        <h2 id="portfolio-title" className="sr-only">
          Portfolio companies
        </h2>
        <div className="container-wide grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-2">
          {portfolio.companies.map((c) => (
            <PortfolioCard key={c.name} company={c} completedLabel={statusLabels.completed} learnMoreLabel={learnMoreLabel} />
          ))}
        </div>
      </section>

      <section id="stories" className="scroll-mt-24 bg-sky/40 py-(--spacing-section)" aria-labelledby="stories-title">
        <div className="container-wide">
          <h2 id="stories-title" className="type-display mx-auto max-w-4xl text-center text-balance">
            {stories.title}
          </h2>
          <div className="mt-14">
            <StoryCards stories={stories.items} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
