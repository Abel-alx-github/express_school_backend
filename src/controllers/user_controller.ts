import { TUser } from "../types/user_type.js";
import { Request, Response } from 'express';
import { User_Model} from '../models/user_model'
import { user_validator } from "../validators/user_validator";
import { DatabaseError, NotFoundError } from "../errors/custom_errors";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
// create user
export const user_controller = {
    create_user: async (req: Request, res: Response) => {
        try{
        const {...user} = req.body as TUser;
        // validate request based on type
         const validation_result = user_validator.strict().partial().safeParse(user as TUser);
         if(validation_result.success === false){
            return res.status(400).json({message:"validation error", error: validation_result.error.errors})
         }   

        const user_data = await User_Model.create(validation_result?.data as TUser);       
        console.log(user_data);
         return res.status(201).json({ message: "User created successfully", data: user_data });   
       
        } catch (error: any) {
            console.error("Database error: ", error);
            if(error instanceof DatabaseError){
                return res.status(500).json({ message: (error as DatabaseError).message });
            }
            if((error as Error).message === "Phone number already exists"){
                return res.status(400).json({ message: (error as Error).message });
            }
            
            return res.status(500).json({ message: "Internal server error." });
        }
    },

    login : async (req: Request, res: Response) => {
        try{
            const validation_result = user_validator.strict().partial().safeParse(req.body as TUser);
            if(!validation_result.success){
                return res.status(400).json({message:"validation error"})
            }
            const {phone_number, password} = validation_result.data as TUser ;
            
            const user = await User_Model.login({phone_number, password});
            const token = jwt.sign({id: user.id, phone_number: user.phone_number },
                process.env.JWT_SECRET as string, {expiresIn: "1h"});
                // set cookie
                res.cookie("token", token, {httpOnly: true,secure: process.env.NODE_ENV === "production", sameSite: "strict"});
                return res.status(200).json({message: "Login successful", data: user});
        }catch(err){
            if(err instanceof NotFoundError){
                return res.status(404).json({message: (err as NotFoundError).message});
            }else if(err instanceof DatabaseError){
                return res.status(500).json({message: (err as DatabaseError).message});
            }
            return res.status(500).json({message: "Internal server error"});
        }
    },

    get_all_users: async (req: Request, res: Response) => {
        try{
            const roll = req.query.roll as string;
            const status = req.query.status as string;

            const users = await User_Model.get_all({roll, status});
            console.log(users, "users");
            return res.status(200).json({ message: "All users fetched successfully", data: users });
        }catch(err){
            console.error("Database error: ", err);
            return res.status(500).json({ message: "Internal server error." });
        }
    },
   
    get_user_by_id: async (req:Request, res:Response) => {
        try{
            const id = parseInt(req.params.id);
            if(isNaN(id)){
                return res.status(400).json({message:"Invalid id"});
            };

            const user = await User_Model.get_by_id(id);
            if(!user){
                return res.status(404).json({message:"User not found"});
            }
        
            return res.status(200).json({message: "User fetched by id", data:user})

        }catch(err){
            console.error("Database error: ", err);
            return res.status(500).json({ message: "Internal server error." });
        }
    },

    update_user: async(req:Request, res:Response) => {
        try{
            // validate request based on type
            const validation_result = user_validator.partial().strict().safeParse(req.body as TUser);
            console.log(validation_result, "validation_result at controller");
            if(!validation_result.success){
                return res.status(400).json({message:"validation error at controller"})
            }

            const id = parseInt(req.params.id);
            if(isNaN(id)){
                return res.status(400).json({message:"Invalid id"});
            };

            const {...user} = validation_result.data as TUser;
            const updated_user = await User_Model.update(id, user);
            return res.status(200).json({message: "User updated successfully", data: updated_user});

        }catch(err){
            console.error("Database error: ", err);
            return res.status(500).json({ message: (err as Error).message });
    }
    },

    delete_user: async(req:Request, res:Response) => {
    try{
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({message:"Invalid id"});
        }
        const user = await User_Model.delete(id);
        return res.status(200).json({message: "User deleted successfully", data: user});
    }catch(err){
        console.error("Database error: ", err);
        if(err instanceof NotFoundError){
            return res.status(404).json({ message: (err as NotFoundError).message });
        }else if(err instanceof DatabaseError){
            return res.status(500).json({ message: (err as DatabaseError).message });
            }
        return res.status(500).json({ message: "Internal server error." });
}
    }

}
