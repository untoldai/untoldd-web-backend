import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import Razorpay from "razorpay";

export const createInstance = new Razorpay({
  key_id: "rzp_test_xKVw1JqVJzxhCB",
  key_secret: "xq1loYnBSLra3V4rYq271XGE",
});
