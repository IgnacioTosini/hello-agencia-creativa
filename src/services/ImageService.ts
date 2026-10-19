import {
  type ImageUploadFolder,
  isImageUploadFolder,
} from "@/lib/image-upload-folders";
import { prepareImageUpload } from "@/lib/prepare-image-upload";

export type UploadedImage = { url: string; public_id: string };
export type CloudinaryUploadResponse =
  ({ success: true } & UploadedImage) | { success: false; error: string };
type DeleteResponse = { success: true } | { success: false; error: string };

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

async function readError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return data?.error ?? fallback;
}

export class ImageService {
  static async uploadImage(
    file: File,
    { folder }: { folder: ImageUploadFolder },
  ): Promise<CloudinaryUploadResponse> {
    try {
      if (!isImageUploadFolder(folder)) {
        throw new Error("La carpeta de imágenes no es válida.");
      }

      const form = new FormData();
      form.append("file", await prepareImageUpload(file));
      form.append("folder", folder);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "No se pudo subir la imagen."),
        );
      }

      const data = (await response.json()) as CloudinaryUploadResponse;
      if (!data.success) return data;
      if (
        !data.url.startsWith("https://res.cloudinary.com/") ||
        !data.public_id
      ) {
        throw new Error("El servidor devolvió una imagen inválida.");
      }
      return data;
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, "No se pudo subir la imagen."),
      };
    }
  }

  static async deleteImage(publicId: string): Promise<DeleteResponse> {
    try {
      if (!publicId.trim()) {
        throw new Error("Falta el identificador de la imagen.");
      }

      const query = new URLSearchParams({ publicId });
      const response = await fetch(`/api/delete-image?${query}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          await readError(response, "No se pudo eliminar la imagen."),
        );
      }
      return (await response.json()) as DeleteResponse;
    } catch (error) {
      return {
        success: false,
        error: errorMessage(error, "No se pudo eliminar la imagen."),
      };
    }
  }
}
