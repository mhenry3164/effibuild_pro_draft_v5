import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  status?: number;
};

export class ApiHandler {
  static async handleRequest<T>(
    handler: () => Promise<T>,
    errorMessage: string = 'An error occurred'
  ) {
    try {
      const result = await handler();
      return NextResponse.json({ data: result });
    } catch (error) {
      console.error(errorMessage, error);
      return NextResponse.json(
        { error: error.message || errorMessage },
        { status: 500 }
      );
    }
  }

  static unauthorized() {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  static notFound(message: string = 'Resource not found') {
    return NextResponse.json(
      { error: message },
      { status: 404 }
    );
  }
}

