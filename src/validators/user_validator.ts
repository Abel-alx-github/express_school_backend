import {z} from "zod";

const date_transformer = z.string().transform(str => new Date(str));

// user validation schema
export const user_validator = z.object({
    first_name: z.string().min(2).max(255),
    last_name: z.string().min(2).max(255),
    phone_number: z.string().min(10).max(13),
    email: z.string().email().optional(),
    password: z.string().min(6).max(255),
    role: z.enum(["student", "teacher", "admin"]),
    date_of_birth: date_transformer.optional(),
    enrollment_date: date_transformer.optional(),
    grade_level: z.number().optional(),
    subjects: z.array(z.string()).optional(),
    address: z.string().optional(),
    profile_picture: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
    // created_at: date_transformer,
    // updated_at: date_transformer
})