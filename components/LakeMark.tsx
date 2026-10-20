/**
 * Circular lake mark. TEMPORARY vector redraw from the screenshots; replace with the
 * official logo file from the live site once extraction runs (see docs/open-items.md).
 */
type Props = {
  className?: string;
  /** "brand" = navy/charcoal with white ring; "divider" = small grey mark used between sections. */
  tone?: "brand" | "divider";
  title?: string;
};

const WAVE = "M4 52" + " q3 4 6 0".repeat(16);

export function LakeMark({ className, tone = "brand", title }: Props) {
  const top = tone === "brand" ? "var(--color-navy)" : "#5f5f5f";
  const bottom = tone === "brand" ? "var(--color-charcoal)" : "#111111";
  const id = `lake-${tone}`;
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={id}>
          <circle cx="50" cy="50" r={tone === "brand" ? 44 : 50} />
        </clipPath>
      </defs>
      {tone === "brand" ? <circle cx="50" cy="50" r="50" fill="#fff" /> : null}
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="100" height="53" fill={top} />
        <rect x="0" y="53" width="100" height="47" fill={bottom} />
        <path d={WAVE} fill="none" stroke="#fff" strokeWidth={tone === "brand" ? 2.5 : 1.5} />
      </g>
    </svg>
  );
}
