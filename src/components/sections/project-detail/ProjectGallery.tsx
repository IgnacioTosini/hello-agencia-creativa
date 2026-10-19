"use client";

import { useState } from "react";
import { ProjectImage } from "@/components/ui/project-image/ProjectImage";
import { getProjectImageAsset } from "@/lib/project-images";

type GalleryImage = { url: string; alt: string };

export const ProjectGallery = ({ images }: { images: GalleryImage[] }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const singleImageAsset =
    images.length === 1 ? getProjectImageAsset(images[0].url) : undefined;

  if (images.length === 0) return null;

  return (
    <>
      <div
        className="projectGallery"
        style={
          singleImageAsset ? { maxWidth: singleImageAsset.width } : undefined
        }
      >
        {images.map((image) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setSelectedImage(image)}
            aria-label={`Ampliar ${image.alt}`}
          >
            <ProjectImage
              src={image.url}
              alt={image.alt}
              sizes={
                images.length === 1
                  ? "(max-width: 47.5rem) calc(100vw - 3rem), (max-width: 79.75rem) calc(100vw - 4rem), 75.75rem"
                  : "(max-width: 47.5rem) calc(100vw - 3rem), (max-width: 79.75rem) calc((100vw - 4.375rem) / 2), 37.6875rem"
              }
            />
          </button>
        ))}
      </div>
      {selectedImage && (
        <div
          className="projectLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            aria-label="Cerrar galería"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div
            className="projectLightboxImage"
            onClick={(event) => event.stopPropagation()}
          >
            <ProjectImage
              src={selectedImage.url}
              alt={selectedImage.alt}
              sizes="(max-width: 47.5rem) calc(100vw - 2rem), (max-width: 81.75rem) calc(100vw - 6rem), 75.75rem"
            />
          </div>
        </div>
      )}
    </>
  );
};
