import { Application } from "express";
import userRoute from "./user.route";




const clientRoute = (app: Application) => {
  const path = "/api";
  app.use(path + "/user", userRoute);
};

export default clientRoute;