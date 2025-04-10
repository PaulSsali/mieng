import { NextRequest, NextResponse } from 'next/server';
import { verifyDatabaseConnection, getDatabaseStats } from '@/lib/db/utils';

export async function GET(request: NextRequest) {
  try {
    // Verify database connection first
    const connectionInfo = await verifyDatabaseConnection();
    
    if (!connectionInfo.connected) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to database', 
          connectionInfo 
        },
        { status: 500 }
      );
    }
    
    // Get database statistics
    const stats = await getDatabaseStats();
    
    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${connectionInfo.databaseType} database`,
      connectionInfo,
      stats: stats.success ? stats.stats : null,
      statsError: !stats.success ? stats.error : null
    });
  } catch (error) {
    console.error('Error in database info API:', error);
    return NextResponse.json(
      { success: false, message: 'API error', error: String(error) },
      { status: 500 }
    );
  }
} 