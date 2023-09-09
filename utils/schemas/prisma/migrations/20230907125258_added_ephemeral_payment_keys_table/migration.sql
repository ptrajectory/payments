-- CreateTable
CREATE TABLE "EphemeralPaymentKeys" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EphemeralPaymentKeys_pkey" PRIMARY KEY ("id")
);
