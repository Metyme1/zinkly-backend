"use strict";
// class ApiError extends Error {
//   statusCode: number;
//   constructor(statusCode: number, message: string | undefined, stack = '') {
//     super(message);
//     this.statusCode = statusCode;
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }
Object.defineProperty(exports, "__esModule", { value: true });
// export default ApiError;
class ApiError extends Error {
    constructor(statusCode, message, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name; // "ApiError"
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
