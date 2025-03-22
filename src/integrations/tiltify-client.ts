import axios, { AxiosResponse } from "axios";
import {
  TiltifyTokenResponse,
  TiltifyTokenData,
  TiltifyCampaignDataResponse,
  TiltifyCampaignData,
  TiltifyRawDonationResponse,
  TiltifyRawDonation,
} from "./types";
import db from "../controllers/database";
import { donationsSchema } from "../controllers/models/Donation.schema";
import { z } from "zod";
import logger from "./logger";

export class TiltifyClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly TOKEN_EXPIRY_BUFFER = 120;
  public readonly campaignId: string;

  constructor(clientId?: string, clientSecret?: string, campaignId?: string) {
    if (!clientId || !clientSecret || !campaignId) {
      throw new Error(
        "[ERROR] Tiltify client ID, client secret or campaign ID are missing!",
      );
    }

    this.campaignId = campaignId;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /** Helper function to get the access token for the Tiltify API, and to update it if it's expired. */
  public async getValidAccessToken() {
    let latestToken = await db.tiltifyToken.findFirst({
      orderBy: { created_at: "desc" },
    });

    const now = new Date();
    if (
      !latestToken ||
      latestToken.expires_at.getTime() - now.getTime() <=
        this.TOKEN_EXPIRY_BUFFER * 1000
    ) {
      logger.info("OAuth token expired or missing, generating a new one...");
      latestToken = await this.updateAccessToken();
    }

    return latestToken?.access_token;
  }

  /** Handles the process of updating the access token for the Tiltify API. */
  public async updateAccessToken(): Promise<TiltifyTokenData | null> {
    try {
      logger.info("Updating Tiltify access token...");
      const tokenApiResponse = await axios.post<TiltifyTokenResponse>(
        "https://v5api.tiltify.com/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: "public",
        },
      );

      return await this.storeAccessToken(tokenApiResponse.data);
    } catch (err) {
      logger.error("Error fetching OAuth token:", err);
      return null;
    }
  }

  /** Saves access token to database, in table `tiltify_token`. */
  async storeAccessToken(
    tokenData: TiltifyTokenResponse,
  ): Promise<TiltifyTokenData> {
    const { access_token, token_type, expires_in } = tokenData;
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expires_in);

    // Remove old token to keep the database clean
    await db.tiltifyToken.deleteMany({});

    const newToken = await db.tiltifyToken.create({
      data: {
        access_token: access_token,
        token_type: token_type,
        expires_at: expiryDate,
      },
    });

    logger.info("New OAuth token stored successfully.");
    return newToken;
  }

  /** Gets data for campaign. */
  public async getCampaignData(): Promise<TiltifyCampaignData | undefined> {
    try {
      const accessToken = await this.getValidAccessToken();

      if (!accessToken) {
        logger.error("No valid access token received!");
        return;
      }

      const rawCampaignData = await axios.get<TiltifyCampaignDataResponse>(
        `https://v5api.tiltify.com/api/public/campaigns/${this.campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const campaignData: TiltifyCampaignData = {
        id: rawCampaignData.data.data.id,
        name: rawCampaignData.data.data.name,
        amount_raised: rawCampaignData.data.data.total_amount_raised,
      };

      return campaignData;
    } catch (err) {
      logger.error(
        "Error occurred trying to get the campaign raised amount: ",
        err,
      );
    }
  }

  /** Gets 50 most recent donations. */
  public async getRecentDonations(): Promise<z.infer<typeof donationsSchema>> {
    try {
      const accessToken = await this.getValidAccessToken();
      const perPage = 50;
      const donations: z.infer<typeof donationsSchema> = [];

      if (!accessToken) {
        logger.error("No access token received!");
        return [];
      }

      const response: AxiosResponse<TiltifyRawDonationResponse> =
        await axios.get(
          `https://v5api.tiltify.com/api/public/campaigns/${this.campaignId}/donations`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              limit: perPage,
            },
          },
        );

      const { data } = response.data;

      const formattedDonations = this.formatRawDonations(data);

      donations.push(...formattedDonations);

      return donations;
    } catch (error) {
      logger.error(
        "Error occurred trying to get most recent donations: ",
        error,
      );
      return [];
    }
  }

  /** Gets all donations for campaign.
   *
   * *Only used during first startup, so this function is not exposed to the API and all the database functionality is done in this function.*
   */
  public async getAllDonations(): Promise<void> {
    try {
      const accessToken = await this.getValidAccessToken();
      const perPage = 50;
      const donations: z.infer<typeof donationsSchema> = [];
      let hasMore: boolean = true;
      let cursorPosition: string | null = null;

      if (!accessToken) {
        logger.error("No access token received!");
        return;
      }

      while (hasMore) {
        const response: AxiosResponse<TiltifyRawDonationResponse> =
          await axios.get(
            `https://v5api.tiltify.com/api/public/campaigns/${this.campaignId}/donations`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              params: {
                limit: perPage,
                after: cursorPosition,
              },
            },
          );

        const { data, metadata } = response.data;

        const formattedDonations = this.formatRawDonations(data);

        donations.push(...formattedDonations);

        cursorPosition = metadata.after;
        hasMore = cursorPosition !== null;
      }

      const addedDonations = await db.donation.createManyAndReturn({
        select: { donation_id: true },
        data: donations,
        skipDuplicates: true,
      });

      logger.info(
        `Added ${addedDonations.length} donations to the database on startup...`,
      );
    } catch (error) {
      logger.error(`Error occurred trying to get all donations: ${error}`);
    }
  }

  /** Gets initial data for campaign.
   *
   * *Only used during first startup, so this function is not exposed to the API and all the database functionality is done in this function.*
   */
  public async getInitialCampaignData(): Promise<void> {
    try {
      logger.info("Getting initial campaign data");
      const campaignData = await this.getCampaignData();

      if (!campaignData) {
        throw new Error("No initial campaign data received!");
      }

      await db.campaignData.upsert({
        create: {
          id: campaignData.id,
          name: campaignData.name,
          amount_currency: campaignData.amount_raised.currency,
          amount_raised: campaignData.amount_raised.value,
        },
        update: {
          amount_currency: campaignData.amount_raised.currency,
          amount_raised: campaignData.amount_raised.value,
        },
        where: {
          id: campaignData.id,
        },
      });
    } catch (error) {
      logger.error(`Failed getting initial campaign data! Reason: ${error}`);
    }
  }

  private formatRawDonations(
    rawDonations: TiltifyRawDonation[],
  ): z.infer<typeof donationsSchema> {
    return rawDonations.map((donation) => {
      return {
        name: donation.donor_name,
        donation_id: donation.id,
        campaign_id: donation.campaign_id,
        amount: `${donation.amount.value} ${donation.amount.currency}`,
        donation_time: new Date(donation.completed_at),
        description:
          donation.donor_comment !== null ? donation.donor_comment : undefined,
      };
    });
  }
}
