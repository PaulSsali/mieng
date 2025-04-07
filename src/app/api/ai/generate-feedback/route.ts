import { NextRequest, NextResponse } from 'next/server';
import { generateReportFeedback } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportContent, model = 'anthropic' } = body;
    
    // Validate required fields
    if (!reportContent) {
      return NextResponse.json(
        { error: 'Missing report content' }, 
        { status: 400 }
      );
    }
    
    const feedback = await generateReportFeedback(reportContent, model);
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' }, 
      { status: 500 }
    );
  }
} 