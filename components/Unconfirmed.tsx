import { showReviewFlags } from "@/lib/content";

/** Marks a value that is not yet confirmed by the client (content field confirmed: false). */
export function Unconfirmed({ confirmed, note, children }: { confirmed: boolean; note?: string; children: React.ReactNode }) {
  if (confirmed || !showReviewFlags) return <>{children}</>;
  return (
    <span className="decoration-amber-500 underline decoration-dotted decoration-2 underline-offset-8" title={`Unconfirmed: ${note ?? "awaiting client confirmation"}`} data-unconfirmed="">
      {children}
    </span>
  );
}
