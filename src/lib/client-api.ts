export async function readApiError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as {
    error?: string;
    fields?: Array<{
      path?: string;
      message?: string;
    }>;
  } | null;

  const error = data?.error ?? fallback;
  const invalidFields = data?.fields
    ?.map((field) => getReadableFieldName(field.path))
    .filter((field): field is string => Boolean(field));
  const uniqueFields = [...new Set(invalidFields)];

  return uniqueFields.length > 0
    ? `${error} Revisá: ${uniqueFields.join(", ")}.`
    : error;
}

export type AdminDeleteResult = {
  deletedId: string;
  warning?: string;
};

export async function requestAdminDeletion(
  endpoint: string,
  id: string,
  password: string,
  fallback: string,
): Promise<AdminDeleteResult> {
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, fallback));
  }

  return (await response.json()) as AdminDeleteResult;
}

const FIELD_NAMES: Record<string, string> = {
  title: "título",
  slug: "slug",
  clientName: "cliente",
  year: "año",
  category: "categoría",
  status: "estado",
  displayOrder: "orden",
  shortDescription: "descripción corta",
  description: "descripción",
  challenge: "desafío",
  approach: "enfoque",
  solution: "solución",
  results: "resultados",
  images: "imágenes",
  gallery: "galería",
  services: "servicios asociados",
  instagramUrl: "Instagram",
  websiteUrl: "sitio web",
  videoUrl: "video",
  externalLink: "Instagram, sitio web o video",
};

function getReadableFieldName(path?: string) {
  if (!path) {
    return null;
  }

  const segments = path.split(".");
  const field = [...segments].reverse().find((segment) => FIELD_NAMES[segment]);
  const projectIndex =
    segments[0] === "projects" && /^\d+$/.test(segments[1] ?? "")
      ? Number(segments[1]) + 1
      : null;

  if (!field) {
    return projectIndex ? `proyecto ${projectIndex}` : path;
  }

  const fieldName = FIELD_NAMES[field];

  return projectIndex ? `proyecto ${projectIndex} · ${fieldName}` : fieldName;
}
