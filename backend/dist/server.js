"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//	connect to MySQL db
db_1.default.query('SELECT * FROM users LIMIT 1;', (err) => {
    if (err)
        throw err;
    console.log('Queries are working!');
});
//  general middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//  routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
app.use('/users', userRoutes_1.default);
const winRoutes_1 = __importDefault(require("./routes/winRoutes"));
app.use('/wins', winRoutes_1.default);
//	error handling
app.use(errorMiddleware_1.errorHandler);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
