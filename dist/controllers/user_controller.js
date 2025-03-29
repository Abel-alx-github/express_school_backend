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
exports.user_controller = void 0;
const user_model_1 = require("../models/user_model");
const user_validator_1 = require("../validators/user_validator");
const custom_errors_1 = require("../errors/custom_errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// create user
exports.user_controller = {
    create_user: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = __rest(req.body, []);
            // validate request based on type
            const validation_result = user_validator_1.user_validator.strict().partial().safeParse(user);
            if (validation_result.success === false) {
                return res.status(400).json({ message: "validation error", error: validation_result.error.errors });
            }
            const user_data = yield user_model_1.User_Model.create(validation_result === null || validation_result === void 0 ? void 0 : validation_result.data);
            console.log(user_data);
            return res.status(201).json({ message: "User created successfully", data: user_data });
        }
        catch (error) {
            console.error("Database error: ", error);
            if (error instanceof custom_errors_1.DatabaseError) {
                return res.status(500).json({ message: error.message });
            }
            if (error.message === "Phone number already exists") {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error." });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validation_result = user_validator_1.user_validator.strict().partial().safeParse(req.body);
            if (!validation_result.success) {
                return res.status(400).json({ message: "validation error" });
            }
            const { phone_number, password } = validation_result.data;
            const user = yield user_model_1.User_Model.login({ phone_number, password });
            const token = jsonwebtoken_1.default.sign({ id: user.id, phone_number: user.phone_number }, process.env.JWT_SECRET, { expiresIn: "1h" });
            // set cookie
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
            return res.status(200).json({ message: "Login successful", data: user });
        }
        catch (err) {
            if (err instanceof custom_errors_1.NotFoundError) {
                return res.status(404).json({ message: err.message });
            }
            else if (err instanceof custom_errors_1.DatabaseError) {
                return res.status(500).json({ message: err.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }),
    get_all_users: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const roll = req.query.roll;
            const status = req.query.status;
            const users = yield user_model_1.User_Model.get_all({ roll, status });
            console.log(users, "users");
            return res.status(200).json({ message: "All users fetched successfully", data: users });
        }
        catch (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ message: "Internal server error." });
        }
    }),
    get_user_by_id: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid id" });
            }
            ;
            const user = yield user_model_1.User_Model.get_by_id(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ message: "User fetched by id", data: user });
        }
        catch (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ message: "Internal server error." });
        }
    }),
    update_user: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // validate request based on type
            const validation_result = user_validator_1.user_validator.partial().strict().safeParse(req.body);
            console.log(validation_result, "validation_result at controller");
            if (!validation_result.success) {
                return res.status(400).json({ message: "validation error at controller" });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid id" });
            }
            ;
            const user = __rest(validation_result.data, []);
            const updated_user = yield user_model_1.User_Model.update(id, user);
            return res.status(200).json({ message: "User updated successfully", data: updated_user });
        }
        catch (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ message: err.message });
        }
    }),
    delete_user: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid id" });
            }
            const user = yield user_model_1.User_Model.delete(id);
            return res.status(200).json({ message: "User deleted successfully", data: user });
        }
        catch (err) {
            console.error("Database error: ", err);
            if (err instanceof custom_errors_1.NotFoundError) {
                return res.status(404).json({ message: err.message });
            }
            else if (err instanceof custom_errors_1.DatabaseError) {
                return res.status(500).json({ message: err.message });
            }
            return res.status(500).json({ message: "Internal server error." });
        }
    })
};
