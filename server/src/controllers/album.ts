import { NextFunction, Request, Response } from "express";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { rm } from "fs/promises";
import { join } from "path";
import { db, storage } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";

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
            const photos = await Promise.all(
                req.files.map((file) => {
                    const buffer = Buffer.from(file.buffer);
                    const arrayBuffer = Uint8Array.from(buffer).buffer;
                    return uploadBytes(
                        ref(storage, `/photos/${uuidv4()}`),
                        arrayBuffer
                    );
                })
            );
            await addDoc(collection(db, "albums"), {
                photos: photos.map((photo) => ({
                    ref: photo.metadata.name,
                    approved: false,
                })),
                title: req.body.title,
            });
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    public static async addPhotos(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { id } = req.params;
        console.log(id);
        res.sendStatus(200);
    }
}
