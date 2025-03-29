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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user_controller");
exports.router = express_1.default.Router();
exports.router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_controller_1.user_controller.create_user(req, res);
}));
exports.router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_controller_1.user_controller.login(req, res);
}));
exports.router.get("/get_all_users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_controller_1.user_controller.get_all_users(req, res);
}));
exports.router.get("/get_user_by_id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_controller_1.user_controller.get_user_by_id(req, res);
}));
exports.router.post('/update_user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_controller_1.user_controller.update_user(req, res);
}));
exports.router.delete('/delete_user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_controller_1.user_controller.delete_user(req, res);
}));
