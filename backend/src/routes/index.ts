import { Application } from "express";
import userRoute from "./user";
import merchantRoute from "./merchant";
export const initialiseRoutes = (app: Application) => {
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/merchant", merchantRoute);
};

export default initialiseRoutes;
