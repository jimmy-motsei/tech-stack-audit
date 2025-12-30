import { NextResponse } from 'next/server';
import { getAvailableTools } from '@/lib/audit/engine';

export async function GET() {
  try {
    const tools = await getAvailableTools();
    
    return NextResponse.json({
      success: true,
      tools,
    });
  } catch (error) {
    console.error('Tools API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
