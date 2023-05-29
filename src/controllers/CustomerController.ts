import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateCustomerObj, CustomerLoginObj } from "../dto/customer.dto";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import { Customer } from "../models";

// Customer Signup
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
    const signature = await GenerateSignature(
      {
        _id: result._id,
        email: result.email,
        verified: result.verified,
      },
      "1d"
    );
    // Send the result
    return res
      .status(201)
      .json({ signature, verified: result.verified, email: result.email });
  }

  return res.status(200).json({ res: customerInputs });
};

//Customer Login
export const CustomerLogin = async (req: Request, res: Response) => {
  const customerInputs = plainToClass(CustomerLoginObj, req.body);

  const validateReqObj = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validateReqObj.length > 0) {
    return res.status(400).json(validateReqObj);
  }

  const { email, password } = customerInputs;
  const findUser = await Customer.findOne({ email: email });
  if (findUser) {
    console.log(findUser.password);
    const validatePassword = await ValidatePassword(
      password,
      findUser.password,
      findUser.salt
    );
    if (validatePassword) {
      const accessToken = await GenerateSignature(
        {
          _id: findUser._id,
          email: findUser.email,
          verified: findUser.verified,
        },
        "300s"
      );
      const refreshToken = await GenerateSignature(
        {
          _id: findUser._id,
          email: findUser.email,
          verified: findUser.verified,
        },
        "1d"
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none" as const,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send the findUser with accesstoekn
      return res.status(201).json({
        accessToken,
        verified: findUser.verified,
        email: findUser.email,
      });
    }
    return res.json({ msg: "Error With Signup" });
  }
};
