/** Renders **bold** and *italic* spans from content strings. Content stays plain text in JSON. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
      })}
    </>
  );
}
