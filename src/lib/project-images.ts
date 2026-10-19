import type { StaticImageData } from "next/image";
import atlanticCover from "../../public/images/projects/atlantic-real-estate-cover.jpg";
import atlanticGallery from "../../public/images/projects/atlantic-real-estate-gallery.jpg";
import saintGottardCover from "../../public/images/projects/saint-gottard-cover.jpg";
import saintGottardGallery from "../../public/images/projects/saint-gottard-gallery.jpg";
import vitaminWayCover from "../../public/images/projects/vitamin-way-sport-cover.jpg";

// Keep database URLs compatible while serving content-hashed, full-size assets.
const projectAssets: Record<string, StaticImageData> = {
  "/images/projects/atlantic-real-estate-cover.jpg": atlanticCover,
  "/images/projects/atlantic-real-estate-gallery.jpg": atlanticGallery,
  "/images/projects/saint-gottard-cover.jpg": saintGottardCover,
  "/images/projects/saint-gottard-gallery.jpg": saintGottardGallery,
  "/images/projects/vitamin-way-sport-cover.jpg": vitaminWayCover,
};

export function getProjectImageAsset(src: string) {
  return projectAssets[src];
}
