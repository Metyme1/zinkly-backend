"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const category_model_1 = require("./category.model");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const createCategoryToDB = async (payload) => {
    const { categoryName, image } = payload;
    const isExistName = await category_model_1.Category.findOne({ categoryName: categoryName });
    if (isExistName) {
        (0, unlinkFile_1.default)(image);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This Category Name Already Exist");
    }
    const createCategory = await category_model_1.Category.create(payload);
    if (!createCategory) {
        (0, unlinkFile_1.default)(image);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create category');
    }
    return createCategory;
};
const getCategoriesFromDB = async () => {
    const result = await category_model_1.Category.find({});
    return result;
};
const updateCategoryToDB = async (id, payload) => {
    const isExistCategory = await category_model_1.Category.findById(id);
    if (!isExistCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category doesn't exist");
    }
    if (payload.image) {
        (0, unlinkFile_1.default)(isExistCategory?.image);
    }
    const updateCategory = await category_model_1.Category.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateCategory;
};
const deleteCategoryToDB = async (id) => {
    const deleteCategory = await category_model_1.Category.findByIdAndDelete(id);
    if (!deleteCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category doesn't exist");
    }
    return deleteCategory;
};
exports.CategoryService = {
    createCategoryToDB,
    getCategoriesFromDB,
    updateCategoryToDB,
    deleteCategoryToDB,
};
