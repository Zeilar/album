import { Request, Response } from "express";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

export class AuthController {
    public static async whoami(req: Request, res: Response) {
        const q = query(
            collection(db, "users"),
            where("uid", "==", req.session.userId)
        );
        const users = await getDocs(q);
        res.json(users.docs[0].data());
    }

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
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                email: user.email,
            });
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
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            req.session.userId = user.uid;
        } catch (error) {
            console.error(error);
            return res.sendStatus(401);
        }
        res.sendStatus(200);
    }

    public static logout(req: Request, res: Response) {
        req.session.userId = null;
        res.sendStatus(200);
    }
}
