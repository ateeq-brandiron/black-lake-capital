import { differentiators, fillStats } from "@/lib/content";

/** Four columns of approved differentiators (Values and Investors). */
export function Differentiators() {
  return (
    <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {differentiators.items.map((item) => (
        <li key={item.title}>
          <h3 className="text-2xl leading-none font-bold text-column">{item.title}</h3>
          <p className="mt-6 text-[0.9375rem] leading-[1.8] text-black">{fillStats(item.body)}</p>
        </li>
      ))}
    </ul>
  );
}
