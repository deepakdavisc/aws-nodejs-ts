import mongoose, { Document, Schema } from "mongoose";

interface CustomerDocument extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
}

const CustomerSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String, required: true },
  verified: { type: Boolean },
  otp: { type: Number },
  otp_expiry: { type: Date },
});

const Customer = mongoose.model<CustomerDocument>("customer", CustomerSchema);
export { Customer };
