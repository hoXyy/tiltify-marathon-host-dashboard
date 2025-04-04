import { Donation } from "./Donation";

export type Campaign = {
    id: string;
    name: string;
    amount_raised: string;
    amount_currency: string;
    donations: Donation[]
}