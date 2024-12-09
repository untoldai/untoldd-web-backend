import mongoose, { Schema } from "mongoose";
const BlogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
    },
    heading: {
      type: String,
      required:true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    blogText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Blog=mongoose.model("Blog",BlogSchema)