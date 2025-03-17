export type TiltifyTokenResponse = {
  access_token: string;
  created_at: string;
  expires_in: number;
  refresh_token: string | null;
  scope: string;
  token_type: string;
};

export type TiltifyTokenData = {
  id: string;
  access_token: string;
  token_type: string;
  expires_at: Date;
  created_at: Date;
};

export type TiltifyCampaignData = {
  data: {
    total_amount_raised: {
      currency: string;
      value: string;
    };
  };
};

export type TiltifyCampaignAmountRaised = {
  currency: string;
  value: string;
};

export type TiltifyRawDonation = {
  id: string;
  amount: {
    value: string;
    currency: string;
  };
  donor_name: string;
  campaign_id: string;
  donor_comment: string | null;
  completed_at: string;
};

export type TiltifyRawDonationResponse = {
  data: TiltifyRawDonation[];
  metadata: {
    after: string | null;
    limit: number;
    before: string | null;
  };
};
