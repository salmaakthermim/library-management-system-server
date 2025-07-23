import express, { Request, Response } from "express";
import { Books } from "../models/book.model";
import { Borrow } from "../models/borrow.model";

export const borrowRouter = express.Router();

borrowRouter.get("/borrow-summary", async (req: Request, res: Response) => {
  const data = await Borrow.aggregate([
    { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    { $project: { "book.title": 1, "book.isbn": 1, totalQuantity: 1,_id: 0 } },
  ]);
  res.status(201).json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data,
  });
});

borrowRouter.post("/", async (req: Request, res: Response) => {
  const borrow = req.body;
  const bookId = borrow.book;
  const orderQuantity = borrow.quantity;
  const data = await Books.findById(bookId);
  if (data && typeof data.copies === "number" && orderQuantity <= data.copies) {
    try {
      const data = await Borrow.create(borrow);
      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data,
      });
      // Update the book's available copies
      await Books.findByIdAndUpdate(bookId, {
        $inc: { copies: -orderQuantity },
      });
    } catch (error) {
      res.status(400).json({
        message: "Validation failed",
        success: false,
        error,
      });
    }
  } else if (data && typeof data.copies === "number" && data.copies === 0) {
    await Borrow.updateAvailability(bookId);
    res.status(400).json({
      success: false,
      message: "Book is not available.",
    });
  } else {
    // Handle the case where the book is not found or copies is undefined
    res.status(400).json({
      success: false,
      message: "Invalid book or insufficient copies.",
    });
  }
});
