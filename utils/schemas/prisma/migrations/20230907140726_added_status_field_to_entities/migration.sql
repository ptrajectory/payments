-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Checkout" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "status" TEXT;
