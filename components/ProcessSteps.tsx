import Link from "next/link";
import { CheckIcon, ArrowRightIcon } from "@/components/Icons";
import { Unconfirmed } from "@/components/Unconfirmed";

type Props = {
  eyebrow: string;
  title: string;
  steps: { title: string; body: string }[];
  confirmed: boolean;
  note?: string;
  criteriaTitle: string;
  criteria: { title: string; body: string | null }[];
  criteriaLink: string;
};

/** Business-owner section: a simple three-step process next to a criteria snapshot. */
export function ProcessSteps({ eyebrow, title, steps, confirmed, note, criteriaTitle, criteria, criteriaLink }: Props) {
  return (
    <section className="bg-navy-deep py-(--spacing-section) text-white" aria-labelledby="process-title">
      <div className="container-wide grid gap-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <div className="reveal">
          <p className="type-eyebrow text-sky!">{eyebrow}</p>
          <h2 id="process-title" className="mt-4 text-display-sm font-bold">
            {title}
          </h2>
          <Unconfirmed confirmed={confirmed} note={note} block>
            <ol className="mt-12 space-y-10">
              {steps.map((step, i) => (
                <li key={step.title} className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-6">
                  {i < steps.length - 1 ? <span className="absolute top-16 bottom-[-2.5rem] left-7 w-px bg-white/20" aria-hidden="true" /> : null}
                  <span className="flex size-14 items-center justify-center rounded-full border border-white/40 font-numeral text-2xl text-white" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl leading-tight font-semibold">{step.title}</h3>
                    <p className="mt-2 text-white/80">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Unconfirmed>
        </div>
        <div className="reveal self-start rounded-card bg-white p-8 text-body shadow-2xl sm:p-10">
          <h3 className="text-2xl font-bold text-blue">{criteriaTitle}</h3>
          <ul className="mt-6 space-y-5">
            {criteria.map((c) => (
              <li key={c.title} className="flex gap-3">
                <CheckIcon className="mt-1 size-5 shrink-0 text-blue" />
                <span>
                  <span className="block font-semibold text-ink">{c.title}</span>
                  {c.body ? <span className="mt-1 block text-[0.9375rem]">{c.body}</span> : null}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/investment-criteria/#faq" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-navy hover:text-blue">
            {criteriaLink}
            <ArrowRightIcon className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
