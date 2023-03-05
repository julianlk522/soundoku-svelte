"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const config_1 = require("./config");
//  mySQL connection
const pool = mysql2_1.default.createPool({
    host: config_1.host,
    user: config_1.user,
    password: config_1.password,
    database: config_1.database,
    port: config_1.port,
    multipleStatements: true,
});
exports.default = pool;
