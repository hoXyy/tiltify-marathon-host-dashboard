import { Router } from "express";
import { TiltifyClient } from "../../integrations/tiltify-client";
import db from "../../controllers/database";
import { Request, Response } from "express";
import logger from "../../integrations/logger";

export const tiltifyClient = new TiltifyClient(
  process.env.TILTIFY_CLIENT_ID,
  process.env.TILTIFY_CLIENT_SECRET,
  process.env.TILTIFY_CAMPAIGN_ID,
);

const tiltifyRouter = Router();

tiltifyRouter.get("/get-amount", async (_req: Request, res: Response) => {
  const campaignAmountData = await db.campaignData.findFirst({
    where: { id: process.env.TILTIFY_CAMPAIGN_ID },
    select: { amount_currency: true, amount_raised: true },
  });

  res.json(campaignAmountData ?? {});
});

tiltifyRouter.get(
  "/get-all-campaign-info",
  async (_req: Request, res: Response) => {
    const campaignData = await db.campaignData.findFirst({
      where: { id: process.env.TILTIFY_CAMPAIGN_ID },
      include: { donations: true },
    });

    res.json(campaignData ?? {});
  },
);
tiltifyRouter.post(
  "/update-all-campaign-info",
  async (_req: Request, res: Response) => {
    const campaignId = process.env.TILTIFY_CAMPAIGN_ID;

    if (!campaignId) {
      logger.error("Missing campaign ID!");
      res.status(400).json({ error: "Missing campaign ID!" });
    }

    const newCampaignData = await tiltifyClient.getCampaignData();

    if (!newCampaignData) {
      logger.error("Error getting updated amount!");
      res.status(400).json({ error: "Error getting updated amount!" });
    }

    await db.campaignData.upsert({
      create: {
        id: newCampaignData!.id,
        name: newCampaignData!.name,
        amount_currency: newCampaignData!.amount_raised.currency,
        amount_raised: newCampaignData!.amount_raised.value,
      },
      update: {
        amount_currency: newCampaignData!.amount_raised.currency,
        amount_raised: newCampaignData!.amount_raised.value,
      },
      where: {
        id: newCampaignData!.id,
      },
    });

    const mostRecentDonationsFromTiltify =
      await tiltifyClient.getRecentDonations();

    // Get existing donation IDs
    const existingDonations = await db.donation.findMany({
      where: {
        donation_id: {
          in: mostRecentDonationsFromTiltify.map((d) => d.donation_id),
        },
      },
      select: { donation_id: true },
    });

    const existingIds = new Set(existingDonations.map((d) => d.donation_id));

    // Filter out duplicates
    const newDonations = mostRecentDonationsFromTiltify.filter(
      (donation) => !existingIds.has(donation.donation_id),
    );

    await db.donation.createMany({
      data: newDonations,
    });

    const campaignData = await db.campaignData.findUnique({
      where: { id: campaignId },
      include: {
        donations: {
          orderBy: { donation_time: "desc" },
        },
      },
    });

    res.json(campaignData ?? {});
  },
);

tiltifyRouter.post(
  "/update-recent-donations",
  async (_req: Request, res: Response) => {
    try {
      const mostRecentDonationsFromTiltify =
        await tiltifyClient.getRecentDonations();

      const existingDonations = await db.donation.findMany({
        where: {
          donation_id: {
            in: mostRecentDonationsFromTiltify.map((d) => d.donation_id),
          },
        },
        select: { donation_id: true },
      });

      const existingIds = new Set(existingDonations.map((d) => d.donation_id));

      const newDonations = mostRecentDonationsFromTiltify.filter(
        (donation) => !existingIds.has(donation.donation_id),
      );

      await db.donation.createMany({
        data: newDonations,
      });

      res.json({ added: newDonations.length });
    } catch (error) {
      logger.error("Server error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

tiltifyRouter.post("/update-amount", async (_req: Request, res: Response) => {
  try {
    const campaignId = process.env.TILTIFY_CAMPAIGN_ID;

    if (!campaignId) {
      logger.error("Missing campaign ID!");
      res.status(400).json({ error: "Missing campaign ID!" });
    }

    const newCampaignData = await tiltifyClient.getCampaignData();

    if (!newCampaignData) {
      logger.error("Error getting updated amount!");
      res.status(400).json({ error: "Error getting updated amount!" });
    }

    const updatedDBData = await db.campaignData.upsert({
      create: {
        id: newCampaignData!.id,
        name: newCampaignData!.name,
        amount_currency: newCampaignData!.amount_raised.currency,
        amount_raised: newCampaignData!.amount_raised.value,
      },
      update: {
        amount_currency: newCampaignData!.amount_raised.currency,
        amount_raised: newCampaignData!.amount_raised.value,
      },
      where: {
        id: newCampaignData!.id,
      },
    });

    res.json(updatedDBData);
  } catch (error) {
    logger.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default tiltifyRouter;
