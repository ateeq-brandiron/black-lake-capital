import { LegalPage } from "@/components/LegalPage";
import content from "@/content/pages/privacy-policy.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/privacy-policy/");

export default function PrivacyPolicyPage() {
  return <LegalPage content={content} />;
}
