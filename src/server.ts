import express, { Request, Response, NextFunction,} from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"; // Fixed casing
import db from "./config/db";
import { router as usersRoute } from "./routes/user_route";
// import { productsRoute } from "./routes/products_route";
import { create_users_table } from './script';
import { auth_user } from "./middlewares/auth";

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRoute);
// app.use("/api/products", productsRoute);

app.get('/', (req: Request, res: Response) => {
  res.send("Hello World ");
});

// Error handling middleware
app.use((err:any, req: Request, res: Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const startServer = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to the database");
    // await db.execute("DROP TABLE users");
    // await create_users_table();
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log("Shutting down gracefully...");
  process.exit();
});