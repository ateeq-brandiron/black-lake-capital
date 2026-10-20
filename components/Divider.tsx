import { LakeMark } from "@/components/LakeMark";

/** Horizontal rule with the small lake mark in the middle, used between sections. */
export function Divider({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`flex items-center gap-6 ${wide ? "" : "container-page"}`} aria-hidden="true">
      <span className="h-px flex-1 bg-muted" />
      <LakeMark tone="divider" className="size-11 shrink-0" />
      <span className="h-px flex-1 bg-muted" />
    </div>
  );
}
