import type { Inquiry } from "@/lib/inquiry";

/**
 * Submits the inquiry to Black Lake's existing ActiveCampaign form ("form 2", the one on the
 * WordPress site), the same way its embed script does. No API key is needed, and the form's own
 * settings in ActiveCampaign (list, tags, notification emails, automations) still apply.
 * Values come from the form's embed code; update them if the form is rebuilt in ActiveCampaign.
 */
const ACCOUNT = "https://blacklakecapital.activehosted.com";
const FORM = { u: "2", f: "2", s: "", c: "0", m: "0", act: "sub", v: "2", or: "d1b77652-cbee-436c-84e3-e20b2218bdd7" };
// Custom field IDs from the embed code. field[31] ($6M revenue question) is no longer asked.
const FIELDS = { tech: "field[30]", region: "field[29]", company: "field[25]", services: "field[26]", description: "field[27]" } as const;

const yesNo = (v: string) => (v === "yes" ? "Yes" : v === "no" ? "No" : "");

export async function submitActiveCampaignForm(inquiry: Inquiry): Promise<void> {
  const params = new URLSearchParams({ ...FORM, fullname: inquiry.name, email: inquiry.email, phone: inquiry.phone });
  for (const [key, name] of Object.entries(FIELDS)) {
    const value = key === "tech" || key === "region" ? yesNo(inquiry[key]) : inquiry[key as keyof typeof FIELDS];
    if (value) params.set(name, value);
  }
  params.set("jsonp", "true");

  const res = await fetch(`${ACCOUNT}/proc.php?${params}`, { signal: AbortSignal.timeout(10_000) });
  const reply = await res.text();
  // The reply is JavaScript for the embed: _show_thank_you(...) on success, _show_error(...) otherwise.
  if (!res.ok || reply.includes("_show_error") || reply.includes("_show_field_error")) {
    throw new Error(`form responded ${res.status}: ${reply.slice(0, 300)}`);
  }
}
