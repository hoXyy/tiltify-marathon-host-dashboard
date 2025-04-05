import {
  Typography,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  CssBaseline,
  Container,
  LinearProgress,
} from "@mui/material";
import { DonationsToRead } from "./components/DonationsToRead";
import { Campaign } from "./types/Campaign";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const [countdown, setCountdown] = useState<number>(15);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCountingDown = useRef(false);
  const countdownProgress = useMemo(() => {
    return (countdown / 15) * 100;
  }, [countdown]);

  const clearCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isCountingDown.current = false;
  };

  const startCountdown = () => {
    if (isCountingDown.current) return;

    isCountingDown.current = true;
    setCountdown(15);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearCountdown();
          fetchData(); // Will restart countdown on completion
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchData = async () => {
    clearCountdown(); // Stop any active countdown before fetching
    setIsLoading(true);

    try {
      const response = await axios.post<Campaign>(
        `${import.meta.env.VITE_API_URL}/api/tiltify/update-all-campaign-info`
      );
      setCampaignData(response.data);
    } catch (err) {
      console.error("Error fetching campaign data:", err);
    } finally {
      setIsLoading(false);
      startCountdown(); // Always restart countdown after fetch completes
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      clearCountdown();
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            <b>{campaignData?.name}</b>
          </Typography>

          <Typography variant="h5" component="div">
            <b>
              Amount raised: {campaignData?.amount_raised}{" "}
              {campaignData?.amount_currency}
            </b>
          </Typography>
        </Toolbar>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <LinearProgress variant="determinate" value={countdownProgress} />
        )}
      </AppBar>
      <Container sx={{ padding: 4, textAlign: "center" }}>
        <p>
          {" "}
          {isLoading
            ? "Refreshing..."
            : `Refreshing in ${countdown} seconds...`}
        </p>
        {campaignData && campaignData.donations.length > 0 ? (
          <DonationsToRead
            donations={campaignData.donations.filter(
              (donation) => !donation.is_read
            )}
          />
        ) : (
          <p>No unread donations yet.</p>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
