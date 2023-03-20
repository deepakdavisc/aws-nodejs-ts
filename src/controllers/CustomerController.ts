import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateCustomerObj } from "../dto/customer.dto";
import { GenerateSalt, GeneratePassword, GenerateSignature } from "../utility";
import { Customer } from "../models";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerObj, req.body);

  const validateReqObj = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validateReqObj.length > 0) {
    return res.status(400).json(validateReqObj);
  }

  const { email, password, phone, firstName, lastName } = customerInputs;

  const salt = await GenerateSalt();

  const customerPassword = await GeneratePassword(password, salt);

  const existingCustomer = await Customer.find({ email: email });

  if (existingCustomer.length) {
    return res.status(400).json({ message: "email already exists....." });
  }

  const result = await Customer.create({
    email: email,
    password: customerPassword,
    salt: salt,
    phone: phone,
    firstName: firstName,
    lastName: lastName,
    verified: false,
  });

  if (result) {
    //Generate the Signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    // Send the result
    return res
      .status(201)
      .json({ signature, verified: result.verified, email: result.email });
  }

  return res.status(200).json({ res: customerInputs });
};
