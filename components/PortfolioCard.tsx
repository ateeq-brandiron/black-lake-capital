import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import type { ImageRef } from "@/lib/content";

export type Company = {
  name: string;
  location: string;
  website: string;
  description: string;
  status: string;
  logo: ImageRef;
  /** The live logo images for exits already include the "Completed" ribbon. */
  ribbonInLogo?: boolean;
  /** News source id; "Learn More" links to that company's posts. */
  newsSource?: string | null;
};

/** Portfolio company card (Investments): logo, "Completed" ribbon for exits, location, website, one-liner. */
export function PortfolioCard({ company, completedLabel, learnMoreLabel }: { company: Company; completedLabel: string; learnMoreLabel: string }) {
  const href = `https://${company.website.replace(/^https?:\/\//, "").toLowerCase()}`;
  return (
    <article className="flex flex-col items-center text-center">
      <div className="w-full">
        <ImageSlot image={company.logo} label={`${company.name} logo`} placeholder="light" fit="contain" sizes="(min-width: 1024px) 360px, 90vw" className="aspect-600/342 w-full" />
        {company.status === "completed" && !company.ribbonInLogo ? (
          <p className="bg-[linear-gradient(90deg,transparent,#ebe7ee_15%,#ebe7ee_85%,transparent)] py-0.5 text-sm font-semibold tracking-widest text-[#8a8a8a] uppercase">{completedLabel}</p>
        ) : null}
      </div>
      <h3 className="mt-4 text-2xl text-ink">{company.name}</h3>
      <p className="mt-4 text-lg text-ink">{company.location}</p>
      <a href={href} target="_blank" rel="noopener" className="mt-1 text-lg text-navy hover:text-blue">
        {company.website}
      </a>
      <p className="mt-1 text-lg text-ink">{company.description}</p>
      {company.newsSource ? (
        <Link href={`/newspage/${company.newsSource}/`} className="mt-4 inline-block py-2 text-lg font-semibold text-navy hover:text-blue">
          {learnMoreLabel}
          <span className="sr-only"> about {company.name}</span>
        </Link>
      ) : null}
    </article>
  );
}
