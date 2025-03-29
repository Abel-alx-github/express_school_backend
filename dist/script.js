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
exports.create_users_table = create_users_table;
// to write sql queries
const db_1 = __importDefault(require("../src/config/db"));
//how to set enum for role
// crate users table
function create_users_table() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role ENUM('student','teacher','admin') NOT NULL,
    date_of_birth DATE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade_level VARCHAR(255),
    subjects TEXT,
    address TEXT,
    profile_picture TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    )   `;
        try {
            const [rows] = yield db_1.default.execute(sql);
            console.log("User table created");
        }
        catch (error) {
            console.log(error, "Error creating user table");
            throw new Error("Error creating user table");
        }
    });
}
