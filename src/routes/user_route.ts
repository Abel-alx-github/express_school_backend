import express, { Request, Response } from 'express';
import { user_controller } from '../controllers/user_controller';

export const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
	await user_controller.create_user(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
    await user_controller.login(req, res);
});

router.get("/get_all_users", async (req: Request, res: Response) => {
    await user_controller.get_all_users(req, res);
});

router.get("/get_user_by_id/:id", async (req: Request, res: Response) => {
    await user_controller.get_user_by_id(req, res);
});

router.post('/update_user/:id', async(req:Request, res:Response) => {
    await user_controller.update_user(req, res);
});

router.delete('/delete_user/:id', async(req:Request, res:Response) => {
    await user_controller.delete_user(req, res);
});



