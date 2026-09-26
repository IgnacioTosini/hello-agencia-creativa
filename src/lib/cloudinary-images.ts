import "server-only";

import { createHash } from "node:crypto";

type CloudinaryDeleteResult =
  { success: true; result: string } | { success: false; error: string };

const buildSignature = (
  params: Record<string, string | number>,
  apiSecret: string,
) => {
  const payload = Object.entries(params)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
};

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );
}

export function isSiteCloudinaryImage(publicId: string) {
  const prefix = `${(process.env.CLOUDINARY_UPLOAD_FOLDER ?? "demo-store").replace(/\/+$/, "")}/`;

  return (
    publicId.startsWith(prefix) &&
    !publicId.split("/").some((part) => part === ".." || part === ".")
  );
}

export async function deleteCloudinaryImage(
  publicId: string,
): Promise<CloudinaryDeleteResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      success: false,
      error: "El servicio de imágenes no está configurado.",
    };
  }

  if (!isSiteCloudinaryImage(publicId)) {
    return {
      success: false,
      error: "La imagen no pertenece a este sitio.",
    };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature(
    {
      invalidate: "true",
      public_id: publicId,
      timestamp,
    },
    apiSecret,
  );
  const body = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    invalidate: "true",
    timestamp: String(timestamp),
    signature,
  });

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      },
    );
    const data = (await response.json().catch(() => null)) as {
      result?: string;
      error?: { message?: string };
    } | null;

    if (!response.ok) {
      return {
        success: false,
        error: data?.error?.message ?? "No se pudo eliminar la imagen.",
      };
    }

    const result = data?.result ?? "unknown";
    const success = result === "ok" || result === "not found";

    return success
      ? { success: true, result }
      : { success: false, error: "Cloudinary no pudo eliminar la imagen." };
  } catch {
    return {
      success: false,
      error: "Cloudinary no está disponible en este momento.",
    };
  }
}
