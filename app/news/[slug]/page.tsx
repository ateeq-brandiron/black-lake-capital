import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { getLocalPosts, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const PLACEHOLDER = "__placeholder__";

/** Black Lake's own posts that have a body. Portfolio-company posts link out instead. */
function publishedPosts() {
  return getLocalPosts().filter((p): p is typeof p & { body: string } => Boolean(p.body));
}

export function generateStaticParams() {
  const posts = publishedPosts().map((p) => ({ slug: p.slug }));
  // Cache Components needs at least one param; the placeholder renders notFound().
  return posts.length ? posts : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = publishedPosts().find((p) => p.slug === slug);
  if (!post) return {};
  return pageMetadata({ title: `${post.title} | ${site.name}`, description: post.excerpt }, `/news/${post.slug}/`);
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = publishedPosts().find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <>
      <PageHero title={post.title} eyebrow="News" imageLabel="News hero" />
      <article className="container-page max-w-3xl py-(--spacing-section)">
        <p className="text-sm">
          {post.date ? <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time> : null}
          {post.date ? " · " : null}by {post.author}
        </p>
        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {post.body.split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Link href="/news/" className="mt-12 inline-block py-2 font-semibold text-navy hover:text-blue">
          &larr; All news
        </Link>
      </article>
      <CtaBand />
    </>
  );
}
