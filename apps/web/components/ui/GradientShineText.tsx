import React from "react";

export function splitShinePhrase(
  rawText: string,
  tailWords = 2
): { prefix: string; highlight: string } {
  const trimmed = rawText.trim().replace(/\s+([.!?])/g, "$1");
  if (!trimmed) {
    return { prefix: "", highlight: "" };
  }

  // Prefer emphasizing the closing sentence on multi-sentence headlines (e.g. "Speak With Confidence. Go Further.")
  const sentenceMatch = trimmed.match(/^(.*[.!?])\s+([^\s].*)$/);
  if (sentenceMatch) {
    return {
      prefix: sentenceMatch[1] ?? "",
      highlight: sentenceMatch[2] ?? "",
    };
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 2) {
    return { prefix: "", highlight: trimmed };
  }

  const count = Math.min(Math.max(1, tailWords), words.length - 1);
  return {
    prefix: words.slice(0, words.length - count).join(" "),
    highlight: words.slice(words.length - count).join(" "),
  };
}

export interface GradientShineTextProps {
  text: string;
  tailWords?: number;
  breakBeforeHighlight?: boolean;
  shineClassName?: string;
}

/**
 * Splits a dynamic headline or CMS phrase so the closing clause/words carry
 * the animated `.gradient-text-shine` treatment while keeping surrounding ink readable.
 */
export function GradientShineText({
  text,
  tailWords = 2,
  breakBeforeHighlight = false,
  shineClassName = "gradient-text-shine font-extrabold tracking-[-0.02em]",
}: GradientShineTextProps) {
  const { prefix, highlight } = splitShinePhrase(text, tailWords);

  if (!highlight) return null;

  if (!prefix) {
    return <span className={shineClassName}>{highlight}</span>;
  }

  return (
    <>
      {prefix}
      {breakBeforeHighlight ? (
        <>
          <span className="sm:hidden"> </span>
          <br className="hidden sm:inline" />
        </>
      ) : (
        " "
      )}
      <span className={shineClassName}>{highlight}</span>
    </>
  );
}

