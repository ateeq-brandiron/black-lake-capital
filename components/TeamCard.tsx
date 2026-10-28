import { ImageSlot } from "@/components/ImageSlot";
import { LinkedInIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import { RichText } from "@/components/RichText";
import type { ImageRef } from "@/lib/content";

export type TeamMember = {
  name: string;
  role: string;
  bio: string[];
  photo?: ImageRef;
  phone?: string | null;
  email?: string | null;
  linkedin?: { href: string | null; label?: string } | null;
};

type Props = {
  member: TeamMember;
  /** "partner" = large photo + bio (alternating sides); "advisor" = text column, no photo. */
  variant?: "partner" | "advisor";
  reverse?: boolean;
};

function ContactLink({ href, icon, label, srLabel }: { href: string; icon: React.ReactNode; label?: string; srLabel: string }) {
  return (
    <a href={href} className="group flex flex-col items-center gap-3 text-center text-navy hover:text-blue" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
      <span className="flex size-22 items-center justify-center rounded-full border-4 border-[#4472c4] text-[#4472c4] transition-colors group-hover:bg-blue group-hover:text-white">{icon}</span>
      {label ? <span className="break-all">{label}</span> : <span className="sr-only">{srLabel}</span>}
    </a>
  );
}

export function TeamCard({ member, variant = "partner", reverse = false }: Props) {
  const contacts = !member.phone && !member.email ? null : (
    <div className={`mt-10 grid gap-6 ${variant === "partner" ? "max-w-xl grid-cols-1 sm:grid-cols-2" : "justify-items-center"}`}>
      {member.phone ? <ContactLink href={`tel:${member.phone.replace(/[^\d+]/g, "")}`} icon={<PhoneIcon className="size-11" />} label={member.phone} srLabel={`Call ${member.name}`} /> : null}
      {member.email ? <ContactLink href={`mailto:${member.email}`} icon={<MailIcon className="size-11" />} label={member.email} srLabel={`Email ${member.name}`} /> : null}
    </div>
  );

  const text = (
    <div>
      {/* LinkedIn sits right after the name, small (27 Oct review: the large circle looked detached) */}
      <div className="flex items-center gap-3">
        <h3 className="text-[clamp(1.625rem,1.3rem+1vw,2rem)] leading-none font-medium text-ink">{member.name}</h3>
        {member.linkedin?.href ? (
          <a href={member.linkedin.href} target="_blank" rel="noopener" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linkedin text-white transition-colors hover:bg-navy">
            <LinkedInIcon className="size-4.5" />
            <span className="sr-only">{member.name} on LinkedIn (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
      <p className="mt-3 text-blue-stat">{member.role}</p>
      <div className={`mt-8 space-y-4 ${variant === "partner" ? "[&_strong]:font-semibold [&_strong]:text-navy" : ""}`}>
        {member.bio.map((p, i) => (
          <p key={i}>
            <RichText text={p} />
          </p>
        ))}
      </div>
      {contacts}
    </div>
  );

  if (variant === "advisor") return <article>{text}</article>;

  return (
    <article className={`grid items-start gap-10 md:gap-14 ${reverse ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]" : "md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"}`}>
      <ImageSlot image={member.photo ?? { src: null }} label={`${member.name} headshot`} sizes="(min-width: 768px) 320px, 100vw" className={`aspect-2/3 w-full max-w-80 rounded-card ${reverse ? "md:order-2 md:justify-self-end" : ""}`} />
      {text}
    </article>
  );
}
