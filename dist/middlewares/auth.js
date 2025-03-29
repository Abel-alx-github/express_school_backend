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
exports.auth_user = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        console.log(req.cookies, "cookies in middleware");
        console.log(token, "token in middleware");
        if (!token) {
            res.status(401).json({ message: "Access denied" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: "Access denied" });
            return;
        }
        console.log(decoded, "decoded");
        //    req.user = decoded;
        next();
    }
    catch (err) {
        console.error(err, "Error verifying token");
        res.status(401).json({ message: "Access denied in catch" });
        return;
    }
});
exports.auth_user = auth_user;
