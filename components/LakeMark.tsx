import Image from "next/image";

type Props = {
  className?: string;
  /** "brand" = official lake mark (navy/charcoal, white ring); "divider" = small grey mark between sections. */
  tone?: "brand" | "divider";
  title?: string;
};

const WAVE = "M4 52" + " q3 4 6 0".repeat(16);

/** Circular lake mark. The brand version is the official logo file from the live site. */
export function LakeMark({ className, tone = "brand", title }: Props) {
  if (tone === "brand") {
    return (
      <span className={`relative block ${className ?? ""}`}>
        <Image src="/images/brand/lake-mark.png" alt={title ?? ""} fill sizes="164px" className="object-contain" />
      </span>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <clipPath id="lake-divider">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath="url(#lake-divider)">
        <rect x="0" y="0" width="100" height="53" fill="#5f5f5f" />
        <rect x="0" y="53" width="100" height="47" fill="#111111" />
        <path d={WAVE} fill="none" stroke="#fff" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
