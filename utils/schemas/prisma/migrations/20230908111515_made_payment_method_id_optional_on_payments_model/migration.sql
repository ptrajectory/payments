-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payment_method_id_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "payment_method_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
