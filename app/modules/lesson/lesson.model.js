"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const lessonSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true
    },
    instrument: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    lessonTitle: {
        type: String,
        required: true
    },
    lessonDescription: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    lessonOutline: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRating: {
        type: Number,
        required: false,
        default: 0
    },
    gallery: [
        {
            type: String,
            require: true
        }
    ]
}, { timestamps: true });
//exist user check
lessonSchema.statics.isExistLessonById = async (id) => {
    const isExist = await exports.Lesson.findById(id);
    return isExist;
};
exports.Lesson = (0, mongoose_1.model)('Lesson', lessonSchema);
