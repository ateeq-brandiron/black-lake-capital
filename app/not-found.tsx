import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";
import { LakeMark } from "@/components/LakeMark";
import { site } from "@/lib/content";

export const metadata = { title: { absolute: `${site.notFound.title} | ${site.name}` } };

export default function NotFound() {
  const { notFound } = site;
  return (
    <section className="container-page flex min-h-[60svh] flex-col items-center justify-center gap-6 py-(--spacing-section) text-center">
      <LakeMark className="size-20" />
      <h1 className="type-display-sm">{notFound.title}</h1>
      <p className="text-lead max-w-xl font-normal text-body-soft">{notFound.body}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <CtaButton />
        <Link href="/" className="inline-flex min-h-12 items-center px-4 text-lg font-semibold text-navy hover:text-blue">
          {notFound.homeLabel}
        </Link>
      </div>
    </section>
  );
}
