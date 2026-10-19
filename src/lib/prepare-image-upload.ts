import { validateImageFile } from "./image-upload-validation";

// Leave room for multipart fields below Vercel's 4.5 MB request limit.
const MAX_UPLOAD_BYTES = 4_000_000;
const MAX_IMAGE_EDGE = 3840;

export async function prepareImageUpload(file: File): Promise<File> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  // Most images can be uploaded unchanged, avoiding a second lossy encoding.
  if (file.size <= MAX_UPLOAD_BYTES) return file;

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const ratio = Math.min(
      1,
      MAX_IMAGE_EDGE / image.naturalWidth,
      MAX_IMAGE_EDGE / image.naturalHeight,
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const context = canvas.getContext("2d");

    if (!context) throw new Error("No se pudo procesar la imagen.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.94, 0.9, 0.86]) {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) =>
            result
              ? resolve(result)
              : reject(
                  new Error("No se pudo preparar la imagen para subirla."),
                ),
          "image/webp",
          quality,
        );
      });

      if (blob.size <= MAX_UPLOAD_BYTES) {
        const extension = blob.type === "image/webp" ? "webp" : "png";
        return new File(
          [blob],
          `${file.name.replace(/\.[^.]+$/, "")}.${extension}`,
          { type: blob.type },
        );
      }
    }

    throw new Error(
      "La imagen sigue siendo demasiado pesada. Exportala en JPG o WebP de hasta 4 MB para conservar su calidad.",
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
