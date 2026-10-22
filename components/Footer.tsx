import Link from "next/link";
import { LakeMark } from "@/components/LakeMark";
import { LinkedInIcon } from "@/components/Icons";
import { site } from "@/lib/content";

export function Footer() {
  const { footer, contact } = site;
  const copyright = `${site.name} © ${site.copyrightYear}`;
  return (
    <footer className="text-base leading-[1.7] font-medium text-[#5c5c5c]">
      <div className="bg-mist py-16">
        <div className="container-page grid gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-16 lg:grid-cols-[1.2fr_1fr_1fr]">
          <Link href="/" className="justify-self-start sm:justify-self-center">
            <LakeMark className="size-36" title={site.name} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-blue-stat">{footer.quickLinksTitle}</h2>
            <ul className="mt-3 space-y-1">
              {footer.quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-0.5 text-navy hover:text-blue">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-1">
              {footer.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-0.5 hover:text-blue">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-stat">{footer.contactTitle}</h2>
            <address className="mt-4 not-italic">
              <a href={contact.phoneHref} className="block hover:text-blue">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block break-all hover:text-blue">
                {contact.email}
              </a>
              <span className="block">
                {contact.address[0]},
                <br />
                {contact.address[1]}
              </span>
            </address>
            {contact.linkedin.href ? (
              <a href={contact.linkedin.href} className="mt-5 inline-flex size-12 items-center justify-center bg-linkedin text-white" rel="noopener" target="_blank">
                <LinkedInIcon className="size-6" />
                <span className="sr-only">{site.name} on LinkedIn</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-night py-5 text-sm text-[#8a8a8a]">
        <p className="container-page">
          {copyright} | {site.credit}
        </p>
      </div>
    </footer>
  );
}
