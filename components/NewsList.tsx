import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import type { NewsPost, NewsSource } from "@/lib/content";

type Props = { sources: NewsSource[]; posts: NewsPost[] };

function postHref(post: NewsPost, source: NewsSource) {
  if (source.local) return post.body ? `/news/${post.slug}/` : null;
  return post.url;
}

/** News listing: one column per source (Black Lake + portfolio companies), as on the live site. */
export function NewsList({ sources, posts }: Props) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {sources.map((source) => {
        const list = posts.filter((p) => p.source === source.id);
        if (!list.length) return null;
        return (
          <section key={source.id} aria-labelledby={`news-${source.id}`}>
            <h2 id={`news-${source.id}`} className="flex h-32 items-center justify-center">
              {source.logo.src ? (
                <ImageSlot image={source.logo} placeholder="light" fit="contain" sizes="240px" className="h-28 w-full" />
              ) : (
                <span className="text-2xl font-semibold text-navy">{source.name}</span>
              )}
            </h2>
            <ul className="mt-2 space-y-8">
              {list.map((post) => {
                const href = postHref(post, source);
                return (
                  <li key={post.slug} className="border border-mist px-5 py-6">
                    <h3 className="text-xl leading-tight text-ink">{post.title}</h3>
                    {post.date ? (
                      <p className="mt-3 text-sm">
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                      </p>
                    ) : null}
                    <p className="mt-3">by {post.author}</p>
                    {href ? (
                      <Link
                        href={href}
                        className="mt-4 inline-block py-1 font-medium text-navy hover:text-blue"
                        target={source.local ? undefined : "_blank"}
                        rel={source.local ? undefined : "noopener"}
                      >
                        read more<span className="sr-only">: {post.title}</span>
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
