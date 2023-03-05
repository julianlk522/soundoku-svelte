"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, 
//	need next arg to prevent "res.status is not a function" errors even while it is not being used
next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        error: err.message,
    });
};
exports.errorHandler = errorHandler;
