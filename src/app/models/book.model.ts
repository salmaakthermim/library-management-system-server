import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.intrefaces";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "{VALUE} is not a valid genre",
      },
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [1, "Copies must be a positive number"],
    },
    available: { type: Boolean, required: true , default: true },
  },
  { versionKey: false, timestamps: true }
);

export const Books = model("Books", bookSchema);
