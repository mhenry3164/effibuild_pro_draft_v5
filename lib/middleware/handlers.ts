'import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import Logger from "../utils/logger";

export async function validateRequest<T extends z.Schema>(
  request: Request,
  schema: T
): Promise<{ 
  success: boolean; 
  data?: z.infer<T>;
  error?: NextResponse;
}> {
  try {
    const body = await request.json();
    const validated = await schema.parseAsync(body);
    return { success: true, data: validated };
  } catch (error) {
    Logger.error("Validation failed", error, { schema: schema.description });
    return {
      success: false,
      error: NextResponse.json(
        { 
          error: "Validation failed",
          details: error.errors 
        },
        { status: 400 }
      )
    };
  }
}

export function withValidation<T extends z.Schema>(
  schema: T,
  handler: (data: z.infer<T>) => Promise<NextResponse>
) {
  return async (request: Request) => {
    const validation = await validateRequest(request, schema);
    if (!validation.success) return validation.error;
    return handler(validation.data!);
  };
}

export function withErrorHandling(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      Logger.error("Request failed", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

export function withAuth(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return handler(request);
  };
}' > lib/middleware/handlers.ts