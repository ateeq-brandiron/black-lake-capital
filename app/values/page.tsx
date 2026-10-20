import { PageStub } from "@/components/PageStub";
import content from "@/content/pages/values.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/values/");

export default function ValuesPage() {
  return <PageStub content={content} />;
}
