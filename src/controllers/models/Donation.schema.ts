import { z } from "zod";

export const donationSchema = z.object({
  donation_id: z.string(),
  campaign_id: z.string(),
  name: z.string(),
  amount: z
    .string()
    .regex(
      /^\d+\.\d{2}$/,
      "Amount must be a valid number with two decimal places",
    ),
  description: z.string().optional(),
  donation_time: z.date(),
  is_read: z.boolean().optional(),
});

export const donationsSchema = z.array(donationSchema);
