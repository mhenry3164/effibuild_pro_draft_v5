import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiHandler } from '@/lib/api/handler';
import { auth } from '@/auth';

export async function GET(request: Request) {
  return ApiHandler.handleRequest(async () => {
    const session = await auth();
    if (!session?.user) return ApiHandler.unauthorized();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = status
      ? 'SELECT * FROM clients WHERE status = ?'
      : 'SELECT * FROM clients';
    const params = status ? [status] : [];

    const clients = await db.query(query, params);
    return clients;
  }, 'Failed to fetch clients');
}

export async function POST(request: Request) {
  return ApiHandler.handleRequest(async () => {
    const session = await auth();
    if (!session?.user) return ApiHandler.unauthorized();

    const data = await request.json();
    
    const result = await db.query(
      'INSERT INTO clients (name, company, email, phone, address, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
      [data.name, data.company, data.email, data.phone, data.address, data.status || 'active']
    );

    return {
      id: result.insertId || result[0]?.id,
      ...data
    };
  }, 'Failed to create client');
}

