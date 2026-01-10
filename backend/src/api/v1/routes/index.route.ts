import { Application } from "express";
import userRoute from "./user.route";
import binRoute from "./bin.route";
import collectionPointRoute from "./collectionPoint.route";
import areaRoute from "./area.route";
import collectionScheduleRoute from "./collectionSchedule.route";
import vehicleRoute from "./vehicle.route";
import reportRoute from "./citizenReport.route";
import authRoute from "./auth.route";

const clientRoute = (app: Application) => {
  const path = "/api";
  app.use(path + "/users", userRoute);
  app.use(path + "/bins", binRoute);
  app.use(path + "/collection-points", collectionPointRoute);
  app.use(path + "/areas", areaRoute);
  app.use(path + "/collection-schedules", collectionScheduleRoute);
  app.use(path + "/vehicles", vehicleRoute);
  app.use(path + "/citizen-reports", reportRoute);
  app.use(path + "/auth", authRoute);
};

export default clientRoute;
