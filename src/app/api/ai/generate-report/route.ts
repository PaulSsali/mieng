import { NextRequest, NextResponse } from 'next/server';
import { generateEngineeringReport } from '@/lib/ai/ai-service';
import { withErrorHandling, createValidationError } from '@/lib/api-error-handler';
import { logError } from '@/lib/error-service';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const { projectContext, engineeringDetails, reportType, additionalInstructions, model = 'anthropic' } = body;
  
  // Validate required fields
  if (!projectContext || !engineeringDetails || !reportType) {
    throw createValidationError('Missing required fields', { 
      requiredFields: ['projectContext', 'engineeringDetails', 'reportType'],
      receivedFields: Object.keys(body)
    });
  }
  
  try {
    const generatedReport = await generateEngineeringReport({
      projectContext,
      engineeringDetails,
      reportType,
      additionalInstructions,
      model
    });
    
    return NextResponse.json({ success: true, content: generatedReport });
  } catch (error) {
    // Log AI-specific errors with detailed context
    const typedError = error instanceof Error ? error : new Error(String(error));
    logError(typedError, 'error', {
      component: 'AI Service',
      action: 'generateReport',
      reportType,
      model,
      projectContextLength: projectContext?.length,
      engineeringDetailsLength: engineeringDetails?.length
    });
    
    // Re-throw to be caught by the withErrorHandling wrapper
    throw error;
  }
}); 