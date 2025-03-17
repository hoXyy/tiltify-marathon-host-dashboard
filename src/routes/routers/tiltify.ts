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

tiltifyRouter.post("/update-amount", async (_req: Request, res: Response) => {
  try {
    const campaignId = process.env.TILTIFY_CAMPAIGN_ID;

    if (!campaignId) {
      logger.error("Missing campaign ID!");
      res.status(400).json({ error: "Missing campaign ID!" });
    }

    const newAmountData = await tiltifyClient.getCampaignAmount();

    if (!newAmountData) {
      logger.error("Error getting updated amount!");
      res.status(400).json({ error: "Error getting updated amount!" });
    }

    const updatedDBData = await db.campaignData.upsert({
      create: {
        id: campaignId!,
        amount_currency: newAmountData!.currency,
        amount_raised: newAmountData!.value,
      },
      update: {
        amount_currency: newAmountData!.currency,
        amount_raised: newAmountData!.value,
      },
      where: {
        id: campaignId,
      },
    });

    res.json(updatedDBData);
  } catch (error) {
    logger.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default tiltifyRouter;
