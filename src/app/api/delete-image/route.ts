import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { withApiErrors } from "@/lib/api-errors";
import {
  deleteCloudinaryImage,
  isCloudinaryConfigured,
  isSiteCloudinaryImage,
} from "@/lib/cloudinary-images";
import { prisma } from "@/lib/prisma";

async function deleteImage(request: NextRequest) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const publicId = request.nextUrl.searchParams.get("publicId");

  if (!isCloudinaryConfigured()) {
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
      { success: false, error: "Falta el identificador de la imagen." },
      { status: 400 },
    );
  }

  if (!isSiteCloudinaryImage(publicId)) {
    return Response.json(
      { success: false, error: "La imagen no pertenece a este sitio." },
      { status: 400 },
    );
  }

  const references = await prisma.projectImage.count({ where: { publicId } });

  if (references > 0) {
    return Response.json(
      {
        success: false,
        error: "La imagen todavía está asociada a un registro.",
      },
      { status: 409 },
    );
  }

  const result = await deleteCloudinaryImage(publicId);

  if (!result.success) {
    return Response.json(result, { status: 502 });
  }

  return Response.json(result);
}

export const DELETE = withApiErrors(deleteImage);
