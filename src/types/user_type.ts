

// define user type
export enum Role {
  Student = "student",
  Teacher = "teacher",
  Admin = "admin"
}

export type TUser = {
  // id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  role: Role; // User role
  
  email?: string;
  date_of_birth?: Date; // Optional date of birth
  enrollment_date?: Date; // Optional enrollment date for students
  grade_level?: number; // Optional grade level for students
  subjects?: string[]; // Optional subjects for students
  address?: string; // Optional address
  profile_picture?: string; // Optional profile picture URL
  status?: "active" | "inactive"; // Optional status
};
