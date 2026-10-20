type LegalContent = { title: string; body: string | null; note: string };

export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <article className="container-page max-w-3xl py-24">
      <h1 className="type-display">{content.title}</h1>
      {content.body ? (
        <div className="mt-10 space-y-5 leading-relaxed">
          {content.body.split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-card border border-dashed border-muted px-6 py-8 text-sm">{content.note}</p>
      )}
    </article>
  );
}
