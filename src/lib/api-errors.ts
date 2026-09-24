type ApiHandler<TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<Response>;

export function withApiErrors<TArgs extends unknown[]>(
  handler: ApiHandler<TArgs>,
): ApiHandler<TArgs> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API operation failed:", error);

      return Response.json(
        {
          error:
            "El servicio de datos no está disponible en este momento. Intentá nuevamente en unos minutos.",
        },
        { status: 503 },
      );
    }
  };
}
