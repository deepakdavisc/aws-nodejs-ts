import { IsEmail, Length, MinLength } from "class-validator";

export class CreateCustomerObj {
  @IsEmail()
  email: string;

  @Length(6, 10)
  password: string;

  @MinLength(10)
  phone: string;

  @Length(6, 30)
  firstName: string;

  @Length(6, 30)
  lastName: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}
