import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookie_parser from "cookie-parser";
import db from "./config/db";
import {router as users_route } from "./routes/user_route";
import { products_route } from "./routes/products_route";
import {create_users_table} from './script'
import { auth_user } from "./middlewares/auth";

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(cookie_parser());

app.use("/api/users", users_route);
app.use("/api/products", products_route);

app.get('/', auth_user, (req :Request , res:Response) => {
  res.send("Hello World ");
});

const start_server = async () => {
  try{
    const connection = await db.getConnection();
    console.log("connectd db");
    // await db.execute("DROP TABLE users");
    // await create_users_table();
   connection.release();
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  }catch(err){
    console.error("Database connection failed:", err);
  }
}

start_server();

