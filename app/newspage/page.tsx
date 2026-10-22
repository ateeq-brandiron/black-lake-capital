import { CtaBand } from "@/components/CtaBand";
import { CtaButton } from "@/components/CtaButton";
import { MediaCards } from "@/components/MediaCards";
import { NewsList } from "@/components/NewsList";
import { PageHero } from "@/components/PageHero";
import content from "@/content/pages/newspage.json";
import { getLocalPosts, getMedia, news } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/newspage/");

export default function NewsPage() {
  const { hero } = content;
  const media = getMedia();
  return (
    <>
      <PageHero title={hero.title} subtitle={hero.subtitle} image={hero.image} video={hero.video}>
        <CtaButton variant="light" className="mt-2" />
      </PageHero>
      <section className="pt-(--spacing-section)" aria-labelledby="media-title">
        <div className="container-wide">
          <h2 id="media-title" className="type-display-sm text-center">
            {media.title}
          </h2>
          <div className="mt-12">
            <MediaCards items={media.items} />
          </div>
        </div>
      </section>
      <section className="py-(--spacing-section)" aria-label="Posts">
        <div className="container-page">
          <NewsList sources={news.sources} posts={getLocalPosts()} perSource={5} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
