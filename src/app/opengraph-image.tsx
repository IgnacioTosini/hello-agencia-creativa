import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Hello Agencia Creativa — estrategia, diseño y creatividad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public/logo.jpg"),
  "base64",
);
const logoSrc = `data:image/jpeg;base64,${logoData}`;

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
        background: "#baff1f",
        color: "#16171d",
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
          background: "#ed54ef",
          opacity: 0.22,
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
          background: "#ed54ef",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 36,
          display: "flex",
          border: "2px solid rgba(22,23,29,0.14)",
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width="250"
          height="250"
          style={{ width: 250, height: 250, objectFit: "cover" }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Hello Agencia Creativa
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            color: "#34363f",
            fontSize: 26,
          }}
        >
          Estrategia · Diseño · Creatividad
        </div>
      </div>
    </div>,
    size,
  );
}
