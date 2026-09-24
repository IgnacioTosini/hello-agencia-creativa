"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { url: string; alt: string };

export const ProjectGallery = ({ images }: { images: GalleryImage[] }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="projectGallery">
        {images.map((image) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setSelectedImage(image)}
            aria-label={`Ampliar ${image.alt}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 47.5rem) 92vw, 37.5rem"
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
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt}
            width={1600}
            height={1200}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
