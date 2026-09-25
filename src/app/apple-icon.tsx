import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public/logo.jpg"),
  "base64",
);
const logoSrc = `data:image/jpeg;base64,${logoData}`;

export default function AppleIcon() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt=""
      width="180"
      height="180"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />,
    size,
  );
}
