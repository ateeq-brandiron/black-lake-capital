type Item = { title: string; body: string | null };

/** Bordered toggles (Criteria). Native <details>, so it works without JS. Items without a body are static rows. */
export function Accordion({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-7">
      {items.map((item) => (
        <li key={item.title} className="border border-mist bg-white shadow-[0_6px_14px_rgb(0_0_0/0.12)]">
          {item.body ? (
            <details className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] text-[#555] [&::-webkit-details-marker]:hidden">
                {item.title}
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#b5b5b5] text-sm leading-none text-white transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="px-5 pb-6 text-lg leading-relaxed">{item.body}</p>
            </details>
          ) : (
            <p className="flex min-h-16 items-center px-5 py-4 text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] text-[#555]">{item.title}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
