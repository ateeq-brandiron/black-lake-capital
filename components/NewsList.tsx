import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { type NewsPost, type NewsSource, postPath } from "@/lib/content";

function NewsCard({ post }: { post: NewsPost }) {
  return (
    <li className="border border-mist px-5 py-5">
      <h3 className="text-lg leading-none font-medium text-ink">
        <Link href={postPath(post.slug)} className="hover:text-blue">
          {post.title}
        </Link>
      </h3>
      {post.author ? <p className="mt-4">by {post.author}</p> : null}
      <Link href={postPath(post.slug)} className="mt-3 inline-block py-1 text-navy hover:text-blue">
        read more<span className="sr-only">: {post.title}</span>
      </Link>
    </li>
  );
}

function SourceHeading({ source, as: Tag = "h2" }: { source: NewsSource; as?: "h2" | "h1" }) {
  return (
    <Tag className="flex h-32 items-center justify-center">
      <ImageSlot image={source.logo} placeholder="light" fit="contain" sizes="240px" className="h-28 w-full" />
      <span className="sr-only">{source.name}</span>
    </Tag>
  );
}

type ListProps = { sources: NewsSource[]; posts: NewsPost[]; perSource: number };

/** News listing: one column per source (Black Lake + portfolio companies), as on the live site. */
export function NewsList({ sources, posts, perSource }: ListProps) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {sources.map((source) => {
        const all = posts.filter((p) => p.source === source.id);
        if (!all.length) return null;
        return (
          <section key={source.id} id={`news-${source.id}`} aria-label={source.name}>
            <SourceHeading source={source} />
            <ul className="mt-2 space-y-6">
              {all.slice(0, perSource).map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </ul>
            {all.length > perSource ? (
              <Link href={`/newspage/${source.id}/`} className="mt-6 inline-block py-2 font-semibold text-navy hover:text-blue">
                All {all.length} posts from {source.name} &rarr;
              </Link>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

/** Every post from one source, newest first. */
export function SourceNewsList({ source, posts }: { source: NewsSource; posts: NewsPost[] }) {
  return (
    <>
      <SourceHeading source={source} as="h1" />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </ul>
    </>
  );
}
