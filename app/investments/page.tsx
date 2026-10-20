import { PageStub } from "@/components/PageStub";
import content from "@/content/pages/investments.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/investments/");

export default function InvestmentsPage() {
  return <PageStub content={content} />;
}
