interface JsonLdProps {
  id?: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Renders a Schema.org JSON-LD script block safely escaped for HTML embedding.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

