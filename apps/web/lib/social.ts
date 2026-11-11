export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "youtube";

const PLATFORM_PREFIX: Record<SocialPlatform, string> = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  linkedin: "https://www.linkedin.com/in/",
  youtube: "https://www.youtube.com/@",
};

const GENERIC_SEGMENTS = new Set(["in", "company", "school", "showcase", "c", "user", "channel", "pages", "pg"]);

/**
 * Normalizes a CMS-entered social link, domain path, or @handle into a safe HTTPS URL.
 * Returns null when blank or using an unsafe scheme so unconfigured icons can stay hidden.
 */
export function normalizeSocialUrl(raw?: string | null, platform?: SocialPlatform): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return null;
  }

  let candidate = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    candidate = trimmed;
  } else if (trimmed.startsWith("@")) {
    if (!platform) return null;
    const handle = trimmed.replace(/^@+/, "");
    if (!handle) return null;
    candidate = `${PLATFORM_PREFIX[platform]}${handle}`;
  } else if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) {
    candidate = `https://${trimmed}`;
  } else if (platform) {
    const handle = trimmed.replace(/^\/+/, "");
    if (!handle) return null;
    candidate = `${PLATFORM_PREFIX[platform]}${handle}`;
  } else {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return candidate;
  } catch {
    return null;
  }
}

/**
 * Extracts a concise dynamic handle or path label from a configured social URL
 * for hover tooltips (e.g. `@elitevertexmairwa` or `/elitevertexmairwa`).
 */
export function extractSocialHandle(
  raw?: string | null,
  platform?: SocialPlatform,
  fallback = "Official Profile"
): string {
  if (!raw || !raw.trim()) return fallback;
  const trimmed = raw.trim();

  if (trimmed.startsWith("@") && !trimmed.includes("/")) {
    return trimmed;
  }

  const normalized = normalizeSocialUrl(trimmed, platform);
  if (!normalized) return fallback;

  try {
    const url = new URL(normalized);
    const segments = url.pathname.split("/").filter(Boolean);
    const first = segments[0];
    if (!first) return fallback;

    const second = segments[1];
    const slug = GENERIC_SEGMENTS.has(first.toLowerCase()) && second ? second : first;

    if (platform === "instagram") {
      return `@${slug.replace(/^@/, "")}`;
    }

    if (platform === "youtube") {
      return slug.startsWith("@") ? slug : `/${slug}`;
    }

    if (platform === "facebook" && slug.toLowerCase() === "profile.php") {
      return fallback;
    }

    return slug.startsWith("@") ? slug : `/${slug}`;
  } catch {
    return fallback;
  }
}

/**
 * Normalizes numeric phone input into WhatsApp-compatible E.164 digits without `+`.
 * Automatically prepends India code `91` for standard 10-digit numbers or `0`-prefixed 11-digit numbers.
 */
export function normalizeWhatsAppDigits(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Builds a valid WhatsApp chat link from either a phone number or a direct wa.me / whatsapp URL.
 */
export function formatWhatsAppUrl(raw?: string | null, message?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || /^(javascript|data|vbscript):/i.test(trimmed)) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === "http:" || parsed.protocol === "https:" ? trimmed : null;
    } catch {
      return null;
    }
  }

  if (/^(www\.)?(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  const digits = normalizeWhatsAppDigits(trimmed);
  if (!digits) return null;

  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Formats a saved WhatsApp phone or link for hover tooltip subtitles.
 */
export function formatWhatsAppDisplay(raw?: string | null, fallback = "Direct Chat"): string {
  if (!raw || !raw.trim()) return fallback;
  const trimmed = raw.trim();

  if (/^https?:\/\//i.test(trimmed) || /(wa\.me|whatsapp\.com)/i.test(trimmed)) {
    const match = trimmed.match(/wa\.me\/(\d{8,15})/);
    const matchedDigits = match?.[1];
    if (!matchedDigits) return "Direct Link";
    return formatDigitsLabel(matchedDigits);
  }

  const digits = normalizeWhatsAppDigits(trimmed);
  return digits ? formatDigitsLabel(digits) : fallback;
}

function formatDigitsLabel(digits: string): string {
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}
