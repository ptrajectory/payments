/*
  Warnings:

  - You are about to drop the column `secret_key` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `test_key` on the `Store` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ENVIRONMENT" AS ENUM ('production', 'testing');

-- CreateEnum
CREATE TYPE "PURCHASE_TYPE" AS ENUM ('monthly_subscription', 'one_time');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_checkout_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_customer_id_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing';

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing';

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing',
ADD COLUMN     "purchase_type" "PURCHASE_TYPE" NOT NULL DEFAULT 'one_time';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing',
ALTER COLUMN "checkout_id" DROP NOT NULL,
ALTER COLUMN "customer_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "environment" "ENVIRONMENT" NOT NULL DEFAULT 'testing';

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "secret_key",
DROP COLUMN "test_key",
ADD COLUMN     "prod_publishable_key" TEXT,
ADD COLUMN     "prod_secret_key" TEXT,
ADD COLUMN     "test_publishable_key" TEXT,
ADD COLUMN     "test_secret_key" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_checkout_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "Checkout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
