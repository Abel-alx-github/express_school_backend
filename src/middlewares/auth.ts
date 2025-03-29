import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";



export const auth_user = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try{
       const token = req.cookies?.token;
       console.log(req.cookies, "cookies in middleware")
       console.log(token, "token in middleware")
       if(!token){
        res.status(401).json({message: "Access denied"});
        return;
    }
       const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
       if(!decoded){
        res.status(401).json({message: "Access denied"});
        return;
    }
       console.log(decoded, "decoded");
    //    req.user = decoded;
         next(); 
    }catch(err){
        console.error(err, "Error verifying token");
        res.status(401).json({message: "Access denied in catch"});
        return;
    }
}