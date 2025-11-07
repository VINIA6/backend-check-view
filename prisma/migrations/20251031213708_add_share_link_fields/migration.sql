/*
  Warnings:

  - Added the required column `createdBy` to the `share_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `share_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "share_tokens" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
