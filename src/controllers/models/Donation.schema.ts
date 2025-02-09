import { z } from "zod";

export const donationSchema = z.object({
  donation_id: z.number(),
  event_id: z.number(),
  name: z.string(),
  amount: z
    .string()
    .regex(
      /^\d+\.\d{2}$/,
      "Amount must be a valid number with two decimal places",
    ),
  description: z.string().nullable(),
});

export const donationsSchema = z.array(donationSchema);
