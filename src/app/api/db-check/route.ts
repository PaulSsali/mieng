import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';

export async function GET() {
  try {
    // Get database URL from environment variable
    const databaseUrl = process.env.DATABASE_URL || '';
    
    // Determine database type
    let databaseType = 'unknown';
    if (databaseUrl.startsWith('postgresql://')) {
      databaseType = 'postgresql';
    } else if (databaseUrl.includes('file:') || databaseUrl.includes('.db')) {
      databaseType = 'sqlite';
    }
    
    // Simple check - count users
    const userCount = await prisma.user.count();
    
    // Simple check - count projects
    const projectCount = await prisma.project.count();
    
    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${databaseType} database`,
      databaseUrl: databaseUrl.replace(/:[^:\/\/]+@/, ':****@'), // Hide password if any
      stats: {
        userCount,
        projectCount
      }
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to database', 
        error: String(error) 
      },
      { status: 500 }
    );
  }
} 