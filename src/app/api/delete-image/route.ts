import { createHash } from "node:crypto";

import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const buildSignature = (
  params: Record<string, string | number>,
  apiSecret: string,
) => {
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
};

async function deleteImage(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const publicId = req.nextUrl.searchParams.get("publicId");

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return Response.json(
      {
        success: false,
        error:
          "El servicio de imágenes no está configurado. Contactá al administrador.",
      },
      { status: 500 },
    );
  }

  if (!publicId) {
    return Response.json(
      { error: "Falta el identificador de la imagen." },
      { status: 400 },
    );
  }

  const prefix = `${(process.env.CLOUDINARY_UPLOAD_FOLDER ?? "demo-store").replace(/\/+$/, "")}/`;
  if (
    !publicId.startsWith(prefix) ||
    publicId.split("/").some((part) => part === ".." || part === ".")
  )
    return Response.json(
      { success: false, error: "La imagen no pertenece a este sitio." },
      { status: 400 },
    );

  const references = await prisma.projectImage.count({
    where: { publicId },
  });

  if (references > 0)
    return Response.json(
      {
        success: false,
        error: "La imagen todavía está asociada a un registro.",
      },
      { status: 409 },
    );

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature(
    {
      invalidate: "true",
      public_id: publicId,
      timestamp,
    },
    CLOUDINARY_API_SECRET,
  );

  const body = new URLSearchParams({
    public_id: publicId,
    api_key: CLOUDINARY_API_KEY,
    invalidate: "true",
    timestamp: String(timestamp),
    signature,
  });

  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
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

  const data = await cloudinaryResponse.json();

  if (!cloudinaryResponse.ok) {
    return Response.json(
      {
        success: false,
        error: data?.error?.message ?? "No se pudo eliminar la imagen.",
      },
      { status: cloudinaryResponse.status },
    );
  }

  const success = data?.result === "ok" || data?.result === "not found";

  return Response.json({
    success,
    result: data?.result,
    error: success ? undefined : "Cloudinary no pudo eliminar la imagen",
  });
}

export async function DELETE(req: NextRequest) {
  try {
    return await deleteImage(req);
  } catch {
    return Response.json(
      {
        success: false,
        error:
          "Cloudinary no está disponible en este momento. Intentá nuevamente.",
      },
      { status: 500 },
    );
  }
}
