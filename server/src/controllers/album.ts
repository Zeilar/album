import { NextFunction, Request, Response } from "express";
import { addDoc, collection } from "firebase/firestore";
import { rm } from "fs/promises";
import { join } from "path";
import { db } from "../../config/firebase";

const uploadPath = join(__dirname, "../../data");

export class AlbumController {
    public static async create(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!Array.isArray(req.files)) {
                throw new Error("Files must be an array.");
            }
            if (!req.body.title) {
                return res.sendStatus(400);
            }
            await Promise.all(
                req.files.map((file: Express.Multer.File) =>
                    rm(join(`${uploadPath}/${file.filename}`))
                )
            );
            await addDoc(collection(db, "albums"), {
                photos: req.files,
                title: req.body.title,
            });
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}
