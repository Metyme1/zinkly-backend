"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonValidation = void 0;
const zod_1 = require("zod");
const createLessonZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        notes: zod_1.z.string({ required_error: 'Notes is required' }),
        price: zod_1.z.number({ required_error: 'Price is required' }),
        lessonOutline: zod_1.z.string({ required_error: 'Lesson Outline is required' }),
        duration: zod_1.z.string({ required_error: 'Duration is required' }),
        lessonTitle: zod_1.z.string({ required_error: 'Lesson Title is required' }),
        lessonDescription: zod_1.z.string({ required_error: 'Lesson Description is required' }),
        bio: zod_1.z.string({ required_error: 'Bio is required' }),
        genre: zod_1.z.string({ required_error: 'Genre is required' }),
        instrument: zod_1.z.string({ required_error: 'Instrument is required' })
    }),
});
const updateLessonZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        notes: zod_1.z.string(),
        price: zod_1.z.number(),
        lessonOutline: zod_1.z.string().optional(),
        duration: zod_1.z.string().optional(),
        lessonTitle: zod_1.z.string().optional(),
        lessonDescription: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        instrument: zod_1.z.string().optional(),
    }),
});
const moveLessonZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({ required_error: 'userId is required' }),
    }),
});
exports.LessonValidation = {
    createLessonZodSchema,
    updateLessonZodSchema,
    moveLessonZodSchema,
};
