import { Unconfirmed } from "@/components/Unconfirmed";
import { fillStats, getStat, type StatKey } from "@/lib/content";

export type StatItem = { stat: string; label: string; body?: string; detail?: string };

type Props = {
  items: StatItem[];
  /** "light" = Home (serif numerals on white); "dark" = Investors (bold numerals on navy). */
  tone?: "light" | "dark";
};

/** Row of headline numbers. Values always come from content/stats.json. */
export function StatBlock({ items, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <dl className={`grid gap-x-8 gap-y-12 text-center sm:grid-cols-2 ${items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {items.map((item) => {
        const s = getStat(item.stat as StatKey);
        return (
          <div key={item.stat} className="flex flex-col items-center">
            <dt className="order-2 mt-4">
              <span className={dark ? "block text-lg leading-tight font-bold text-white uppercase" : "type-label block"}>{item.label}</span>
            </dt>
            <dd className={`order-1 ${dark ? "text-4xl font-bold text-white" : "font-numeral text-stat text-blue"}`}>
              <Unconfirmed confirmed={s.confirmed} note={s.note}>
                {s.value}
              </Unconfirmed>
            </dd>
            {item.body ? <dd className={`order-3 mt-4 max-w-64 text-lg leading-snug ${dark ? "text-white/90" : ""}`}>{fillStats(item.body)}</dd> : null}
            {item.detail ? <dd className={`order-4 mt-4 max-w-64 text-lg leading-snug italic ${dark ? "text-white/80" : ""}`}>{fillStats(item.detail)}</dd> : null}
          </div>
        );
      })}
    </dl>
  );
}
