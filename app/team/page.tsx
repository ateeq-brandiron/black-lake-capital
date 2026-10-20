import { PageStub } from "@/components/PageStub";
import content from "@/content/pages/team.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/team/");

export default function TeamPage() {
  return <PageStub content={content} />;
}
