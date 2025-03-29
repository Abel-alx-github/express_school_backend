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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); // Fixed casing
const db_1 = __importDefault(require("./config/db"));
const user_route_1 = require("./routes/user_route");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000; // Use environment variable for port
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/users", user_route_1.router);
// app.use("/api/products", productsRoute);
app.get('/', (req, res) => {
    res.send("Hello World ");
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield db_1.default.getConnection();
        console.log("Connected to the database");
        // await db.execute("DROP TABLE users");
        // await create_users_table();
        connection.release();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Database connection failed:", err);
    }
});
startServer();
// Graceful shutdown
process.on('SIGINT', () => {
    console.log("Shutting down gracefully...");
    process.exit();
});
