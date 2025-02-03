export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return Response.json(
      {
        success: false,
        code: error.code,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      {
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
    },
    { status: 500 }
  );
}
