import type { Metadata } from "next";
import { ProjectPageContent } from "./ProjectPageContent";
import { prisma } from "@/lib/prisma";
import "@/components/sections/project-detail/_project-detail.scss";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      shortDescription: true,
      metaTitle: true,
      metaDescription: true,
      images: {
        where: { type: "COVER" },
        take: 1,
        select: { url: true, alt: true },
      },
    },
  });

  if (!project)
    return { title: "Proyecto no encontrado", robots: { index: false } };

  const title = project.metaTitle ?? project.title;
  const description = project.metaDescription ?? project.shortDescription;
  const image = project.images[0];

  return {
    title,
    description,
    alternates: { canonical: `/proyectos/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image.url, alt: image.alt ?? title }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  return <ProjectPageContent slug={slug} />;
}
