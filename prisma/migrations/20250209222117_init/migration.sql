-- CreateTable
CREATE TABLE "donations" (
    "donation_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("donation_id")
);
