/*
  Warnings:

  - A unique constraint covering the columns `[paystackCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'PENDING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paystackCustomerId" TEXT,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "User_paystackCustomerId_key" ON "User"("paystackCustomerId");
