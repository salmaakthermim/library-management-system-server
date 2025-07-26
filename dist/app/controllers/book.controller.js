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
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.bookRouter = express_1.default.Router();
exports.bookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield book_model_1.Books.find({});
    res.status(201).json({
        success: true,
        message: "Books retrieved successfully",
        data,
    });
}));
exports.bookRouter.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const data = yield book_model_1.Books.findById(bookId);
    res.status(201).json({
        success: true,
        message: "Books retrieved successfully",
        data,
    });
}));
exports.bookRouter.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const body = req.body.data;
    console.log(body);
    const data = yield book_model_1.Books.findByIdAndUpdate(bookId, body, { new: true });
    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data,
    });
}));
exports.bookRouter.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const data = yield book_model_1.Books.findByIdAndDelete(bookId);
    res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
    });
}));
exports.bookRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const data = yield book_model_1.Books.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
