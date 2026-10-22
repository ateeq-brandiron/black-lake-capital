import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
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
      {/* Live post layout: no photo hero; title, meta line and featured image in a left-aligned column */}
      <article className="container-page pt-28 pb-(--spacing-section)">
        <div className="max-w-[50rem]">
          <h1 className="text-[clamp(1.5rem,1.2rem+1vw,1.875rem)] leading-none font-medium text-ink">{post.title}</h1>
          <p className="mt-4 text-sm">
            {post.author ? <>by {post.author}</> : null}
            {post.author && post.date ? " | " : null}
            {post.date ? <time dateTime={post.date}>{formatDate(post.date, "short")}</time> : null}
            {source ? (
              <>
                {" | "}
                <Link href={`/newspage/${source.id}/`} className="hover:text-blue">
                  {source.name}
                </Link>
              </>
            ) : null}
          </p>
          {post.featuredImage ? (
            <Image
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              width={post.featuredImage.width}
              height={post.featuredImage.height}
              sizes="(min-width: 860px) 800px, 100vw"
              priority
              className="mt-8 h-auto w-full"
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
        </div>
      </article>
      <CtaBand />
    </>
  );
}
