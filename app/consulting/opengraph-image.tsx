import { ImageResponse } from "next/og";

/**
 * The card Steward AI becomes when its link is shared — in a pastors'
 * group chat, a church staff Slack, an elder board email. Heavenly blue
 * with a horizon of cloud, the practice's name at center.
 */

export const runtime = "nodejs";
export const alt = "Steward AI — AI consulting for churches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

let fontCache: ArrayBuffer | null = null;

async function loadSerif(): Promise<ArrayBuffer | null> {
  if (fontCache) return fontCache;
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.13/files/cormorant-garamond-latin-600-normal.woff",
    );
    if (!res.ok) return null;
    fontCache = await res.arrayBuffer();
    return fontCache;
  } catch {
    return null;
  }
}

/**
 * The sky is drawn entirely with the container's own radial gradients.
 * Satori does not place absolutely-positioned children reliably — a
 * floating "cloud" div lands in flex flow and reads as a grey pill behind
 * the wordmark — so the haze lives in one backgroundImage instead.
 */
const SKY = [
  // Light breaking at the top, as on the page's hero.
  "radial-gradient(880px 460px at 50% 4%, rgba(74,127,184,0.55), transparent 70%)",
  // Banks of cloud, upper left and upper right.
  "radial-gradient(520px 150px at 12% 20%, rgba(219,232,246,0.16), transparent 72%)",
  "radial-gradient(460px 130px at 88% 13%, rgba(219,232,246,0.12), transparent 72%)",
  // A low horizon of haze.
  "radial-gradient(760px 200px at 38% 92%, rgba(219,232,246,0.1), transparent 74%)",
  "radial-gradient(620px 360px at 86% 100%, rgba(47,94,147,0.45), transparent 65%)",
].join(", ");

export default async function ConsultingOgImage() {
  const background = {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#142644",
    backgroundImage: SKY,
  };

  const font = await loadSerif();

  // Without a font we cannot draw text — send the sky alone.
  if (!font) {
    return new ImageResponse(<div style={background} />, { ...size });
  }

  return new ImageResponse(
    (
      <div style={{ ...background, fontFamily: "Cormorant" }}>
        <div style={{ fontSize: 24, letterSpacing: 12, color: "#dbe8f6" }}>
          AI CONSULTING FOR CHURCHES
        </div>
        <div style={{ marginTop: 18, fontSize: 104, color: "#f4f8fd" }}>Steward AI</div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            color: "rgba(244,248,253,0.76)",
            textAlign: "center",
            padding: "0 110px",
            lineHeight: 1.35,
          }}
        >
          Policy, data reverence, and training — so your church adopts AI with wisdom.
        </div>
        <div style={{ marginTop: 44, fontSize: 26, color: "#9dc0e4" }}>A practice of Legacy</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: font, weight: 600, style: "normal" }] },
  );
}
