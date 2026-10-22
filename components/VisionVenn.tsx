type Props = {
  eyebrow: string;
  title: string;
  body: string;
  goal: string;
  venn: { left: string; right: string; center: string };
};

/** Values up front: the platform vision, with the "your expertise + our experience" overlap diagram. */
export function VisionVenn({ eyebrow, title, body, goal, venn }: Props) {
  return (
    <section className="py-(--spacing-section)" aria-labelledby="vision-title">
      <div className="container-wide reveal grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className="type-eyebrow">{eyebrow}</p>
          <h2 id="vision-title" className="mt-4 text-[clamp(1.75rem,1.2rem+1.6vw,2.625rem)] leading-[1.2] font-bold text-blue text-balance">
            {title}
          </h2>
          <p className="mt-6 text-lg">{body}</p>
          <p className="mt-4 text-lg">{goal}</p>
        </div>
        {/* Two overlapping circles; the overlap is the shared result */}
        <figure className="mx-auto w-full max-w-[32rem]">
          <div className="relative aspect-[8/5] w-full text-white">
            <div className="absolute top-0 left-0 aspect-square w-[61.5%] rounded-full bg-navy shadow-[0_20px_50px_-25px_rgb(11_39_76/0.6)]" />
            <div className="absolute top-0 right-0 aspect-square w-[61.5%] rounded-full bg-blue/90 mix-blend-multiply" />
            <p className="absolute top-1/2 left-[5%] w-[29%] -translate-y-1/2 text-center text-[clamp(0.8125rem,0.7rem+0.5vw,1.0625rem)] leading-snug font-semibold">{venn.left}</p>
            <p className="absolute top-1/2 right-[5%] w-[29%] -translate-y-1/2 text-center text-[clamp(0.8125rem,0.7rem+0.5vw,1.0625rem)] leading-snug font-semibold">{venn.right}</p>
            <p className="absolute top-1/2 left-1/2 w-[21%] -translate-1/2 text-center text-[clamp(0.6875rem,0.6rem+0.35vw,0.875rem)] leading-tight font-bold tracking-wider text-white uppercase">
              {venn.center}
            </p>
          </div>
          <figcaption className="sr-only">
            {venn.left} plus {venn.right} creates {venn.center}.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
