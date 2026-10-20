import { PageStub } from "@/components/PageStub";
import content from "@/content/pages/investors.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investors/");

export default function InvestorsPage() {
  return <PageStub content={content} />;
}
