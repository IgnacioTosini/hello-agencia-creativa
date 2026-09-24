export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ProjectCategory =
  | "BRANDING"
  | "SOCIAL_MEDIA"
  | "CONTENT"
  | "CAMPAIGNS"
  | "GRAPHIC_DESIGN"
  | "PHOTO_VIDEO";
export type ProjectImageType = "COVER" | "GALLERY" | "MOCKUP" | "BEFORE_AFTER";

export type ProjectImage = {
  id: string;
  projectId: string;
  url: string;
  publicId?: string | null;
  alt?: string | null;
  type: ProjectImageType;
  order: number;
};

export type ProjectCardData = {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  year: number;
  category: ProjectCategory;
  shortDescription: string;
  featured: boolean;
  displayOrder: number;
  status: ProjectStatus;
  images: ProjectImage[];
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  videoUrl?: string | null;
};

export type Project = ProjectCardData & {
  description?: string | null;
  challenge?: string | null;
  approach?: string | null;
  solution?: string | null;
  results?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  videoUrl?: string | null;
  services: { projectId: string; serviceId: string }[];
  tags: { projectId: string; tagId: string }[];
  testimonial?: {
    quote: string;
    authorName: string;
    authorRole?: string | null;
    authorCompany?: string | null;
  } | null;
};

export type ProjectViewModel = ProjectCardData & {
  description?: string | null;
  challenge: string;
  approach: string;
  solution: string;
  results: string;
  services: string[];
  gallery: { url: string; alt: string; publicId?: string | null }[];
};

export const projectCategoryLabel: Record<ProjectCategory, string> = {
  BRANDING: "Branding",
  SOCIAL_MEDIA: "Social media",
  CONTENT: "Contenido",
  CAMPAIGNS: "Campañas",
  GRAPHIC_DESIGN: "Diseño gráfico",
  PHOTO_VIDEO: "Foto y video",
};
