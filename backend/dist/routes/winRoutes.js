"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const winsController_1 = require("../controllers/winsController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.route('/').get(winsController_1.getWins).post(authMiddleware_1.default, winsController_1.addWin);
router.route('/pages').get(winsController_1.getWinsPages);
exports.default = router;
