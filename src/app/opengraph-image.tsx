import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";

/**
 * The link preview card. It carries three things and nothing else: the name,
 * the role line and the availability line. No metrics and no employer claims.
 * Drawn in the site's dark theme: paper, ink, one signal colour, hairlines.
 */

export const alt = `${profile.name}, ${profile.role.split(" · ").join(", ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#0f0e0c";
const INK = "#efe9dc";
const GRAPHITE = "#aba396";
const EDGE = "#7a7263";
const RULE = "#2b2822";
const SIGNAL = "#e6b563";

const font = (file: string) => readFile(join(process.cwd(), "src/app/fonts", file));

/** Facts written "a · b" in content are set apart by hairlines, as on the site. */
function Facts({ text, color, size: fontSize }: { text: string; color: string; size: number }) {
  const parts = text.split(" · ");
  return (
    <div style={{ display: "flex", alignItems: "center", color, fontSize }}>
      {parts.map((part, i) => (
        <div key={part} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <div style={{ width: 1, height: fontSize, background: EDGE, margin: "0 18px" }} />}
          {part}
        </div>
      ))}
    </div>
  );
}

export default async function OpengraphImage() {
  const [display, text, mono] = await Promise.all([
    font("Archivo-ExpandedExtraBold.ttf"),
    font("Archivo-Medium.ttf"),
    font("JetBrainsMono-Medium.ttf"),
  ]);
  const words = profile.name.split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "56px 64px",
          fontFamily: "Archivo",
          // The measured dot grid.
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239,233,220,0.09) 1.2px, transparent 1.6px)`,
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Archivo Expanded", fontSize: 30, color: INK }}>
          KRY<span style={{ color: SIGNAL }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo Expanded", fontSize: 132, lineHeight: 0.88, letterSpacing: -4 }}>
          {words.map((word) => (
            <div key={word} style={{ display: "flex" }}>
              {word}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${RULE}`, paddingTop: 26 }}>
          <Facts text={profile.role} color={INK} size={34} />
          <div style={{ display: "flex", alignItems: "center", marginTop: 16, fontFamily: "JetBrains Mono" }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: SIGNAL, marginRight: 14 }} />
            <Facts text={profile.availability.status} color={GRAPHITE} size={23} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Expanded", data: display, weight: 800, style: "normal" },
        { name: "Archivo", data: text, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
