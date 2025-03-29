"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.products_route = void 0;
const express_1 = __importDefault(require("express"));
exports.products_route = express_1.default.Router();
exports.products_route.get("/", (req, res) => {
    res.status(200).json({ message: "express is really express" });
});
