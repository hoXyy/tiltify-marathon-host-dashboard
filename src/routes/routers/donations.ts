import { Router } from "express";
import { donationsSchema } from "../../controllers/models/Donation.schema";
import db from "../../controllers/database";
import validate from "../../middleware/validate.middleware";
import { z } from "zod";
import logger from "../../integrations/logger";

const donationsRouter = Router();

donationsRouter.get("/all/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  const donations = await db.donation.findMany({
    where: {
      campaign_id: eventId,
    },
  });
  res.json(donations);
});

donationsRouter.get("/all", async (req, res) => {
  const donations = await db.donation.findMany();
  res.json(donations);
});

donationsRouter.post("/add", validate(donationsSchema), async (req, res) => {
  const donationData: z.infer<typeof donationsSchema> = req.body;

  const addedDonationIds = await db.donation.createManyAndReturn({
    select: { donation_id: true },
    data: donationData,
  });
  res.json({ addedDonationIds: addedDonationIds });
});

donationsRouter.post("/mark_as_read/:id", async (req, res) => {
  const donationId = req.params.id;

  logger.info(`Marking donation ID ${donationId} as read...`);

  const markedDonationId = await db.donation.update({
    where: { donation_id: donationId },
    data: { is_read: true },
    select: { donation_id: true },
  });

  res.json(markedDonationId);
});

export default donationsRouter;
