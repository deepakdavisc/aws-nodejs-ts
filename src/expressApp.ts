import express, { Application } from "express";
import { CustomerRouter } from "./routes/customerRoutes";

module.exports = async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  app.use("/customer", CustomerRouter);
};
