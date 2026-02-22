import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      'https://iot-apis-c9emhccvakhhbna0.centralindia-01.azurewebsites.net/RoboTBackend',
      {
        method: 'POST',
        headers: {
          'x-api-key': 'SwcjxxGNjSdbeeq',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch (error: any) {
    console.error('Robot command proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to send robot command', details: error.message },
      { status: 500 }
    );
  }
}
