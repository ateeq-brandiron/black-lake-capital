import { showReviewFlags } from "@/lib/content";

type Props = { confirmed: boolean; note?: string; block?: boolean; children: React.ReactNode };

/** Marks content that is not yet confirmed by the client (content field confirmed: false). */
export function Unconfirmed({ confirmed, note, block = false, children }: Props) {
  if (confirmed || !showReviewFlags) return <>{children}</>;
  const title = `Unconfirmed: ${note ?? "awaiting client confirmation"}`;
  if (block) {
    return (
      <div className="relative outline-2 outline-offset-8 outline-amber-500 outline-dashed" title={title} data-unconfirmed="">
        <p className="absolute -top-9 right-0 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold tracking-wider text-amber-900 uppercase">Draft: not yet confirmed</p>
        {children}
      </div>
    );
  }
  return (
    <span className="decoration-amber-500 underline decoration-dotted decoration-2 underline-offset-8" title={title} data-unconfirmed="">
      {children}
    </span>
  );
}
