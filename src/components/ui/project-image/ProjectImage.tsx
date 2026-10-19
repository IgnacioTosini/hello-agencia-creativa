"use client";

import Image from "next/image";
import { useState } from "react";
import { getProjectImageAsset } from "@/lib/project-images";

type ProjectImageProps = {
  src: string;
  alt: string;
  sizes: string;
  variant?: "card" | "detail";
  preload?: boolean;
};

export function ProjectImage({
  src,
  alt,
  sizes,
  variant = "detail",
  preload = false,
}: ProjectImageProps) {
  const asset = getProjectImageAsset(src);
  const [loadedImage, setLoadedImage] = useState({
    src: "",
    isPortrait: false,
  });
  const isPortrait = asset
    ? asset.height > asset.width
    : loadedImage.src === src && loadedImage.isPortrait;

  return (
    <Image
      src={asset ?? src}
      alt={alt}
      fill
      preload={preload}
      quality={variant === "card" ? 85 : 90}
      sizes={sizes}
      className={isPortrait ? "projectImage isPortrait" : "projectImage"}
      style={{
        objectFit: variant === "card" ? "cover" : "contain",
        // A small source must not be stretched across a desktop-size viewer.
        maxWidth: variant === "detail" ? asset?.width : undefined,
        maxHeight: variant === "detail" ? asset?.height : undefined,
        margin: "auto",
      }}
      onLoad={(event) => {
        if (!asset) {
          const image = event.currentTarget;
          setLoadedImage({
            src,
            isPortrait: image.naturalHeight > image.naturalWidth,
          });
        }
      }}
    />
  );
}
