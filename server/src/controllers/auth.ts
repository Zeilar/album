import { NextFunction, Request, Response } from "express";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

export class AuthController {
    public static async whoami(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const q = query(
            collection(db, "users"),
            where("uid", "==", req.session.userId)
        );
        try {
            const users = await getDocs(q);
            res.json(users.docs[0].data());
        } catch (error) {
            next(error);
        }
    }

    public static async register(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
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
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
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
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(401);
        }
    }

    public static logout(req: Request, res: Response) {
        req.session.userId = null;
        res.sendStatus(200);
    }
}
