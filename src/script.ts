// to write sql queries
import db from '../src/config/db'

//how to set enum for role

// crate users table
export async function create_users_table() {
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
    const [rows] = await db.execute(sql)
    console.log("User table created")
    } catch (error) {
        console.log(error, "Error creating user table")
        throw new Error("Error creating user table")
    }
}