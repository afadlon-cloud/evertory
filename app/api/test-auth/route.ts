import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const dbUrl = process.env.DATABASE_URL;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Environment test',
      hasDbUrl: !!dbUrl,
      hasNextAuthUrl: !!nextAuthUrl,
      hasNextAuthSecret: !!nextAuthSecret,
      dbUrlStart: dbUrl?.substring(0, 30) + '...',
      dbUrlProtocol: dbUrl?.split('://')[0]
    });
  } catch (error) {
    console.error('Environment test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
