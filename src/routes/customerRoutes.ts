import express, { Request, Response } from "express";
import {
  CustomerSignUp,
  CustomerLogin,
} from "../controllers/CustomerController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).send("Hello world..........");
});
router.post("/signup", CustomerSignUp);

router.post("/login", CustomerLogin);

export { router as CustomerRouter };
