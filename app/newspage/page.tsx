import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { NewsList } from "@/components/NewsList";
import { PageHero } from "@/components/PageHero";
import content from "@/content/pages/newspage.json";
import { getLocalPosts, news } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/newspage/");

export default function NewsPage() {
  const { hero } = content;
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} video={hero.video}>
        <CtaButton variant="light" className="mt-2" />
      </PageHero>
      <section className="py-(--spacing-section)" aria-label="Posts">
        <div className="container-wide">
          <NewsList sources={news.sources} posts={getLocalPosts()} perSource={5} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
