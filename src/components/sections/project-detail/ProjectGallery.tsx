"use client";

import { useRef, useState } from "react";
import { ProjectImage } from "@/components/ui/project-image/ProjectImage";
import { getProjectImageAsset } from "@/lib/project-images";
import { useProjectGalleryGsap } from "./project-gallery.gsap";
import "./_project-gallery.scss";

type GalleryImage = { url: string; alt: string };

export const ProjectGallery = ({ images }: { images: GalleryImage[] }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  useProjectGalleryGsap(galleryRef, images);
  const singleImageAsset =
    images.length === 1 ? getProjectImageAsset(images[0].url) : undefined;

  if (images.length === 0) return null;

  return (
    <>
      <div
        ref={galleryRef}
        className="projectGallery"
        style={
          singleImageAsset ? { maxWidth: singleImageAsset.width } : undefined
        }
      >
        {images.map((image, index) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setSelectedImage(image)}
            aria-label={`Ampliar ${image.alt}`}
          >
            {index > 0 && (
              <span className="projectGalleryUnderlay" aria-hidden="true">
                <ProjectImage
                  src={images[index - 1].url}
                  alt=""
                  variant="card"
                  sizes="(max-width: 47.5rem) calc(100vw - 3rem), 38rem"
                />
              </span>
            )}
            <span className="projectGalleryReveal">
              <ProjectImage
                src={image.url}
                alt={image.alt}
                variant="card"
                sizes={
                  images.length === 1
                    ? "(max-width: 47.5rem) calc(100vw - 3rem), (max-width: 79.75rem) calc(100vw - 4rem), 75.75rem"
                    : "(max-width: 47.5rem) calc(100vw - 3rem), (max-width: 79.75rem) calc((100vw - 4.375rem) / 2), 37.6875rem"
                }
              />
            </span>
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
