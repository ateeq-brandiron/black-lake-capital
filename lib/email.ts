import { activeCampaignConfig, sendToActiveCampaign } from "@/lib/activecampaign";
import type { Inquiry } from "@/lib/inquiry";

/**
 * Sends an inquiry. EMAIL_PROVIDER=activecampaign adds the contact to ActiveCampaign;
 * EMAIL_PROVIDER=resend posts to the Resend REST API (no SDK dependency).
 * The default "log" mode only prints to the server log (staging: set nothing).
 */
export async function sendInquiry(inquiry: Inquiry): Promise<boolean> {
  const body = Object.entries(inquiry)
    .map(([k, v]) => `${k}: ${v || "-"}`)
    .join("\n");
  const provider = process.env.EMAIL_PROVIDER;

  if (provider === "activecampaign") {
    const cfg = activeCampaignConfig();
    if (!cfg) {
      console.error("[inquiry] ActiveCampaign is selected but ACTIVECAMPAIGN_API_URL or ACTIVECAMPAIGN_API_KEY is missing.\n" + body);
      return false;
    }
    try {
      await sendToActiveCampaign(cfg, inquiry);
      return true;
    } catch (error) {
      // The inquiry is logged so it can be recovered from the Vercel logs.
      console.error("[inquiry] ActiveCampaign failed:", error instanceof Error ? error.message : error, "\n" + body);
      return false;
    }
  }

  if (provider !== "resend") {
    console.info(`[inquiry] EMAIL_PROVIDER is '${provider ?? "log"}'; not sending.\n` + body);
    return true;
  }
  const { RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL || !INQUIRY_FROM_EMAIL) {
    console.error("[inquiry] Resend is selected but RESEND_API_KEY, INQUIRY_TO_EMAIL or INQUIRY_FROM_EMAIL is missing.");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: INQUIRY_FROM_EMAIL,
      to: INQUIRY_TO_EMAIL.split(",").map((s) => s.trim()),
      reply_to: inquiry.email,
      subject: `Website inquiry: ${inquiry.company || inquiry.name}`,
      text: body,
    }),
  });
  if (!res.ok) console.error("[inquiry] Resend responded", res.status, await res.text());
  return res.ok;
}
