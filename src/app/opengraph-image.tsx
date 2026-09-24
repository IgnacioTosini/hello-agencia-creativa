import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background:
          "linear-gradient(120deg, #efedff 0%, #f8f8ff 55%, #dffafa 100%)",
        color: "#16171d",
      }}
    >
      <div style={{ display: "flex", fontSize: 54, fontWeight: 800 }}>
        hello<span style={{ color: "#6845ef" }}>.</span>
      </div>
      <div
        style={{ maxWidth: 900, marginTop: 48, fontSize: 66, fontWeight: 700 }}
      >
        Estrategia, diseño y creatividad para comunicar mejor.
      </div>
    </div>,
    size,
  );
}
