/*
  Warnings:

  - The `environment` column on the `Store` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "environment",
ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing';
