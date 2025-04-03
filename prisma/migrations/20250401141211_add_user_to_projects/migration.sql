/*
  Warnings:

  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- First, create a default user if none exists
INSERT INTO "User" ("id", "email", "role", "createdAt", "updatedAt")
SELECT 
  'default-user-id' as "id", 
  'admin@mieng.com' as "email", 
  'ADMIN' as "role", 
  CURRENT_TIMESTAMP as "createdAt", 
  CURRENT_TIMESTAMP as "updatedAt"
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE "email" = 'admin@mieng.com');

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "discipline" TEXT,
    "role" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert existing projects with default user ID
INSERT INTO "new_Project" ("createdAt", "description", "discipline", "endDate", "id", "image", "name", "organizationId", "role", "startDate", "status", "updatedAt", "userId") 
SELECT 
  "createdAt", 
  "description", 
  "discipline", 
  "endDate", 
  "id", 
  "image", 
  "name", 
  "organizationId", 
  "role", 
  "startDate", 
  "status", 
  "updatedAt",
  'default-user-id'
FROM "Project";

DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
