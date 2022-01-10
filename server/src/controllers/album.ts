import { NextFunction, Request, Response } from "express";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";

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
                photos: photos.map((photo) => ({ ref: photo.metadata.name })),
                title: req.body.title,
                rated: false,
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
