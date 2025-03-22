import {
  Typography,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  CssBaseline,
  Container,
} from "@mui/material";
import { DonationsToRead } from "./components/DonationsToRead";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            <b>GTAMarathon 2025</b>
          </Typography>
          <Typography variant="h5" component="div">
            <b>Amount raised: 500 USD</b>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ padding: 4 }}>
        <DonationsToRead />
      </Container>
    </ThemeProvider>
  );
}

export default App;
