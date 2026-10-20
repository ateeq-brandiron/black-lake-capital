import { LegalPage } from "@/components/LegalPage";
import content from "@/content/pages/cookie-policy.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/cookie-policy/");

export default function CookiePolicyPage() {
  return <LegalPage content={content} />;
}
