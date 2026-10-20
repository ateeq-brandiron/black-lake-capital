import type { Inquiry } from "@/lib/inquiry";

/**
 * Sends an inquiry. EMAIL_PROVIDER=resend posts to the Resend REST API (no SDK dependency);
 * the default "log" mode only prints to the server log, so previews never send mail.
 */
export async function sendInquiry(inquiry: Inquiry): Promise<boolean> {
  const body = Object.entries(inquiry)
    .map(([k, v]) => `${k}: ${v || "-"}`)
    .join("\n");

  if (process.env.EMAIL_PROVIDER !== "resend") {
    console.info("[inquiry] EMAIL_PROVIDER is not 'resend'; not sending.\n" + body);
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
