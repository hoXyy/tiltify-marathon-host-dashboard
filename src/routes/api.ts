import { Router } from "express";
import donationsRouter from "./routers/donations";
import tiltifyRouter from "./routers/tiltify";

const apiRouter = Router();

apiRouter.use("/donations", donationsRouter);
apiRouter.use("/tiltify", tiltifyRouter);

export default apiRouter;
