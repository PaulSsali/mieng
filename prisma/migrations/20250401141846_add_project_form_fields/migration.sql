-- AlterTable
ALTER TABLE "Project" ADD COLUMN "company" TEXT;
ALTER TABLE "Project" ADD COLUMN "referee" TEXT;
ALTER TABLE "Project" ADD COLUMN "responsibilities" TEXT;

-- CreateTable
CREATE TABLE "ProjectOutcome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "outcomeId" INTEGER NOT NULL,
    "response" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectOutcome_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
