interface Props {
  pain: string | null;
}

/**
 * The "## The pain" body. Renders newline-separated paragraphs from
 * `pain_md`. We keep it plain text intentionally — the brief generator is
 * told NOT to use lists or tables here, and the design treats the pain as
 * the lead paragraph block.
 */
export function PainSection({ pain }: Props) {
  if (!pain) return null;
  const paragraphs = pain.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (!paragraphs.length) return null;

  return (
    <section>
      <h2 className="mb-4 font-display text-2xl text-ink-700">The pain</h2>
      <div className="space-y-4 text-base leading-relaxed text-ink-50">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
