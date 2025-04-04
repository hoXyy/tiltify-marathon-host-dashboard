-- CreateTable
CREATE TABLE "donations" (
    "donation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "description" TEXT,
    "donation_time" TIMESTAMP(3) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("donation_id")
);

-- CreateTable
CREATE TABLE "campaign_data" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount_raised" TEXT NOT NULL,
    "amount_currency" TEXT NOT NULL,

    CONSTRAINT "campaign_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiltify_token" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tiltify_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
