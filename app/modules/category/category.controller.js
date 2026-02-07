"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const category_service_1 = require("./category.service");
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const categoryData = req.body;
    let image = "";
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const data = {
        ...categoryData,
        image,
    };
    const result = await category_service_1.CategoryService.createCategoryToDB(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category create successfully',
        data: result,
    });
});
const getCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryService.getCategoriesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category create successfully',
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const updateCategoryData = req.body;
    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }
    const data = {
        ...updateCategoryData,
        image
    };
    const result = await category_service_1.CategoryService.updateCategoryToDB(id, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category updated successfully',
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await category_service_1.CategoryService.deleteCategoryToDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category delete successfully',
        data: result,
    });
});
exports.CategoryController = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
