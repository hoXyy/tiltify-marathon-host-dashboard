-- CreateTable
CREATE TABLE "donations" (
    "donation_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "description" TEXT,
    "donation_time" DATETIME NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "campaign_id" TEXT NOT NULL,
    CONSTRAINT "donations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign_data" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campaign_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount_raised" TEXT NOT NULL,
    "amount_currency" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tiltify_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
