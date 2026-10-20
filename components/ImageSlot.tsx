import Image from "next/image";
import type { ImageRef } from "@/lib/content";

type Props = {
  image: ImageRef;
  /** Short description shown on the placeholder while the asset is missing. */
  label?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** "photo" = dark gradient behind white text; "light" = pale placeholder for logos/icons. */
  placeholder?: "photo" | "light";
  fit?: "cover" | "contain";
};

/** next/image when the asset exists, otherwise a labelled placeholder of the same footprint. */
export function ImageSlot({ image, label, sizes, className = "", priority, placeholder = "photo", fit = "cover" }: Props) {
  if (image.src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={image.src} alt={image.alt ?? ""} fill sizes={sizes} priority={priority} className={fit === "cover" ? "object-cover" : "object-contain"} />
      </div>
    );
  }
  const tone =
    placeholder === "photo"
      ? "bg-[linear-gradient(160deg,#5b7895_0%,#2e3b54_55%,#1b2537_100%)] text-white/70"
      : "bg-white/60 text-muted outline-1 outline-dashed outline-muted/50";
  return (
    <div className={`relative flex justify-center overflow-hidden ${placeholder === "photo" ? "items-start pt-12" : "items-end"} ${tone} ${className}`} role={image.alt ? "img" : undefined} aria-label={image.alt || undefined}>
      {label ? <span className="m-2 text-center text-[0.6875rem] font-medium uppercase tracking-wider" aria-hidden="true">Image pending: {label}</span> : null}
    </div>
  );
}
