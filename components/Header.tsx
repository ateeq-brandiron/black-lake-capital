import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";
import { DesktopNav } from "@/components/DesktopNav";
import { LakeMark } from "@/components/LakeMark";
import { MenuDrawer } from "@/components/MenuDrawer";
import { DownloadIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import { site } from "@/lib/content";

/** Contact top bar, then a sticky bar with the logo, the main sections and the CTA. Shared by every page. */
export function Header({ topBar = true }: { topBar?: boolean }) {
  const { contact, onePager } = site;
  // The CTA already sits in the bar, so "Contact Us" only appears in the drawer.
  const primary = site.nav.filter((item) => item.href !== "/investors/");
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-60 focus:bg-white focus:px-4 focus:py-2 focus:text-navy">
        Skip to content
      </a>
      {topBar ? (
        <aside aria-label="Contact details" className="bg-navy text-xs font-semibold text-white">
          <div className="container-wide flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 py-1.5">
            <a href={contact.phoneHref} className="inline-flex min-h-6 items-center gap-1.5 hover:underline">
              <PhoneIcon className="size-3.5" />
              {contact.phone}
            </a>
            <span className="hidden sm:inline">
              <span aria-hidden="true">| </span>
              {contact.address.join(", ")}
            </span>
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-6 items-center gap-1.5 hover:underline">
              <MailIcon className="size-3.5" />
              {contact.email}
            </a>
          </div>
        </aside>
      ) : null}
      {/* The blur sits on a child: backdrop-filter on the header itself would trap the fixed drawer inside it. */}
      <header className="sticky top-0 z-40 isolate border-b border-navy/10">
        <div className="absolute inset-0 -z-10 bg-white/90 backdrop-blur-md" />
        <div className="container-wide flex h-18 items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <LakeMark className="size-11" />
            <Image src="/images/brand/wordmark-text.png" alt={site.name} width={518} height={27} className="h-auto w-36 sm:w-44 xl:w-52" priority />
          </Link>
          <DesktopNav nav={primary} />
          <div className="flex items-center gap-3">
            <a
              href={onePager.href}
              target="_blank"
              rel="noopener"
              aria-label={`${onePager.label} (PDF)`}
              className="hidden min-h-11 min-w-11 items-center justify-center gap-2 border border-navy px-4 text-base font-medium whitespace-nowrap text-navy transition hover:-translate-y-0.5 hover:bg-sky motion-reduce:hover:translate-y-0 sm:inline-flex lg:max-[75rem]:px-0"
            >
              <DownloadIcon className="size-4.5 shrink-0" />
              {/* Icon only from lg up to 1200px, where the inline nav leaves no room for the label. */}
              <span className="lg:max-[75rem]:sr-only">{onePager.shortLabel}</span>
            </a>
            <div className="hidden sm:block">
              <CtaButton className="min-h-11! px-5! text-base!" />
            </div>
            <MenuDrawer siteName={site.name} nav={site.nav} downloads={site.menuDownloads} />
          </div>
        </div>
      </header>
    </>
  );
}
