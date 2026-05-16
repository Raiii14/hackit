import type { ReactNode } from "react";

function segmentsToNodes(segments: string[], keyPrefix: string): ReactNode[] {
  return segments.map((segment, i) => {
    const key = `${keyPrefix}-${i}`;
    if (segment.startsWith("**") && segment.endsWith("**") && segment.length >= 4) {
      return (
        <strong key={key} style={{ fontWeight: 700 }}>
          {segment.slice(2, -2)}
        </strong>
      );
    }
    return <span key={key}>{segment}</span>;
  });
}

/** Minimal formatting: **bold**, newlines, `-` / `*` bullets. Not full Markdown. */
export function formatChatAssistantText(text: string): ReactNode {
  const lines = text.split(/\r?\n/);
  return lines.map((line, lineIndex) => {
    const t = line.trimEnd();
    if (!t.trim()) {
      return <br key={`br-${lineIndex}`} />;
    }

    const bullet = t.match(/^[-*]\s+(.*)$/);
    const content = bullet ? bullet[1]! : t;
    const rawParts = content.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
    const nodes = segmentsToNodes(rawParts, `ln${lineIndex}`);

    if (bullet) {
      return (
        <div key={lineIndex} className="flex gap-2 pl-1" style={{ marginBottom: "0.25rem" }}>
          <span style={{ flexShrink: 0 }}>•</span>
          <span>{nodes}</span>
        </div>
      );
    }

    return (
      <p key={lineIndex} style={{ margin: "0 0 0.35rem 0" }}>
        {nodes}
      </p>
    );
  });
}
