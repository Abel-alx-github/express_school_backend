"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_validator = void 0;
const zod_1 = require("zod");
const date_transformer = zod_1.z.string().transform(str => new Date(str));
// user validation schema
exports.user_validator = zod_1.z.object({
    first_name: zod_1.z.string().min(2).max(255),
    last_name: zod_1.z.string().min(2).max(255),
    phone_number: zod_1.z.string().min(10).max(13),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).max(255),
    role: zod_1.z.enum(["student", "teacher", "admin"]),
    date_of_birth: date_transformer.optional(),
    enrollment_date: date_transformer.optional(),
    grade_level: zod_1.z.number().optional(),
    subjects: zod_1.z.array(zod_1.z.string()).optional(),
    address: zod_1.z.string().optional(),
    profile_picture: zod_1.z.string().optional(),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
    // created_at: date_transformer,
    // updated_at: date_transformer
});
