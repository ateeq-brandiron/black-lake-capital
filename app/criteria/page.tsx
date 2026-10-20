import { PageStub } from "@/components/PageStub";
import content from "@/content/pages/criteria.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/criteria/");

export default function CriteriaPage() {
  return <PageStub content={content} />;
}
