import express, { Application, Request, Response } from "express";
import { CustomerRouter } from "./routes/customerRoutes";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());
  console.log("aaa");
  app.get("/", (req: Request, res: Response) => {
    return res.status(200).send("home page");
  });
  app.use("/customer", CustomerRouter);

  return app;
};
