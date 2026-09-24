import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
const rootFolder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "hello-agencia-creativa";

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Faltan las credenciales de Cloudinary.");
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = path.join("backups", "cloudinary", timestamp);
await mkdir(destination, { recursive: true });

let nextCursor;
const manifest = [];

do {
  const query = new URLSearchParams({
    type: "upload",
    prefix: `${rootFolder}/`,
    max_results: "500",
  });
  if (nextCursor) query.set("next_cursor", nextCursor);

  const authorization = Buffer.from(
    `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`,
  ).toString("base64");
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?${query}`,
    { headers: { Authorization: `Basic ${authorization}` } },
  );
  if (!response.ok) throw new Error(`Cloudinary respondió ${response.status}.`);

  const data = await response.json();
  for (const resource of data.resources ?? []) {
    const extension = resource.format || "bin";
    const filename = `${createHash("sha1").update(resource.public_id).digest("hex")}.${extension}`;
    const imageResponse = await fetch(resource.secure_url);
    if (!imageResponse.ok) {
      throw new Error(`No se pudo descargar ${resource.public_id}.`);
    }
    await writeFile(
      path.join(destination, filename),
      Buffer.from(await imageResponse.arrayBuffer()),
    );
    manifest.push({ ...resource, backupFile: filename });
  }
  nextCursor = data.next_cursor;
} while (nextCursor);

await writeFile(
  path.join(destination, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`Backup de Cloudinary creado en ${destination}.`);
