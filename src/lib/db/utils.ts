import prisma from './client';

/**
 * Utility to verify database connection and get database type
 */
export async function verifyDatabaseConnection() {
  try {
    // Try to determine database type from connection URL
    const databaseUrl = process.env.DATABASE_URL || '';
    let detectedType = 'unknown';
    
    if (databaseUrl.startsWith('postgresql://')) {
      detectedType = 'postgresql';
    } else if (databaseUrl.includes('file:') || databaseUrl.includes('.db')) {
      detectedType = 'sqlite';
    }
    
    // Different query based on database type
    if (detectedType === 'postgresql') {
      const result = await prisma.$queryRaw<Array<{ current_database: string, version: string }>>`SELECT current_database(), version()`;
      return {
        connected: true,
        databaseName: result[0]?.current_database || null,
        databaseType: 'postgresql',
        version: result[0]?.version || null
      };
    } else {
      // For SQLite, use a simpler query
      const result = await prisma.$queryRaw<Array<{ sqlite_version: string }>>`SELECT sqlite_version()`;
      return {
        connected: true,
        databaseName: databaseUrl.split('/').pop() || 'sqlite',
        databaseType: 'sqlite',
        version: result[0]?.sqlite_version || null
      };
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      connected: false,
      error: String(error),
      databaseType: null,
      databaseName: null,
      version: null
    };
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const reportCount = await prisma.report.count();
    const organizationCount = await prisma.organization.count();
    
    return {
      success: true,
      stats: {
        userCount,
        projectCount,
        reportCount,
        organizationCount
      }
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return {
      success: false,
      error: String(error)
    };
  }
} 