import type { Prisma, Project, ProjectImage, Service } from "@prisma/client";
import { NextRequest } from "next/server";
import { authorizeAdminDeletion } from "@/lib/admin-delete";
import { requireAdmin } from "@/lib/admin-api";
import { projectsBodySchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import { withApiErrors } from "@/lib/api-errors";
import { deleteCloudinaryImage } from "@/lib/cloudinary-images";
import { prisma } from "@/lib/prisma";
import type { ProjectViewModel } from "@/types/project";

type ProjectWithRelations = Project & {
  images: ProjectImage[];
  services: Array<{ service: Service }>;
};

const toProjectViewModel = (
  project: ProjectWithRelations,
): ProjectViewModel => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  clientName: project.clientName,
  year: project.year,
  category: project.category,
  shortDescription: project.shortDescription,
  description: project.description,
  challenge: project.challenge ?? "",
  approach: project.approach ?? "",
  solution: project.solution ?? "",
  results: project.results ?? "",
  featured: project.featured,
  displayOrder: project.displayOrder,
  status: project.status,
  instagramUrl: project.instagramUrl,
  websiteUrl: project.websiteUrl,
  videoUrl: project.videoUrl,
  images: project.images.map((image) => ({
    id: image.id,
    projectId: image.projectId,
    url: image.url,
    publicId: image.publicId,
    alt: image.alt,
    type: image.type,
    order: image.order,
  })),
  gallery: project.images
    .filter((image) => image.type === "GALLERY")
    .map((image) => ({
      url: image.url,
      alt: image.alt ?? project.title,
      publicId: image.publicId,
    })),
  services: project.services.map(({ service }) => service.name),
});

const projectInclude = {
  images: {
    orderBy: { order: "asc" },
  },
  services: {
    include: { service: true },
  },
} satisfies Prisma.ProjectInclude;

export async function GET() {
  const projects = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { displayOrder: "asc" },
  });

  return Response.json(projects.map(toProjectViewModel));
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, projectsBodySchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;

  await prisma.$transaction(async (transaction) => {
    const availableServices = await transaction.service.findMany();

    for (const project of body.projects ?? []) {
      await transaction.project.upsert({
        where: { id: project.id },
        create: {
          id: project.id,
          title: project.title,
          slug: project.slug,
          clientName: project.clientName,
          year: project.year,
          category: project.category,
          shortDescription: project.shortDescription,
          description: project.description,
          challenge: project.challenge,
          approach: project.approach,
          solution: project.solution,
          results: project.results,
          featured: project.featured,
          displayOrder: project.displayOrder,
          status: project.status,
          instagramUrl: project.instagramUrl,
          websiteUrl: project.websiteUrl,
          videoUrl: project.videoUrl,
        },
        update: {
          title: project.title,
          slug: project.slug,
          clientName: project.clientName,
          year: project.year,
          category: project.category,
          shortDescription: project.shortDescription,
          description: project.description,
          challenge: project.challenge,
          approach: project.approach,
          solution: project.solution,
          results: project.results,
          featured: project.featured,
          displayOrder: project.displayOrder,
          status: project.status,
          instagramUrl: project.instagramUrl,
          websiteUrl: project.websiteUrl,
          videoUrl: project.videoUrl,
        },
      });

      await transaction.projectImage.deleteMany({
        where: { projectId: project.id },
      });

      const cover = project.images.find((image) => image.type === "COVER");
      const images = [
        ...(cover
          ? [
              {
                id: cover.id,
                projectId: project.id,
                url: cover.url,
                publicId: cover.publicId,
                alt: cover.alt,
                type: "COVER" as const,
                order: 0,
              },
            ]
          : []),
        ...project.gallery.map((image, index) => ({
          id:
            project.images.find(
              (item) => item.type === "GALLERY" && item.url === image.url,
            )?.id ?? `${project.id}-gallery-${index + 1}`,
          projectId: project.id,
          url: image.url,
          publicId: image.publicId,
          alt: image.alt,
          type: "GALLERY" as const,
          order: index + 1,
        })),
      ];

      if (images.length > 0) {
        await transaction.projectImage.createMany({ data: images });
      }

      await transaction.projectService.deleteMany({
        where: { projectId: project.id },
      });

      const selectedServices = availableServices.filter((service) =>
        project.services.some(
          (serviceName) =>
            serviceName.toLocaleLowerCase() ===
            service.name.toLocaleLowerCase(),
        ),
      );

      if (selectedServices.length > 0) {
        await transaction.projectService.createMany({
          data: selectedServices.map((service) => ({
            projectId: project.id,
            serviceId: service.id,
          })),
        });
      }
    }
  });

  const projects = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { displayOrder: "asc" },
  });

  return Response.json(projects.map(toProjectViewModel));
}

async function deleteProject(request: NextRequest) {
  const authorization = await authorizeAdminDeletion(request);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const project = await prisma.project.findUnique({
    where: { id: authorization.data.id },
    select: {
      id: true,
      images: { select: { publicId: true } },
    },
  });

  if (!project) {
    return Response.json(
      { error: "El proyecto ya no existe." },
      { status: 404 },
    );
  }

  await prisma.project.delete({ where: { id: project.id } });

  const publicIds = [
    ...new Set(
      project.images
        .map((image) => image.publicId)
        .filter((publicId): publicId is string => Boolean(publicId)),
    ),
  ];
  const imageResults = await Promise.all(
    publicIds.map((publicId) => deleteCloudinaryImage(publicId)),
  );
  const failedImages = imageResults.filter((result) => !result.success).length;

  return Response.json({
    deletedId: project.id,
    warning:
      failedImages > 0
        ? `El proyecto se eliminó, pero ${failedImages} ${failedImages === 1 ? "imagen no pudo" : "imágenes no pudieron"} borrarse de Cloudinary.`
        : undefined,
  });
}

export const DELETE = withApiErrors(deleteProject);
