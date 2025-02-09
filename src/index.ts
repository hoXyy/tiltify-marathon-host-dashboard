import express from "express";
import cors from "cors";
import path from "path";
import apiRouter from "./routes/api";
import errorHandler from "./middleware/errorHandler.middleware";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api", apiRouter);

app.use(errorHandler);

/* app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[LOG] Server listening on port ${PORT}`);
});
