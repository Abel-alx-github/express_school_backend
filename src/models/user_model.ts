import db from '../config/db'
import {TUser} from '../types/user_type'
// import { format_date } from '../utils/helper';
import { user_validator } from '../validators/user_validator'
import { DatabaseError, NotFoundError } from '../errors/custom_errors';
import bcrypt from 'bcryptjs';
import { isValid } from 'zod';

export class User_Model {

    static async create(data:TUser) {
        try{
            // validate data
            const validation_result = user_validator.partial().strict().safeParse(data as TUser);
            if(validation_result.success === false){
                throw new Error("Validation error")
            }
            // let check if the phone number already exists
            const [rows]: any = await db.execute(`SELECT * From Users Where phone_number = ?`, [validation_result.data.phone_number])
            if(rows.length > 0){
                throw new Error("Phone number already exists")
            }
            let hashed_password = "";
            if(validation_result.data.password){
                hashed_password = await bcrypt.hash(validation_result.data.password, 10);
                validation_result.data.password = hashed_password;
            }
            //create dynamic query
            const keys = Object.keys(validation_result.data);
            const values = Object.values(validation_result.data);
            const placeholders = keys.map(() => {
                return "?"
            }).join(", ");


            const sql = `INSERT INTO users (${keys}) VALUES (${placeholders})`;
            
            const [result]: any = await db.execute(sql, values);
            return {id: result.insertId}
        }catch(err){
            console.log(err, "Error creating user in the database")
            if((err as Error).message === "Phone number already exists"){
                throw new Error("Phone number already exists")
            }

            throw new Error("Error creating user in the database")
        }
    }

    static async login({phone_number, password}: {phone_number:string, password:string}) {
        try{
            // validate data
            const parsed_data = user_validator.partial().strict().safeParse({phone_number, password});
            if(parsed_data.success === false){
                throw new Error("Validation error")
            }
            // check if user exists
            const [rows] : any = await db.execute(`SELECT * FROM users WHERE phone_number = ?`, [phone_number])
            if(rows.length === 0){
                throw new NotFoundError("User not found")
            }
            const user = rows[0];
            console.log(user, "user is found")
            const is_valid = await bcrypt.compare(password, user.password);
            if(!is_valid){
                throw new Error("Invalid Credentials")
            }
            delete user.password

            console.log(user, isValid, "user is found")
            return user
        }catch(err){
            if(err instanceof NotFoundError){
                throw err
            }
            console.log(err, "Error logging in user in the database")
            throw new Error("Error logging in user in the database")
        }
    }
    static async get_all(params?:any) {
        try{
            const roll = params?.roll;
            const status = params?.status;
            let keys = [];
            let values = [];
            if(roll){
                keys.push(`role = ?`)
                values.push(roll)
            }
            if(status){
                keys.push(`status = ?`)
                values.push(status)
            }
            let sql = `SELECT * FROM users`;
            
            if(keys.length > 0){
                sql += ` WHERE ${keys.join(" AND ")}`
            }

            const [rows] = await db.execute(sql, values)
            const users = (rows as any[]).map((row: any) => {
                return {
                    ...row,
                    subjects:JSON.parse(row.subjects)
                }
            })
            return users;
        }catch(err){
            console.log(err, "Error fetching users from the database")
            throw new Error("Error fetching users from the database")
        }
    }

    static async get_by_id (id:number) {
        try{
            const sql = `SELECT * FROM users WHERE id = ?`;
            const [rows] : [any[], any] = await db.execute(sql, [id])
            console.log(rows[0], "rows user by id")
            return rows[0]
        }catch(err){
            console.log(err, "Error fetching user from the database")
            throw new Error("Error fetching user from the database")
        }
    }


    static async update (id:number, data: Partial<TUser>) {
        try{
            // validate data
            const parsed_data = user_validator.partial().strict().safeParse(data);
            if(parsed_data.success === false){
                throw new Error("Validation error at update db")
            }
            console.log(parsed_data.data, "parsed data")
            // dymamic update query
            const keys = Object.keys(parsed_data.data);
            const values = Object.values(parsed_data.data);
            const update_query = keys.map((key) => {
                return `${key} = ?`
            }).join(", ");

            values.push(id);
            const sql = `UPDATE users SET ${update_query} WHERE id = ?`;

            
            const [rows] : any = await db.execute(sql, values);
            if(rows.affectedRows === 0){
                throw new Error("User not found")
            }
            console.log(rows, "rows updated")
            const [user]: [any[], any] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id])
            return user[0]
        }catch(err){
            console.log(err, "Error updating user in the database")
            throw new Error((err as Error).message)
        }
    }


    static async delete (id:number) {
        try{
            const sql = `DELETE FROM users WHERE id = ?`
            const [row] : any = await db.execute(sql, [id])
            if(row.affectedRows === 0){
                throw new NotFoundError("User not found")
            }
            return row
        }catch(err){
            if(err instanceof NotFoundError){
                throw err
            }
            console.log(err, "Error deleting user from the database")
            throw new DatabaseError("Error deleting user from the database")
        }
    }
}