import express from "express";
import { CustomerSignUp } from "../controllers/CustomerController";

const router = express.Router();

router.post("/signup", CustomerSignUp);

export { router as CustomerRouter };
