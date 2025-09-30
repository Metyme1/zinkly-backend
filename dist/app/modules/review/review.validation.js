"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string({ required_error: "Title is required" }),
        rating: zod_1.z.number({ required_error: "Rating is required" })
    })
});
exports.ReviewValidation = { createReviewZodSchema };
