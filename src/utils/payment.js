import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import Razorpay from "razorpay";

export const createInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
