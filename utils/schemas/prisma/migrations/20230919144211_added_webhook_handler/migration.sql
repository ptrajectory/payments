-- CreateTable
CREATE TABLE "WebhookHandler" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "custom_headers" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "subscriptions" JSONB,

    CONSTRAINT "WebhookHandler_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookHandler" ADD CONSTRAINT "WebhookHandler_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
