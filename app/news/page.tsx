import { CtaBand } from "@/components/CtaBand";
import { NewsList } from "@/components/NewsList";
import { PageHero } from "@/components/PageHero";
import content from "@/content/pages/news.json";
import { news } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/news/");

export default function NewsPage() {
  const { hero } = content;
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} imageLabel={hero.image.note} />
      <section className="py-(--spacing-section)" aria-label="Posts">
        <div className="container-wide">
          <NewsList sources={news.sources} posts={news.posts} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
