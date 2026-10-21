import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { SourceNewsList } from "@/components/NewsList";
import { getLocalPosts, getSource, news, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return news.sources.map((s) => ({ source: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/newspage/[source]">) {
  const source = getSource((await params).source);
  if (!source) return {};
  return pageMetadata(
    { title: `${source.name} news | ${site.name}`, description: `News and insights from ${source.name}, a Black Lake Capital company.` },
    `/newspage/${source.id}/`,
  );
}

export default async function SourceNewsPage({ params }: PageProps<"/newspage/[source]">) {
  const source = getSource((await params).source);
  if (!source) notFound();
  const posts = getLocalPosts().filter((p) => p.source === source.id);
  return (
    <>
      <section className="container-wide py-20">
        <Link href="/newspage/" className="inline-block py-2 font-semibold text-navy hover:text-blue">
          &larr; All news
        </Link>
        <div className="mt-6">
          <SourceNewsList source={source} posts={posts} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
