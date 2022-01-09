import { Request, Response } from "express";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

export class AuthController {
    public static async register(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            req.session.userId = user.uid;
            await addDoc(collection(db, "users"), { uid: user.uid });
        } catch (error) {
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    }

    public static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            return res.sendStatus(401);
        }
        res.sendStatus(200);
    }

    public static logout(req: Request, res: Response) {
        req.session.userId = null;
        res.sendStatus(200);
    }
}
