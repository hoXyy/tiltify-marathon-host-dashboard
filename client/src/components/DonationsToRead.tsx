import { Box, Paper, Typography } from "@mui/material";
import { Donation } from "./DonationsToRead/Donation";
import { Donation as DonationType } from "../types/Donation";

type Props = {
  donations: DonationType[];
};

export const DonationsToRead = ({ donations }: Props) => {
  return (
    <Paper>
      <Box width="100%" sx={{ backgroundColor: "black", textAlign: "center" }}>
        <Typography variant="h5">
          <b>DONATIONS TO READ</b>
        </Typography>
        <p style={{ padding: "5px" }}>
          {donations.length > 0 &&
            donations.map((donation) => {
              return (
                <Donation key={donation.donation_id} donation={donation} />
              );
            })}
        </p>
      </Box>
    </Paper>
  );
};
