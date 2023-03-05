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
exports.addWin = exports.getWins = exports.getWinsPages = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = require("crypto");
const getWinScore_1 = require("./util/getWinScore");
const types_1 = require("./types");
const asyncPool = db_1.default.promise();
exports.getWinsPages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const numPagesSql = `SELECT CEIL(COUNT(*) / 10) AS pages FROM wins;`;
    const rawPagesData = yield asyncPool.query(numPagesSql);
    const pagesData = rawPagesData[0][0];
    const { pages } = pagesData;
    if (!pagesData || !pages) {
        res.status(500);
        throw new Error('Messed up while querying for total pages');
    }
    res.status(200).json(pagesData.pages);
}));
exports.getWins = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    const start = page ? (+page - 1) * 10 : 0;
    const sql = `SET @row_num = 0; SELECT *FROM (SELECT q2.row_count + 1 - @row_num := @row_num + 1 AS row_num, name, date, difficulty, duration,errors, score FROM (SELECT row_count, name, date, difficulty, duration, errors, score FROM wins JOIN (SELECT COUNT(*) AS row_count FROM wins) q1) q2 ORDER BY score ASC, errors DESC, difficulty DESC, duration DESC) q3 ORDER BY row_num ASC LIMIT ${start ? start + ', ' : ''}10;`;
    const rawWinData = yield asyncPool.query(sql);
    const winData = rawWinData[0][1];
    if (!winData.length) {
        res.status(404);
        throw new Error('Exceeded database boundary');
    }
    res.status(200).json({ scores: winData });
}));
exports.addWin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, difficulty, duration, errors, hash: clientHash } = req.body;
    if (!name ||
        !difficulty ||
        !duration ||
        errors === undefined ||
        !clientHash) {
        res.status(400);
        throw new Error('Not all fields provided');
    }
    if (!types_1.difficultyLevels.includes(difficulty)) {
        res.status(400);
        throw new Error('Invalid difficulty level supplied');
    }
    if (!process.env.WIN_SECRET) {
        throw new Error('Could not access hash secret');
    }
    const unserializedWin = { name, difficulty, duration, errors };
    const serializedWin = JSON.stringify(unserializedWin);
    const serverHash = (0, crypto_1.createHmac)('sha256', process.env.WIN_SECRET)
        .update(serializedWin)
        .digest('base64');
    if (serverHash !== clientHash) {
        res.status(401);
        throw new Error('Failed hash check');
    }
    const score = (0, getWinScore_1.getWinScore)(difficulty, duration, errors);
    const insertWinData = `INSERT INTO wins (name, difficulty, duration, errors, score) VALUES ('${name}', '${difficulty}', '${duration}', '${errors}', '${score}');`;
    const updateTotalScore = `UPDATE users SET total_score = total_score + ${score} WHERE name = '${name}'`;
    try {
        yield asyncPool.query(insertWinData);
        yield asyncPool.query(updateTotalScore);
    }
    catch (_a) {
        res.status(400);
        throw new Error('Could not insert data. Supplied name probably is not a real user');
    }
    res.status(201).json({ name, difficulty, duration, errors, score });
}));
