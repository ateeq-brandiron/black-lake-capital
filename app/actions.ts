"use server";

import { sendInquiry } from "@/lib/email";
import { type InquiryState, validateInquiry } from "@/lib/inquiry";

const MIN_FILL_MS = 3000;

/**
 * Contact form on /investors/. Honeypot + time trap; silently "succeeds" for bots.
 * startedAt is set by JS, so a no-JS submission (no timestamp) skips only the time trap.
 */
export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const startedAt = Number(form.get("startedAt"));
  if (form.get("website")) return { status: "success" };
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return { status: "success" };

  const result = validateInquiry(form);
  if ("errors" in result) return { status: "error", message: "Please check the highlighted fields.", errors: result.errors };

  const sent = await sendInquiry(result.inquiry);
  if (!sent) return { status: "error", message: "Sorry, something went wrong. Please email us instead." };
  return { status: "success" };
}
