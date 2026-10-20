export type InquiryState = { status: "idle" | "success" | "error"; message?: string; errors?: Partial<Record<string, string>> };

export const INQUIRY_FIELDS = ["name", "email", "phone", "tech", "region", "revenue", "company", "services", "description"] as const;
export type InquiryField = (typeof INQUIRY_FIELDS)[number];
export type Inquiry = Record<InquiryField, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the contact form. Returns field errors, or the cleaned inquiry. */
export function validateInquiry(form: FormData): { inquiry: Inquiry } | { errors: Partial<Record<InquiryField, string>> } {
  const inquiry = Object.fromEntries(INQUIRY_FIELDS.map((f) => [f, String(form.get(f) ?? "").trim().slice(0, 2000)])) as Inquiry;
  const errors: Partial<Record<InquiryField, string>> = {};
  if (!inquiry.name) errors.name = "Please enter your name.";
  if (!EMAIL.test(inquiry.email)) errors.email = "Please enter a valid email address.";
  for (const f of ["tech", "region", "revenue"] as const) {
    if (inquiry[f] && inquiry[f] !== "yes" && inquiry[f] !== "no") errors[f] = "Please choose yes or no.";
  }
  return Object.keys(errors).length ? { errors } : { inquiry };
}
