/**
 * Turn a livestream or recording link into an embeddable player URL.
 * Only well-known video hosts are embedded — anything else stays a plain
 * link. Returns null when the URL should not (or cannot) be embedded.
 */
export function livestreamEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  const host = parsed.hostname.toLowerCase().replace(/^www\.|^m\./, "");

  const YT_ID = /^[A-Za-z0-9_-]{6,20}$/;
  if (host === "youtu.be") {
    const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    return YT_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts[0] === "watch") {
      const id = parsed.searchParams.get("v") ?? "";
      return YT_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if ((parts[0] === "live" || parts[0] === "embed" || parts[0] === "shorts") && parts[1]) {
      return YT_ID.test(parts[1]) ? `https://www.youtube-nocookie.com/embed/${parts[1]}` : null;
    }
    return null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    const id = parts[0] === "video" ? parts[1] : parts[0];
    return id && /^\d{6,12}$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}
