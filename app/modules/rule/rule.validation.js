"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleValidation = void 0;
const zod_1 = require("zod");
const createTermsAndConditionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string({ required_error: 'Terms and conditions is required' }),
    }),
});
const updateTermsAndConditionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
    }),
});
const createDisclaimerZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string({ required_error: 'Disclaimer is required' }),
    }),
});
const updaterDisclaimerZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
    }),
});
exports.RuleValidation = {
    updaterDisclaimerZodSchema,
    createDisclaimerZodSchema,
    createTermsAndConditionZodSchema,
    updateTermsAndConditionZodSchema,
};
