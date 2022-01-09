import { Request, Response } from "express";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export class AuthController {
    public static async register(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        await createUserWithEmailAndPassword(getAuth(), email, password);
        res.sendStatus(200);
    }
}
