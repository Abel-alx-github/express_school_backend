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
exports.User_Model = void 0;
const db_1 = __importDefault(require("../config/db"));
// import { format_date } from '../utils/helper';
const user_validator_1 = require("../validators/user_validator");
const custom_errors_1 = require("../errors/custom_errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
class User_Model {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // validate data
                const validation_result = user_validator_1.user_validator.partial().strict().safeParse(data);
                if (validation_result.success === false) {
                    throw new Error("Validation error");
                }
                // let check if the phone number already exists
                const [rows] = yield db_1.default.execute(`SELECT * From Users Where phone_number = ?`, [validation_result.data.phone_number]);
                if (rows.length > 0) {
                    throw new Error("Phone number already exists");
                }
                let hashed_password = "";
                if (validation_result.data.password) {
                    hashed_password = yield bcryptjs_1.default.hash(validation_result.data.password, 10);
                    validation_result.data.password = hashed_password;
                }
                //create dynamic query
                const keys = Object.keys(validation_result.data);
                const values = Object.values(validation_result.data);
                const placeholders = keys.map(() => {
                    return "?";
                }).join(", ");
                const sql = `INSERT INTO users (${keys}) VALUES (${placeholders})`;
                const [result] = yield db_1.default.execute(sql, values);
                return { id: result.insertId };
            }
            catch (err) {
                console.log(err, "Error creating user in the database");
                if (err.message === "Phone number already exists") {
                    throw new Error("Phone number already exists");
                }
                throw new Error("Error creating user in the database");
            }
        });
    }
    static login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ phone_number, password }) {
            try {
                // validate data
                const parsed_data = user_validator_1.user_validator.partial().strict().safeParse({ phone_number, password });
                if (parsed_data.success === false) {
                    throw new Error("Validation error");
                }
                // check if user exists
                const [rows] = yield db_1.default.execute(`SELECT * FROM users WHERE phone_number = ?`, [phone_number]);
                if (rows.length === 0) {
                    throw new custom_errors_1.NotFoundError("User not found");
                }
                const user = rows[0];
                console.log(user, "user is found");
                const is_valid = yield bcryptjs_1.default.compare(password, user.password);
                if (!is_valid) {
                    throw new Error("Invalid Credentials");
                }
                delete user.password;
                console.log(user, zod_1.isValid, "user is found");
                return user;
            }
            catch (err) {
                if (err instanceof custom_errors_1.NotFoundError) {
                    throw err;
                }
                console.log(err, "Error logging in user in the database");
                throw new Error("Error logging in user in the database");
            }
        });
    }
    static get_all(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roll = params === null || params === void 0 ? void 0 : params.roll;
                const status = params === null || params === void 0 ? void 0 : params.status;
                let keys = [];
                let values = [];
                if (roll) {
                    keys.push(`role = ?`);
                    values.push(roll);
                }
                if (status) {
                    keys.push(`status = ?`);
                    values.push(status);
                }
                let sql = `SELECT * FROM users`;
                if (keys.length > 0) {
                    sql += ` WHERE ${keys.join(" AND ")}`;
                }
                const [rows] = yield db_1.default.execute(sql, values);
                const users = rows.map((row) => {
                    return Object.assign(Object.assign({}, row), { subjects: JSON.parse(row.subjects) });
                });
                return users;
            }
            catch (err) {
                console.log(err, "Error fetching users from the database");
                throw new Error("Error fetching users from the database");
            }
        });
    }
    static get_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT * FROM users WHERE id = ?`;
                const [rows] = yield db_1.default.execute(sql, [id]);
                console.log(rows[0], "rows user by id");
                return rows[0];
            }
            catch (err) {
                console.log(err, "Error fetching user from the database");
                throw new Error("Error fetching user from the database");
            }
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // validate data
                const parsed_data = user_validator_1.user_validator.partial().strict().safeParse(data);
                if (parsed_data.success === false) {
                    throw new Error("Validation error at update db");
                }
                console.log(parsed_data.data, "parsed data");
                // dymamic update query
                const keys = Object.keys(parsed_data.data);
                const values = Object.values(parsed_data.data);
                const update_query = keys.map((key) => {
                    return `${key} = ?`;
                }).join(", ");
                values.push(id);
                const sql = `UPDATE users SET ${update_query} WHERE id = ?`;
                const [rows] = yield db_1.default.execute(sql, values);
                if (rows.affectedRows === 0) {
                    throw new Error("User not found");
                }
                console.log(rows, "rows updated");
                const [user] = yield db_1.default.execute(`SELECT * FROM users WHERE id = ?`, [id]);
                return user[0];
            }
            catch (err) {
                console.log(err, "Error updating user in the database");
                throw new Error(err.message);
            }
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `DELETE FROM users WHERE id = ?`;
                const [row] = yield db_1.default.execute(sql, [id]);
                if (row.affectedRows === 0) {
                    throw new custom_errors_1.NotFoundError("User not found");
                }
                return row;
            }
            catch (err) {
                if (err instanceof custom_errors_1.NotFoundError) {
                    throw err;
                }
                console.log(err, "Error deleting user from the database");
                throw new custom_errors_1.DatabaseError("Error deleting user from the database");
            }
        });
    }
}
exports.User_Model = User_Model;
