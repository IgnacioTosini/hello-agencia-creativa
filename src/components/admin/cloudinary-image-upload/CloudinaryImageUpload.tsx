"use client";

import "./_cloudinary-image-upload.scss";

const previewUrls = new WeakMap<File, string>();

export const getImagePreviewUrl = (file: File) => {
  const currentUrl = previewUrls.get(file);

  if (currentUrl) {
    return currentUrl;
  }

  const previewUrl = URL.createObjectURL(file);
  previewUrls.set(file, previewUrl);

  return previewUrl;
};

export const releaseImagePreview = (file: File) => {
  const previewUrl = previewUrls.get(file);

  if (!previewUrl) {
    return;
  }

  URL.revokeObjectURL(previewUrl);
  previewUrls.delete(file);
};

type ExistingImage = {
  url: string;
  alt: string;
};

type CloudinaryImageUploadProps = {
  label: string;
  multiple?: boolean;
  files: File[];
  existingImages?: ExistingImage[];
  onFilesChange: (files: File[]) => void;
  onRemoveExisting?: (index: number) => void;
};

const PendingImagePreview = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const previewUrl = getImagePreviewUrl(file);

  return (
    <article>
      <div
        className="cloudinaryImageThumbnail"
        role="img"
        aria-label={file.name}
        style={{ backgroundImage: `url("${previewUrl}")` }}
      />
      <p>
        <span>Nueva</span>
        {file.name}
      </p>
      <button
        type="button"
        onClick={() => {
          if (!window.confirm(`¿Eliminar la imagen nueva “${file.name}”?`))
            return;
          releaseImagePreview(file);
          onRemove();
        }}
      >
        Eliminar
      </button>
    </article>
  );
};

export const CloudinaryImageUpload = ({
  label,
  multiple = false,
  files,
  existingImages = [],
  onFilesChange,
  onRemoveExisting,
}: CloudinaryImageUploadProps) => (
  <div className="cloudinaryImageUpload">
    <div className="cloudinaryImageUploadHeader">
      <div>
        <strong>{label}</strong>
        <small>Se subirá a Cloudinary cuando guardes los cambios.</small>
      </div>
      <label>
        <span>{multiple ? "Seleccionar imágenes" : "Seleccionar imagen"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files ?? []);
            const nextFiles = multiple
              ? [...files, ...selectedFiles]
              : selectedFiles.slice(0, 1);

            files
              .filter((file) => !nextFiles.includes(file))
              .forEach(releaseImagePreview);
            onFilesChange(nextFiles);
            event.target.value = "";
          }}
        />
      </label>
    </div>

    {(existingImages.length > 0 || files.length > 0) && (
      <div className="cloudinaryImagePreview">
        {existingImages.map((image, index) => (
          <article key={`${image.url}-${index}`}>
            <div
              className="cloudinaryImageThumbnail"
              role="img"
              aria-label={image.alt}
              style={{ backgroundImage: `url("${image.url}")` }}
            />
            <p>
              <span>Actual</span>
              {image.alt}
            </p>
            <button
              type="button"
              onClick={() => {
                if (
                  !window.confirm(
                    "¿Eliminar esta imagen al guardar los cambios?",
                  )
                )
                  return;
                onRemoveExisting?.(index);
              }}
            >
              Eliminar
            </button>
          </article>
        ))}

        {files.map((file, index) => (
          <PendingImagePreview
            file={file}
            key={`${file.name}-${file.lastModified}-${index}`}
            onRemove={() =>
              onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))
            }
          />
        ))}
      </div>
    )}
  </div>
);
