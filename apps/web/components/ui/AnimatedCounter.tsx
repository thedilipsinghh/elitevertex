"use client";

import { useEffect, useRef, useState } from "react";

export interface ParsedCounterValue {
  prefix: string;
  target: number;
  decimals: number;
  hasCommas: boolean;
  suffix: string;
  isNumeric: boolean;
  raw: string;
}

/**
 * Parses an admin-configured metric string such as `370+`, `95%`, `1,200+`, or `4.9★`
 * into numeric target + formatting metadata for smooth count-up animation.
 */
export function parseCounterValue(rawInput: string | number | null | undefined): ParsedCounterValue {
  const raw = String(rawInput ?? "").trim();
  if (!raw) {
    return { prefix: "", target: 0, decimals: 0, hasCommas: false, suffix: "", isNumeric: false, raw: "" };
  }

  const match = raw.match(/^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, decimals: 0, hasCommas: false, suffix: "", isNumeric: false, raw };
  }

  const prefix = match[1] ?? "";
  const numStr = match[2] ?? "0";
  const suffix = match[3] ?? "";
  const hasCommas = numStr.includes(",");
  const dotIdx = numStr.indexOf(".");
  const decimals = dotIdx >= 0 ? numStr.length - dotIdx - 1 : 0;
  const target = Number(numStr.replace(/,/g, ""));

  if (!Number.isFinite(target)) {
    return { prefix: "", target: 0, decimals: 0, hasCommas: false, suffix: "", isNumeric: false, raw };
  }

  return { prefix, target, decimals, hasCommas, suffix, isNumeric: true, raw };
}

function formatNumberValue(val: number, decimals: number, hasCommas: boolean): string {
  const fixed = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
  if (!hasCommas) return fixed;

  const [intPart = "0", decPart] = fixed.split(".");
  const grouped = Number(intPart).toLocaleString("en-US");
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}

export interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
  replayKey?: number;
  onStart?: () => void;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  delay = 0,
  className = "",
  replayKey = 0,
  onStart,
}: AnimatedCounterProps) {
  const parsed = parseCounterValue(value);
  const elRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [display, setDisplay] = useState<string>(() =>
    parsed.isNumeric
      ? `${parsed.prefix}${formatNumberValue(0, parsed.decimals, parsed.hasCommas)}${parsed.suffix}`
      : parsed.raw
  );

  // Detect visibility on scroll (or immediately if already within viewport)
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [replayKey]);

  // Run smooth ease-out requestAnimationFrame count-up
  useEffect(() => {
    if (!parsed.isNumeric) {
      setDisplay(parsed.raw);
      return;
    }

    if (!inView) {
      setDisplay(
        `${parsed.prefix}${formatNumberValue(0, parsed.decimals, parsed.hasCommas)}${parsed.suffix}`
      );
      return;
    }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(parsed.raw);
      onStart?.();
      return;
    }

    let rafId = 0;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const startAnimation = () => {
      if (cancelled) return;
      onStart?.();
      const startTime = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / Math.max(200, duration));
        // Smooth deceleration easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = parsed.target * eased;
        const formatted = formatNumberValue(current, parsed.decimals, parsed.hasCommas);
        setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplay(parsed.raw);
        }
      };

      rafId = requestAnimationFrame(step);
    };

    if (delay > 0) {
      delayTimer = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [inView, parsed.raw, parsed.isNumeric, parsed.target, parsed.prefix, parsed.suffix, parsed.decimals, parsed.hasCommas, duration, delay, replayKey, onStart]);

  return (
    <span ref={elRef} className={className} aria-label={parsed.raw}>
      {display}
    </span>
  );
}

