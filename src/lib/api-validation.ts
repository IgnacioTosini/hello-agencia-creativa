import type { z } from "zod";

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | { response: Response }> {
  const json = await request.json().catch(() => null);
  const result = schema.safeParse(json);

  if (result.success) return { data: result.data };

  return {
    response: Response.json(
      {
        error: "Los datos enviados no son válidos.",
        fields: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    ),
  };
}
