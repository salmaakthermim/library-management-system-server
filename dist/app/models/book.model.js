"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
    available: { type: Boolean, required: true, default: true },
}, { versionKey: false, timestamps: true });
exports.Books = (0, mongoose_1.model)("Books", bookSchema);
