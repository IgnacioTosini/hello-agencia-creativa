import { ImageResponse } from "next/og";

export const alt = "Hello Agencia Creativa — estrategia, diseño y creatividad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#16171d",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -170,
          left: -100,
          width: 500,
          height: 500,
          display: "flex",
          borderRadius: 999,
          background: "#6845ef",
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -130,
          bottom: -220,
          width: 580,
          height: 580,
          display: "flex",
          borderRadius: 999,
          background: "#00bfae",
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 36,
          display: "flex",
          border: "2px solid rgba(255,255,255,0.16)",
          borderRadius: 34,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "70px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 168,
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-0.08em",
          }}
        >
          hello<span style={{ color: "#c3b6ff" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 58,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          Estrategia · Diseño · Creatividad
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            color: "#d4d8e3",
            fontSize: 24,
          }}
        >
          Ideas con intención para marcas que quieren comunicar mejor.
        </div>
      </div>
    </div>,
    size,
  );
}
