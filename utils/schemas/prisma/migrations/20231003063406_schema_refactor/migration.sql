/*
  Warnings:

  - The `status` column on the `Cart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Checkout` table. All the data in the column will be lost.
  - The `status` column on the `Checkout` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - The `status` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `prod_publishable_key` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `prod_secret_key` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `test_publishable_key` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `test_secret_key` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the `EphemeralPaymentKeys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookHandler` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PRODUCT_TYPES" AS ENUM ('physical', 'digital', 'service', 'subscription', 'bundle', 'event_ticket', 'discounted');

-- CreateEnum
CREATE TYPE "PRODUCT_STATUS" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "CHECKOUT_STATUS" AS ENUM ('pending_payment', 'processing', 'failed', 'success');

-- CreateEnum
CREATE TYPE "CART_STATUS" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "PAYMENT_STATE" AS ENUM ('processing', 'failed', 'success', 'cancelled', 'timed_out');

-- CreateEnum
CREATE TYPE "KEY_STATUS" AS ENUM ('active', 'inactive');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PURCHASE_TYPE" ADD VALUE 'pre_order';
ALTER TYPE "PURCHASE_TYPE" ADD VALUE 'backorder';
ALTER TYPE "PURCHASE_TYPE" ADD VALUE 'pay_what_you_want';

-- DropForeignKey
ALTER TABLE "WebhookHandler" DROP CONSTRAINT "WebhookHandler_store_id_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status",
ADD COLUMN     "status" "CART_STATUS" NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "amount",
ALTER COLUMN "currency" SET DEFAULT 'KES',
DROP COLUMN "status",
ADD COLUMN     "status" "CHECKOUT_STATUS" NOT NULL DEFAULT 'pending_payment',
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "state" "PAYMENT_STATE" NOT NULL DEFAULT 'processing';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "PRODUCT_TYPES" NOT NULL DEFAULT 'physical',
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "PRODUCT_STATUS" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "prod_publishable_key",
DROP COLUMN "prod_secret_key",
DROP COLUMN "test_publishable_key",
DROP COLUMN "test_secret_key";

-- DropTable
DROP TABLE "EphemeralPaymentKeys";

-- DropTable
DROP TABLE "WebhookHandler";

-- CreateTable
CREATE TABLE "Keys" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expiry" TIMESTAMP(3),
    "status" "KEY_STATUS" NOT NULL DEFAULT 'active',
    "value" TEXT NOT NULL,
    "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing',

    CONSTRAINT "Keys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Keys" ADD CONSTRAINT "Keys_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
