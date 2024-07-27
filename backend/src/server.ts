import express from "express";
import dotenv from "dotenv";
import { initialiseRoutes } from "./routes";
import cors from "cors";

const app = express();

dotenv.config();

const port = 3001;

async function startServer() {
  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));
  initialiseRoutes(app);

  const server = app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
}

startServer();
