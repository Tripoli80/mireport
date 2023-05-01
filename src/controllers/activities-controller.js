import activitiesService from "../services/activities-services.js";
import authService from "../services/activities-services.js";


export const getActivities = async (req, res, next) => {
  const {category, closed}=req.query

  const result = await activitiesService.getActivities({ category, closed });
  res.status(201).json(result);
};
