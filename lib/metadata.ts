import type { Metadata } from "next";
import { fillStats, site } from "@/lib/content";

type PageMeta = { title: string; description: string | null };

/** Page metadata with canonical URL and Open Graph tags. */
export function pageMetadata(meta: PageMeta, path: string): Metadata {
  const description = fillStats(meta.description ?? site.messaging.elevatorPitch);
  return {
    title: { absolute: meta.title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
  };
}
