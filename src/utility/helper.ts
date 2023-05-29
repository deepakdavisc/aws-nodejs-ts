import bcrypt from "bcrypt";
import { CustomerPayload } from "../dto/customer.dto";
const { APP_SECRET } = require("../config");
import jwt from "jsonwebtoken";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const GenerateSignature = async (
  payload: CustomerPayload,
  duration: string
) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: duration });
};
