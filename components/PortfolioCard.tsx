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
  const overlayRibbon = company.status === "completed" && !company.ribbonInLogo;
  return (
    <article className="flex flex-col items-center text-center font-card text-lg leading-normal font-medium">
      {/* Exits from the live site have the "Completed" ribbon baked into the logo; others get it overlaid at the same spot */}
      <div className="relative mx-auto w-full max-w-[20.5rem]">
        {overlayRibbon ? (
          <div className="relative aspect-600/342 w-full">
            {/* Keep the logo clear of the ribbon, as in the live "completed" artwork */}
            <ImageSlot image={company.logo} label={`${company.name} logo`} placeholder="light" fit="contain" sizes="(min-width: 1024px) 330px, 90vw" className="absolute! inset-x-[12%] top-[6%] bottom-[24%]" />
          </div>
        ) : (
          <ImageSlot image={company.logo} label={`${company.name} logo`} placeholder="light" fit="contain" sizes="(min-width: 1024px) 330px, 90vw" className="aspect-600/342 w-full" />
        )}
        {overlayRibbon ? (
          <p className="absolute inset-x-0 bottom-[6%] bg-[linear-gradient(90deg,transparent,#ebe7ee_15%,#ebe7ee_85%,transparent)] py-0.5 text-sm font-semibold tracking-widest text-[#8a8a8a] uppercase">
            {completedLabel}
          </p>
        ) : null}
      </div>
      <h3 className="mt-4 text-[1.3125rem] leading-none font-medium text-ink">{company.name}</h3>
      <p className="mt-4 text-black">{company.location}</p>
      <a href={href} target="_blank" rel="noopener" className="text-navy hover:text-blue">
        {company.website}
      </a>
      <p className="text-black">{company.description}</p>
      {company.newsSource ? (
        <Link href={`/newspage/${company.newsSource}/`} className="mt-4 inline-block py-2 font-bold text-navy hover:text-blue">
          {learnMoreLabel}
          <span className="sr-only"> about {company.name}</span>
        </Link>
      ) : null}
    </article>
  );
}
