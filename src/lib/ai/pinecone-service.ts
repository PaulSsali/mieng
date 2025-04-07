import Anthropic from '@anthropic-ai/sdk';
import prisma from '../db/client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Pinecone configuration
const PINECONE_API_KEY = process.env.PINECONE_API_KEY!;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT!;
const PINECONE_INDEX = process.env.PINECONE_INDEX!;

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    // Use Claude embeddings API (assuming the API supports this)
    // If Claude doesn't have direct embedding API, we'll need to use a different provider
    // This is a placeholder - in real implementation, you'd use the actual Claude embedding endpoint
    const response = await fetch('https://api.anthropic.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        input: text,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get embedding: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw new Error('Failed to create embedding');
  }
}

export async function storeReportEmbedding(reportId: string, content: string): Promise<void> {
  try {
    const embedding = await createEmbedding(content);
    
    // Store in Pinecone using direct API call
    const response = await fetch(`https://${PINECONE_INDEX}-${PINECONE_ENVIRONMENT}.svc.${PINECONE_ENVIRONMENT}.pinecone.io/vectors/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({
        vectors: [{
          id: reportId,
          values: embedding,
          metadata: {
            type: 'report',
            createdAt: new Date().toISOString(),
          },
        }],
        namespace: 'reports',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to store embedding in Pinecone: ${response.statusText}`);
    }
    
    // Store in PostgreSQL for backup
    await prisma.vectorEmbedding.create({
      data: {
        objectId: reportId,
        objectType: 'report',
        embedding: JSON.stringify(embedding),
      },
    });
    
  } catch (error) {
    console.error('Error storing report embedding:', error);
    throw new Error('Failed to store report embedding');
  }
}

export async function searchSimilarReports(query: string, limit: number = 5): Promise<string[]> {
  try {
    const queryEmbedding = await createEmbedding(query);
    
    // Query Pinecone using direct API call
    const response = await fetch(`https://${PINECONE_INDEX}-${PINECONE_ENVIRONMENT}.svc.${PINECONE_ENVIRONMENT}.pinecone.io/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
        filter: {
          type: { $eq: 'report' },
        },
        namespace: 'reports',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to query Pinecone: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the report IDs
    return data.matches.map((match: any) => match.id);
    
  } catch (error) {
    console.error('Error searching similar reports:', error);
    return [];
  }
}

export async function deleteReportEmbedding(reportId: string): Promise<void> {
  try {
    // Delete from Pinecone using direct API call
    const response = await fetch(`https://${PINECONE_INDEX}-${PINECONE_ENVIRONMENT}.svc.${PINECONE_ENVIRONMENT}.pinecone.io/vectors/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY,
      },
      body: JSON.stringify({
        ids: [reportId],
        namespace: 'reports',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete vector from Pinecone: ${response.statusText}`);
    }
    
    // Also delete from PostgreSQL
    await prisma.vectorEmbedding.deleteMany({
      where: {
        objectId: reportId,
        objectType: 'report',
      },
    });
    
  } catch (error) {
    console.error('Error deleting report embedding:', error);
    throw new Error('Failed to delete report embedding');
  }
}

export default {
  createEmbedding,
  storeReportEmbedding,
  searchSimilarReports,
  deleteReportEmbedding,
}; 