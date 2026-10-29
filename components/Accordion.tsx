type Item = { title: string; body: string | null };

/** Bordered toggles (Criteria). Native <details>, so it works without JS. Items without a body are static rows. */
export function Accordion({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-7">
      {items.map((item) => (
        <li key={item.title} className="border border-mist bg-white shadow-[0_6px_14px_rgb(0_0_0/0.12)]">
          {item.body ? (
            <details className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-snug font-medium text-body [&::-webkit-details-marker]:hidden">
                {item.title}
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#b5b5b5] text-sm leading-none text-white transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="max-w-[72ch] px-5 pb-6">{item.body}</p>
            </details>
          ) : (
            <p className="flex min-h-16 items-center px-5 py-4 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-snug font-medium text-body">{item.title}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
