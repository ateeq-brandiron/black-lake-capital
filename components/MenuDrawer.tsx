"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LakeMark } from "@/components/LakeMark";

type NavItem = { label: string; href: string };
type Props = { siteName: string; nav: NavItem[]; downloads: { label: string; files: { label: string; href: string }[] } };

/** Hamburger button (fixed, top right) and the slide-in navigation panel from the live site. */
export function MenuDrawer({ siteName, nav, downloads }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        className="fixed top-0 right-0 z-40 flex size-13 flex-col items-center justify-center gap-1.75 bg-black"
      >
        <span className="sr-only">Open menu</span>
        <span className="h-px w-7 bg-white" />
        <span className="h-px w-7 bg-white" />
        <span className="h-px w-7 bg-white" />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-black/55 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="site-menu"
        aria-label="Main"
        inert={!open}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-60 flex-col overflow-y-auto bg-navy px-8 pt-12 pb-10 text-white transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="absolute top-3 right-3 flex size-11 items-center justify-center text-2xl leading-none">
          <span aria-hidden="true">&times;</span>
          <span className="sr-only">Close menu</span>
        </button>
        <Link href="/" onClick={() => setOpen(false)} className="flex flex-col items-center gap-3 text-center">
          <LakeMark className="size-24" />
          <span className="text-2xl leading-tight font-normal">{siteName}</span>
        </Link>
        <ul className="mt-12 flex flex-col">
          {nav.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className="block py-4 text-lg hover:text-sky aria-[current=page]:font-semibold"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {downloads.files.length ? (
          <div className="mt-6 text-center">
            <p className="font-semibold">{downloads.label}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {downloads.files.map((f) => (
                <li key={f.href}>
                  <a href={f.href} className="underline underline-offset-4">
                    {f.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </>
  );
}
