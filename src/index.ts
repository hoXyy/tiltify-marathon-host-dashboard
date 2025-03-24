import express from "express";
import cors from "cors";
import path from "path";
import apiRouter from "./routes/api";
import errorHandler from "./middleware/errorHandler.middleware";
import { tiltifyClient } from "./routes/routers/tiltify";
import logger from "./integrations/logger";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api", apiRouter);

app.use(errorHandler);

(async () => {
  try {
    // Only on init
    await tiltifyClient.getInitialCampaignData();
    await tiltifyClient.getAllDonations();
  } catch (error) {
    logger.error("Failed to fetch donations:", error);
  }
})();

/* app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
