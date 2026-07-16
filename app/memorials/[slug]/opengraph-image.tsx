import { ImageResponse } from "next/og";
import { memorialBySlug } from "@/lib/data/memorials";
import { getPublishedMemorial } from "@/lib/server/memorials";

/**
 * The card a memorial becomes when its link is shared — in a family text
 * thread, a church group chat, a congregation's page. Reverent night and
 * gold, the loved one's name at center.
 */

export const runtime = "nodejs";
export const alt = "In Loving Memory";
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

function GoldCross({ scale = 1 }: { scale?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: 60 * scale,
        height: 84 * scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 10 * scale,
          height: 84 * scale,
          background: "#c9a961",
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20 * scale,
          width: 60 * scale,
          height: 10 * scale,
          background: "#c9a961",
          borderRadius: 4,
        }}
      />
    </div>
  );
}

export default async function MemorialOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sample = memorialBySlug(slug);
  const published = sample ? null : getPublishedMemorial(slug);

  const name = sample?.fullName ?? published?.data.fullName ?? "A Life Remembered";
  const birth = sample?.birthDate ?? published?.data.birthDate ?? "";
  const death = sample?.deathDate ?? published?.data.deathDate ?? "";
  const years = birth && death ? `${birth.slice(0, 4)} — ${death.slice(0, 4)}` : "";
  const location = sample?.location ?? published?.data.locationText ?? "";
  const subtitle = [years, location].filter(Boolean).join("  ·  ");

  const background = {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171d2b",
    backgroundImage:
      "radial-gradient(900px 460px at 50% 8%, rgba(163,131,63,0.4), transparent 70%), radial-gradient(600px 340px at 88% 100%, rgba(111,127,106,0.3), transparent 65%)",
  };

  const font = await loadSerif();

  // Without a font we cannot draw text — send a dignified emblem instead.
  if (!font) {
    return new ImageResponse(
      (
        <div style={background}>
          <GoldCross scale={2.4} />
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div style={{ ...background, fontFamily: "Cormorant" }}>
        <GoldCross />
        <div
          style={{
            marginTop: 34,
            fontSize: 26,
            letterSpacing: 14,
            color: "#ecdfc2",
          }}
        >
          IN LOVING MEMORY OF
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: name.length > 26 ? 68 : 84,
            color: "#faf7f1",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {name}
        </div>
        {subtitle ? (
          <div style={{ marginTop: 16, fontSize: 32, color: "rgba(250,247,241,0.72)" }}>
            {subtitle}
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            bottom: 38,
            fontSize: 30,
            color: "#c9a961",
          }}
        >
          Legacy
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: font, weight: 600, style: "normal" }] },
  );
}
