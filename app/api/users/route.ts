import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiHandler } from '@/lib/api/handler';
import { auth } from '@/auth';
import { hash } from 'bcrypt';

export async function GET(request: Request) {
  return ApiHandler.handleRequest(async () => {
    const session = await auth();
    if (!session?.user) return ApiHandler.unauthorized();

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const query = clientId
      ? 'SELECT id, email, name, role, created_at FROM users WHERE clientId = ?'
      : 'SELECT id, email, name, role, created_at FROM users';
    const params = clientId ? [clientId] : [];

    return await db.query(query, params);
  }, 'Failed to fetch users');
}

export async function POST(request: Request) {
  return ApiHandler.handleRequest(async () => {
    const session = await auth();
    if (!session?.user) return ApiHandler.unauthorized();

    const data = await request.json();
    const hashedPassword = await hash(data.password, 10);

    // This query structure works in both MySQL and PostgreSQL
    const result = await db.query(
      'INSERT INTO users (email, name, password, role, client_id) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [data.email, data.name, hashedPassword, data.role, data.clientId]
    );

    return {
      id: result.insertId || result[0]?.id,
      email: data.email,
      name: data.name,
      role: data.role,
      clientId: data.clientId
    };
  }, 'Failed to create user');
}

