"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRouter = express_1.default.Router();
exports.borrowRouter.get("/borrow-summary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield borrow_model_1.Borrow.aggregate([
        { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
        {
            $lookup: {
                from: "books",
                localField: "_id",
                foreignField: "_id",
                as: "book",
            },
        },
        { $project: { "book.title": 1, "book.isbn": 1, totalQuantity: 1, _id: 0 } },
    ]);
    res.status(201).json({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data,
    });
}));
exports.borrowRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const borrow = req.body;
    const bookId = borrow.book;
    const orderQuantity = borrow.quantity;
    const data = yield book_model_1.Books.findById(bookId);
    if (data && typeof data.copies === "number" && orderQuantity <= data.copies) {
        try {
            const data = yield borrow_model_1.Borrow.create(borrow);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data,
            });
            // Update the book's available copies
            yield book_model_1.Books.findByIdAndUpdate(bookId, {
                $inc: { copies: -orderQuantity },
            });
        }
        catch (error) {
            res.status(400).json({
                message: "Validation failed",
                success: false,
                error,
            });
        }
    }
    else if (data && typeof data.copies === "number" && data.copies === 0) {
        yield borrow_model_1.Borrow.updateAvailability(bookId);
        res.status(400).json({
            success: false,
            message: "Book is not available.",
        });
    }
    else {
        // Handle the case where the book is not found or copies is undefined
        res.status(400).json({
            success: false,
            message: "Invalid book or insufficient copies.",
        });
    }
}));
