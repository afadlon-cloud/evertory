// Temporary placeholder - NextAuth disabled for initial deployment
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Auth temporarily disabled for deployment' });
}

export async function POST() {
  return NextResponse.json({ message: 'Auth temporarily disabled for deployment' });
}