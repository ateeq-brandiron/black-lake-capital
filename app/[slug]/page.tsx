import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { formatDate, getLocalPosts, getPost, getSource, postPath, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

/** WordPress posts keep their original root-level URLs (/<slug>/). Static pages take precedence. */
export function generateStaticParams() {
  return getLocalPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) return {};
  const meta = pageMetadata({ title: `${post.title} | ${site.name}`, description: post.excerpt }, postPath(post.slug));
  if (post.featuredImage) {
    const { src, width, height } = post.featuredImage;
    meta.openGraph = { ...meta.openGraph, type: "article", images: [{ url: src, width, height }] };
  }
  return meta;
}

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const source = getSource(post.source);
  return (
    <>
      <PageHero title={post.title} eyebrow={source?.name ?? "News"} image={{ src: "/images/sections/news-hero.jpg", alt: "" }} />
      <article className="container-page max-w-3xl pb-(--spacing-section)">
        <p className="text-sm">
          {post.author ? <>by {post.author}</> : null}
          {post.author && post.date ? " · " : null}
          {post.date ? <time dateTime={post.date}>{formatDate(post.date)}</time> : null}
        </p>
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.src}
            alt={post.featuredImage.alt}
            width={post.featuredImage.width}
            height={post.featuredImage.height}
            sizes="(min-width: 768px) 768px, 100vw"
            className="mt-8 h-auto w-full rounded-card"
          />
        ) : null}
        {post.body ? <Prose html={post.body} className="mt-6" /> : null}
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-2">
          {source ? (
            <Link href={`/newspage/${source.id}/`} className="py-2 font-semibold text-navy hover:text-blue">
              More from {source.name}
            </Link>
          ) : null}
          <Link href="/newspage/" className="py-2 font-semibold text-navy hover:text-blue">
            &larr; All news
          </Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
