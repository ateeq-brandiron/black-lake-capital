import { CtaButton } from "@/components/CtaButton";
import { site } from "@/lib/content";

type Props = { title?: string; body?: string };

/** Closing call to action, last section on every page. Defaults to the approved sign-off. */
export function CtaBand({ title = site.messaging.signOff, body }: Props) {
  return (
    <section className="bg-sky py-(--spacing-section)" aria-labelledby="cta-band-title">
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <h2 id="cta-band-title" className="type-display text-balance">
          {title}
        </h2>
        {body ? <p className="text-lead max-w-2xl font-normal text-body-soft">{body}</p> : null}
        <CtaButton className="mt-2" />
      </div>
    </section>
  );
}
