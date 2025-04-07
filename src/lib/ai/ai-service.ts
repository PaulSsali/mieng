import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Model configuration
export type AIModel = 'anthropic' | 'deepseek';

export interface GenerateReportParams {
  projectContext: string;
  engineeringDetails: string;
  reportType: string;
  additionalInstructions?: string;
  model?: AIModel;
}

// Helper function to call DeepSeek API via fetch
async function callDeepSeekAPI(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert professional engineer specializing in creating detailed technical reports.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || 'Failed to generate content.';
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw new Error('Failed to generate content using DeepSeek.');
  }
}

export async function generateEngineeringReport(params: GenerateReportParams): Promise<string> {
  const { projectContext, engineeringDetails, reportType, additionalInstructions, model = 'anthropic' } = params;
  
  const prompt = `
    Generate a professional engineering report based on the following information:
    
    PROJECT CONTEXT:
    ${projectContext}
    
    ENGINEERING DETAILS:
    ${engineeringDetails}
    
    REPORT TYPE:
    ${reportType}
    
    ADDITIONAL INSTRUCTIONS:
    ${additionalInstructions || 'Follow engineering best practices.'}
    
    Format the report professionally with appropriate sections, including an executive summary, 
    technical details, findings, and recommendations.
  `;
  
  try {
    switch (model) {
      case 'anthropic':
        const anthropicResponse = await anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          system: 'You are an expert professional engineer specializing in creating detailed technical reports.',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
        });
        
        return anthropicResponse.content[0].type === 'text' 
          ? anthropicResponse.content[0].text 
          : 'Failed to generate report content.';
        
      case 'deepseek':
        return await callDeepSeekAPI(prompt);
        
      default:
        throw new Error(`Unsupported AI model: ${model}`);
    }
  } catch (error) {
    console.error(`Error generating report with ${model}:`, error);
    throw new Error(`Failed to generate report using ${model}.`);
  }
}

export async function improveReportFormatting(content: string, model: AIModel = 'anthropic'): Promise<string> {
  const prompt = `Improve the formatting and structure of this engineering report, ensuring it follows professional standards:\n\n${content}`;
  
  try {
    switch (model) {
      case 'anthropic':
        const anthropicResponse = await anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          system: 'You are an expert at formatting engineering reports with proper structure, headings, and professional language.',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
        });
        
        return anthropicResponse.content[0].type === 'text' 
          ? anthropicResponse.content[0].text 
          : content;
        
      case 'deepseek':
        return await callDeepSeekAPI(prompt);
        
      default:
        return content;
    }
  } catch (error) {
    console.error(`Error improving report formatting with ${model}:`, error);
    return content; // Return original content if formatting fails
  }
}

export async function generateReportFeedback(reportContent: string, model: AIModel = 'anthropic'): Promise<string> {
  const prompt = `Review this engineering report and provide detailed, constructive feedback. Focus on technical accuracy, completeness, clarity, and recommendations for improvement:\n\n${reportContent}`;
  
  try {
    switch (model) {
      case 'anthropic':
        const anthropicResponse = await anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          system: 'You are an expert engineering reviewer who provides constructive feedback on technical reports.',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
        });
        
        return anthropicResponse.content[0].type === 'text' 
          ? anthropicResponse.content[0].text 
          : 'No feedback generated.';
        
      case 'deepseek':
        return await callDeepSeekAPI(prompt);
        
      default:
        throw new Error(`Unsupported AI model: ${model}`);
    }
  } catch (error) {
    console.error(`Error generating report feedback with ${model}:`, error);
    throw new Error(`Failed to generate feedback using ${model}.`);
  }
}

export default {
  generateEngineeringReport,
  improveReportFormatting,
  generateReportFeedback
}; 