import { Router } from "express";
import { donationsSchema } from "../controllers/models/Donation.schema";
import db from "../controllers/database";
import validate from "../middleware/validate.middleware";
import { z } from "zod";

const apiRouter = Router();

apiRouter.get("/donations/all/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  const donations = await db.donation.findMany({
    where: {
      event_id: parseInt(eventId),
    },
  });
  res.json(donations);
});

apiRouter.get("/donations/all", async (req, res) => {
  const donations = await db.donation.findMany();
  res.json(donations);
});

apiRouter.post("/donation/add", validate(donationsSchema), async (req, res) => {
  const donationData: z.infer<typeof donationsSchema> = req.body;

  const addedDonationIds = await db.donation.createManyAndReturn({
    select: { donation_id: true },
    data: donationData,
  });
  res.json({ addedDonationIds: addedDonationIds });
});

export default apiRouter;
