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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWinsByUser = exports.getUserScore = exports.loginUser = exports.addUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const asyncPool = db_1.default.promise();
exports.getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT name, total_score FROM users;';
    const userData = yield asyncPool.query(sql);
    res.status(200).json(userData[0]);
}));
exports.addUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, pass } = req.body;
    if (!name || !pass) {
        res.status(400);
        throw new Error('Name or password not supplied');
    }
    //	check if user exists
    const userExists = yield asyncPool.query(`SELECT EXISTS (SELECT name FROM users WHERE name = \'${name}\');`);
    //  abort if user exists
    if (Object.values(userExists[0][0])[0] === 1) {
        res.status(400);
        throw new Error('name taken');
    }
    // 	add to db
    const salt = yield bcryptjs_1.default.genSalt();
    const hashedPass = yield bcryptjs_1.default.hash(pass, salt);
    const insertUserData = `INSERT INTO users (name, hashed_pass) VALUES ('${name}', '${hashedPass}');`;
    yield asyncPool.query(insertUserData);
    //  return new user data
    const select = `SELECT * FROM users WHERE name = '${name}';`;
    const newUserData = yield asyncPool.query(select);
    const _a = newUserData[0][0], { user_id, hashed_pass } = _a, userData = __rest(_a, ["user_id", "hashed_pass"]);
    const token = generateToken(user_id);
    res.status(200).json(Object.assign(Object.assign({}, userData), { token }));
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, pass } = req.body;
    if (!name || !pass) {
        res.status(400);
        throw new Error('Name or password not supplied');
    }
    //	check if user exists
    const userExists = yield asyncPool.query(`SELECT EXISTS (SELECT name FROM users WHERE name = \'${name}\');`);
    //  abort if user does not exist
    if (!Object.values(userExists[0][0])[0]) {
        res.status(400);
        throw new Error('user does not exist');
    }
    //	check if pass matches
    const rawUserPassData = yield asyncPool.query(`SELECT hashed_pass FROM users WHERE name = '${name}'`);
    const hashedPass = rawUserPassData[0][0].hashed_pass;
    const passMatches = yield bcryptjs_1.default.compare(pass, hashedPass);
    if (!passMatches) {
        res.status(401);
        throw new Error('Incorrect password: not authorized');
    }
    //  return user data
    const rawUserData = yield asyncPool.query(`SELECT * FROM users WHERE name = '${name}';`);
    const _b = rawUserData[0][0], { user_id, hashed_pass } = _b, userData = __rest(_b, ["user_id", "hashed_pass"]);
    const token = generateToken(user_id);
    res.status(200).json(Object.assign(Object.assign({}, userData), { token }));
}));
exports.getUserScore = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name) {
        res.status(400);
        throw new Error('Name not supplied');
    }
    //	check if user exists
    const userExists = yield asyncPool.query(`SELECT EXISTS (SELECT name FROM users WHERE name = \'${name}\');`);
    //  abort if user does not exist
    if (!Object.values(userExists[0][0])[0]) {
        res.status(400);
        throw new Error('user does not exist');
    }
    //  return user data
    const rawScoreData = yield asyncPool.query(`SELECT total_score FROM users WHERE name = '${name}';`);
    const { total_score } = rawScoreData[0][0];
    res.status(200).json(total_score);
}));
exports.getWinsByUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //	might use these at some point...
    //	const { page } = req.params
    //	const start = page ? (+page - 1) * 10 : 0
    const sql = `SET @row_num = 0; SELECT @row_num := @row_num + 1 AS row_num, name, total_score, games_played FROM (SELECT name, SUM(score) as total_score, COUNT(*) as games_played FROM wins GROUP BY name ORDER BY total_score DESC) q1;`;
    const rawWinData = yield asyncPool.query(sql);
    const winData = rawWinData[0][1];
    res.status(200).json(winData);
}));
function generateToken(id) {
    if (!process.env.JWT_SECRET) {
        throw new Error('Could not access JWT secret');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}
