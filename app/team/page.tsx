import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { Divider } from "@/components/Divider";
import { PageHero } from "@/components/PageHero";
import { StatBlock } from "@/components/StatBlock";
import { TeamCard } from "@/components/TeamCard";
import content from "@/content/pages/team.json";
import { team } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/team/");

export default function TeamPage() {
  const { hero } = content;
  return (
    <>
      <PageHero title={hero.title} image={hero.image} size="compact">
        <CtaButton variant="light" className="mt-2" />
      </PageHero>

      <section className="pt-16" aria-labelledby="numbers-title">
        <Divider wide />
        <div className="container-page mt-16">
          <h2 id="numbers-title" className="type-display-sm text-center uppercase">
            {team.stats.title}
          </h2>
          <div className="mt-14">
            <StatBlock items={team.stats.items} />
          </div>
        </div>
      </section>

      {team.sections.map((s) => (
        <section key={s.title} className="pt-20" aria-labelledby={`team-${s.title}`}>
          <Divider />
          <div className="container-page mt-14 text-center">
            <h2 id={`team-${s.title}`} className="type-display-sm uppercase">
              {s.title}
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)] leading-[1.3]">{s.body}</p>
          </div>
        </section>
      ))}
      <div className="mt-14 flex justify-center">
        <CtaButton />
      </div>

      <section className="container-page space-y-28 py-(--spacing-section)" aria-label="Partners">
        {team.partners.map((m, i) => (
          <TeamCard key={m.name} member={m} reverse={i % 2 === 1} />
        ))}
      </section>

      <section className="pb-(--spacing-section)" aria-labelledby="advisory-title">
        <Divider />
        <div className="container-page mt-16">
          <h2 id="advisory-title" className="text-center text-[clamp(2rem,1.2rem+2.6vw,3.375rem)] leading-tight font-extrabold text-blue">
            {team.advisoryTitle}
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {team.advisors.map((m) => (
              <TeamCard key={m.name} member={m} variant="advisor" />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
