"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

/** Inline navigation for wide screens; the menu drawer covers smaller ones. */
export function DesktopNav({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1 xl:gap-3">
        {nav.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="relative flex min-h-11 items-center px-2.5 text-[0.9375rem] font-semibold text-navy transition-colors after:absolute after:inset-x-2.5 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blue after:transition-transform hover:text-blue hover:after:scale-x-100 aria-[current=page]:text-blue aria-[current=page]:after:scale-x-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
