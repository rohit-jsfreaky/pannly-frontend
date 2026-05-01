import ReactMarkdown from "react-markdown";

interface Props {
  source: string;
}

/**
 * Renders idea brief markdown with our prose styles. Sections (`## ...`)
 * become serif headings; quotes are tinted plum to mirror the design.
 */
export function BriefMarkdown({ source }: Props) {
  // Strip the locked marker if present (free preview leaves it in).
  const cleaned = source.replace("<!-- locked -->", "").trim();

  return (
    <article className="prose prose-pannly max-w-none">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mt-10 mb-3 font-display text-2xl text-ink-700">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-2 font-display text-xl text-ink-700">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-base leading-relaxed text-ink-500">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc text-base leading-relaxed text-ink-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal text-base leading-relaxed text-ink-500">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-plum-500 bg-cream-200 px-4 py-2 italic text-plum-500">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:decoration-moss-500"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-ink-700">{children}</strong>
          ),
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </article>
  );
}
