import { MenuDrawer } from "@/components/MenuDrawer";
import { MailIcon, PhoneIcon } from "@/components/Icons";
import { site } from "@/lib/content";

/** Contact top bar plus the hamburger menu. Shared by every page. */
export function Header({ topBar = true }: { topBar?: boolean }) {
  const { contact } = site;
  return (
    <header>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-60 focus:bg-white focus:px-4 focus:py-2 focus:text-navy">
        Skip to content
      </a>
      {topBar ? (
        <div className="bg-navy text-xs font-semibold text-white">
          <div className="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 py-1.5 pr-16 pl-4 sm:pl-8">
            <a href={contact.phoneHref} className="inline-flex items-center gap-1.5 hover:underline">
              <PhoneIcon className="size-3.5" />
              {contact.phone}
            </a>
            <span className="hidden sm:inline">
              <span aria-hidden="true">| </span>
              {contact.address.join(", ")}
            </span>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 hover:underline">
              <MailIcon className="size-3.5" />
              {contact.email}
            </a>
          </div>
        </div>
      ) : null}
      <MenuDrawer siteName={site.name} nav={site.nav} downloads={site.menuDownloads} />
    </header>
  );
}
