import { NextFunction, Request, Response } from "express";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json({ res: true });
};
