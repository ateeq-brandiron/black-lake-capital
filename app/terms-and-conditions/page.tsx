import { LegalPage } from "@/components/LegalPage";
import content from "@/content/pages/terms-and-conditions.json";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(content.meta, "/terms-and-conditions/");

export default function TermsAndConditionsPage() {
  return <LegalPage content={content} />;
}
