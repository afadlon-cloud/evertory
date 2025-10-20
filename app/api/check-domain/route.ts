import { NextRequest, NextResponse } from 'next/server';
import { isDomainAvailable } from '@/lib/domain-utils';

export async function POST(request: NextRequest) {
  try {
    const { domainName } = await request.json();

    if (!domainName) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      );
    }

    const isAvailable = await isDomainAvailable(domainName);

    return NextResponse.json({ 
      available: isAvailable,
      domain: `${domainName}.evertory.com`
    });
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
