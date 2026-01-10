import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { language, code } = await request.json();

    if (!language || !code) {
      return NextResponse.json(
        { error: 'Language and code are required' },
        { status: 400 }
      );
    }

    // Execute code using Piston API
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: language,
        version: '*',
        files: [{ content: code }],
      }),
    });

    const result = await response.json();

    if (result.run) {
      return NextResponse.json({
        output: result.run.output || result.run.stderr || 'No output',
        success: true,
      });
    }

    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
