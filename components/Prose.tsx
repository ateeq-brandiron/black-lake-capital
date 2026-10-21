/**
 * Renders imported WordPress HTML (posts, legal pages). The HTML is sanitized to a small
 * tag allowlist at import time (scripts/import-posts.py), so it is safe to inject.
 */
export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`max-w-none text-lg leading-relaxed text-ink [&_a]:text-blue [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-blue [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-blue [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-semibold [&_h4]:mt-8 [&_h4]:text-xl [&_h4]:font-semibold [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-card [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-5 [&_table]:my-8 [&_table]:w-full [&_td]:border [&_td]:border-mist [&_td]:p-2 [&_th]:border [&_th]:border-mist [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
