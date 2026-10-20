import { site } from "@/lib/content";

type Props = {
  label?: string;
  href?: string;
  /** "solid" = navy button on light backgrounds; "light" = white button on photos and dark bands. */
  variant?: "solid" | "light";
  className?: string;
};

/** The primary action. Defaults to "Start a conversation" from content/site.json. */
export function CtaButton({ label = site.cta.label, href = site.cta.href, variant = "solid", className = "" }: Props) {
  const styles =
    variant === "solid"
      ? "bg-navy text-white hover:bg-blue"
      : "bg-white text-navy hover:bg-sky";
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-7 py-3 text-base font-semibold tracking-wide shadow-sm transition-colors ${styles} ${className}`}
    >
      {label}
    </a>
  );
}
