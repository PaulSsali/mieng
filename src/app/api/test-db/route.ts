import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';
import { verifyDatabaseConnection } from '@/lib/db/utils';

export async function GET(request: NextRequest) {
  try {
    // First verify database connection to know what type of database we're using
    const dbInfo = await verifyDatabaseConnection();
    
    if (!dbInfo.connected) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: dbInfo.error
      }, { status: 500 });
    }
    
    // Read users from the database
    const users = await prisma.user.findMany({
      take: 5, // Limit to 5 users
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully retrieved users from ${dbInfo.databaseType}`,
      databaseInfo: dbInfo,
      data: users
    });
  } catch (error) {
    console.error('Database read error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read from database', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const testTimestamp = new Date().toISOString();
    
    // First verify database connection
    const dbInfo = await verifyDatabaseConnection();
    
    // Create a test tag to verify write capability
    const tag = await prisma.tag.create({
      data: {
        name: `TestTag-${testTimestamp}`
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully wrote to ${dbInfo.databaseType}`,
      databaseInfo: dbInfo,
      data: tag
    });
  } catch (error) {
    console.error('Database write error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to write to database', error: String(error) },
      { status: 500 }
    );
  }
} 