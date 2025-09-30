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
lessonSchema.statics.isExistLessonById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.Lesson.findById(id);
    return isExist;
});
exports.Lesson = (0, mongoose_1.model)('Lesson', lessonSchema);
