import type { Inquiry, InquiryField } from "@/lib/inquiry";

/**
 * ActiveCampaign API v3: upserts the contact, adds it to the list, applies the tag (which an
 * ActiveCampaign automation uses to alert the team) and saves the full inquiry as a contact note.
 * Custom fields are optional: any field whose title matches one below is filled in too.
 */
const CUSTOM_FIELDS: Partial<Record<InquiryField, string[]>> = {
  company: ["company"],
  tech: ["technology company", "technology-focused company", "tech company"],
  region: ["us/canada based", "us or canada based", "us- or canada-based company", "region"],
  services: ["services"],
  description: ["description"],
};

const NOTE_LABELS: Record<InquiryField, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  tech: "Technology-focused company",
  region: "US- or Canada-based company",
  company: "Company",
  services: "Services",
  description: "Description",
};

type Config = { url: string; key: string; list?: string; tag?: string };

export function activeCampaignConfig(): Config | null {
  const { ACTIVECAMPAIGN_API_URL: url, ACTIVECAMPAIGN_API_KEY: key, ACTIVECAMPAIGN_LIST_ID: list, ACTIVECAMPAIGN_TAG: tag } = process.env;
  return url && key ? { url: url.replace(/\/+$/, ""), key, list, tag } : null;
}

async function api<T>(cfg: Config, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${cfg.url}/api/3/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Api-Token": cfg.key, "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${body ? "POST" : "GET"} ${path} responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json() as Promise<T>;
}

async function fieldValues(cfg: Config, inquiry: Inquiry) {
  const { fields = [] } = await api<{ fields?: { id: string; title: string }[] }>(cfg, "fields?limit=100");
  const byTitle = new Map(fields.map((f) => [f.title.trim().toLowerCase(), f.id]));
  return Object.entries(CUSTOM_FIELDS).flatMap(([key, titles]) => {
    const id = titles.map((t) => byTitle.get(t)).find(Boolean);
    const value = inquiry[key as InquiryField];
    return id && value ? [{ field: id, value }] : [];
  });
}

async function tagId(cfg: Config, name: string) {
  const { tags = [] } = await api<{ tags?: { id: string; tag: string }[] }>(cfg, `tags?search=${encodeURIComponent(name)}`);
  const found = tags.find((t) => t.tag.toLowerCase() === name.toLowerCase());
  if (found) return found.id;
  const { tag } = await api<{ tag: { id: string } }>(cfg, "tags", { tag: { tag: name, tagType: "contact", description: "Website contact form" } });
  return tag.id;
}

export async function sendToActiveCampaign(cfg: Config, inquiry: Inquiry): Promise<void> {
  const [firstName, ...rest] = inquiry.name.split(/\s+/);
  const { contact } = await api<{ contact: { id: string } }>(cfg, "contact/sync", {
    contact: {
      email: inquiry.email,
      firstName,
      lastName: rest.join(" "),
      phone: inquiry.phone || undefined,
      fieldValues: await fieldValues(cfg, inquiry),
    },
  });

  if (cfg.list) await api(cfg, "contactLists", { contactList: { list: cfg.list, contact: contact.id, status: 1 } });

  const note = (Object.keys(NOTE_LABELS) as InquiryField[]).map((k) => `${NOTE_LABELS[k]}: ${inquiry[k] || "-"}`).join("\n");
  await api(cfg, "notes", { note: { note: `Website inquiry (blacklakecap.com/investors)\n\n${note}`, relid: contact.id, reltype: "Subscriber" } });

  // Tag last: it triggers the team alert, so the note and list are already in place.
  if (cfg.tag) await api(cfg, "contactTags", { contactTag: { contact: contact.id, tag: await tagId(cfg, cfg.tag) } });
}
