import { Router } from "express";

import { tryWrapper } from "../utils/index.js";
import activitiesService from "../services/activities-services.js";
import { getActivities } from "../controllers/activities-controller.js";

const activities = Router();

activities.get("/", tryWrapper(getActivities));
// authRouter.post("/login", tryWrapper(login));
// authRouter.post("/refresh", refreshAuth, tryWrapper(refreshToken));

// authRouter.post("/logout", auth, tryWrapper(logout));

export default activities;
