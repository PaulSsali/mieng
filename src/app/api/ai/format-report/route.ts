import { NextRequest, NextResponse } from 'next/server';
import { improveReportFormatting } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, model = 'anthropic' } = body;
    
    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Missing report content' }, 
        { status: 400 }
      );
    }
    
    const formattedContent = await improveReportFormatting(content, model);
    
    return NextResponse.json({ content: formattedContent });
  } catch (error) {
    console.error('Error formatting report:', error);
    return NextResponse.json(
      { error: 'Failed to format report' }, 
      { status: 500 }
    );
  }
}
 