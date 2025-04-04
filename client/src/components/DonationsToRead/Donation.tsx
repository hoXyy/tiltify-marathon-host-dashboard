import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
import { Donation as DonationType } from "../../types/Donation";
import { DateTime } from "luxon";
import axios from "axios";

type Props = {
  donation: DonationType;
};

function markDonationAsRead(id: string) {
  axios.post(`http://localhost:3000/api/donations/mark_as_read/${id}`);
}

export const Donation = ({ donation }: Props) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span">
          {donation.name} - {donation.amount}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <b>Name: </b> {donation.name}
        </p>
        <p>
          <b>Amount: </b> {donation.amount}
        </p>
        <p>
          <b>Donated at: </b>{" "}
          {DateTime.fromISO(donation.donation_time).toLocal().toFormat("D t")}
        </p>
        {donation.description && (
          <p>
            <b>Comment: </b>
            {donation.description}
          </p>
        )}

        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => {
            markDonationAsRead(donation.donation_id);
          }}
        >
          Mark as read
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};
