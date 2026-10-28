import Link from "next/link";
import { site } from "@/lib/content";

type Props = {
  label?: string;
  href?: string;
  /** "solid" = navy button on light backgrounds; "light" = white button on photos and dark bands. */
  variant?: "solid" | "light";
  className?: string;
};

/** The primary action. Defaults to "Start a conversation" (the contact form) from content/site.json. */
export function CtaButton({ label = site.cta.label, href = site.cta.href, variant = "solid", className = "" }: Props) {
  // Light buttons sit on photos and dark bands, so they get a deeper shadow to lift off the image.
  const styles =
    variant === "solid"
      ? "bg-navy text-white shadow-[0_6px_16px_-6px_rgb(11_39_76/0.55)] hover:bg-blue"
      : "bg-white text-navy shadow-[0_8px_24px_-6px_rgb(0_0_0/0.45)] hover:bg-sky";
  const classes = `inline-flex min-h-12 items-center justify-center px-7 py-2.5 text-center text-xl font-medium transition duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${styles} ${className}`;
  // Internal targets (the contact form) use client-side navigation; anything else is a plain link.
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {label}
    </a>
  );
}
