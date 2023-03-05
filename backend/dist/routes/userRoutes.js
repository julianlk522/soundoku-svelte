"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.route('/').get(usersController_1.getUsers).post(usersController_1.addUser);
router.route('/login').post(usersController_1.loginUser);
router.route('/scores').get(usersController_1.getWinsByUser);
router.route('/:name').get(authMiddleware_1.default, usersController_1.getUserScore);
exports.default = router;
