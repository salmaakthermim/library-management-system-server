import { model, Schema } from "mongoose";
import { borrowStaticMethod, IBorrow } from "../interfaces/borrow.interfaces";
import { Books } from "./book.model";

const borrowSchema = new Schema<IBorrow, borrowStaticMethod>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Books", required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: { type: Date, required: true },
  },
  { versionKey: false, timestamps: true }
);

borrowSchema.static("updateAvailability", async function (bookId: string) {
  const book = await Books.findById(bookId);
  if (book) {
    const isAvailable = book.copies > 0;
    await Books.findByIdAndUpdate(bookId, { available: isAvailable });
  }
});

export const Borrow = model<IBorrow, borrowStaticMethod>(
  "Borrow",
  borrowSchema
);
