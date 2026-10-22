"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitInquiry } from "@/app/actions";
import type { InquiryState } from "@/lib/inquiry";

type Labels = {
  title: string;
  submitLabel: string;
  successMessage: string;
  fields: Record<"name" | "email" | "phone" | "tech" | "region" | "company" | "services" | "description", string>;
};

const input = "mt-1.5 block min-h-11 w-full rounded-md border border-[#9aa3ae] bg-white px-3 py-2 text-ink placeholder:text-[#6b6b6b] focus:border-blue";

/** Founder inquiry form from the Investors page. Works without JS (server action). */
export function ContactForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  const f = labels.fields;
  const err = (k: string) => state.errors?.[k];

  if (state.status === "success") {
    return (
      <div className="bg-sky p-8 text-ink" role="status">
        <p className="text-2xl font-bold">{labels.successMessage}</p>
      </div>
    );
  }

  const yesNo = (name: "tech" | "region") => (
    <fieldset className="mt-5">
      <legend className="font-semibold text-ink">{f[name]}</legend>
      <div className="mt-1 flex gap-6">
        {["yes", "no"].map((v) => (
          <label key={v} className="flex min-h-11 items-center gap-2 capitalize">
            <input type="radio" name={name} value={v} className="size-4 accent-navy" />
            {v}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form action={action} className="bg-sky px-5 py-6 text-[0.9375rem] text-ink sm:px-6" noValidate>
      <h2 className="text-2xl leading-tight font-bold text-black">{labels.title}</h2>
      {state.message ? (
        <p className="mt-4 rounded-md bg-white px-3 py-2 font-semibold text-[#b3261e]" role="alert">
          {state.message}
        </p>
      ) : null}

      <label className="mt-5 block font-semibold">
        {f.name}
        <span className="text-[#c00]" aria-hidden="true">*</span>
        <input name="name" required autoComplete="name" placeholder="Type your name" className={input} aria-invalid={Boolean(err("name"))} aria-describedby={err("name") ? "err-name" : undefined} />
        {err("name") ? <span id="err-name" className="mt-1 block text-sm text-[#b3261e]">{err("name")}</span> : null}
      </label>
      <label className="mt-4 block font-semibold">
        {f.email}
        <span className="text-[#c00]" aria-hidden="true">*</span>
        <input name="email" type="email" required autoComplete="email" placeholder="Type your email" className={input} aria-invalid={Boolean(err("email"))} aria-describedby={err("email") ? "err-email" : undefined} />
        {err("email") ? <span id="err-email" className="mt-1 block text-sm text-[#b3261e]">{err("email")}</span> : null}
      </label>
      <label className="mt-4 block font-semibold">
        {f.phone}
        <input name="phone" type="tel" autoComplete="tel" placeholder="Type your phone number" className={input} />
      </label>

      {yesNo("tech")}
      {yesNo("region")}

      <label className="mt-5 block font-semibold">
        {f.company}
        <input name="company" autoComplete="organization" className={input} />
      </label>
      <label className="mt-4 block font-semibold">
        {f.services}
        <input name="services" className={input} />
      </label>
      <label className="mt-4 block font-semibold">
        {f.description}
        <textarea name="description" rows={3} className={input} />
      </label>

      {/* Spam traps: hidden field bots fill in, and the time the form was opened */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <button type="submit" disabled={pending} className="mt-7 inline-flex min-h-12 items-center rounded-2xl bg-navy px-6 py-3 font-medium text-white hover:bg-blue disabled:opacity-60">
        {pending ? "Sending…" : labels.submitLabel}
      </button>
    </form>
  );
}
