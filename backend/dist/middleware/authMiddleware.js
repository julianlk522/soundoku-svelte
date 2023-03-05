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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const asyncPool = db_1.default.promise();
const protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        if (!process.env.JWT_SECRET) {
            throw new Error('Could not access JWT secret');
        }
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                res.status(401);
                throw new Error('Bearer token could not be identified: not authorized');
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userExists = yield asyncPool.query(`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${decoded.id}\');`);
            if (!Object.values(userExists[0][0])[0]) {
                res.status(401);
                throw new Error('User not found: not authorized');
            }
            req.user_id = decoded.id;
            return next();
        }
        catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Invalid bearer token: not authorized');
        }
    }
    res.status(401);
    throw new Error('No bearer token provided: not authorized');
}));
exports.default = protect;
