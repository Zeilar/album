import { NextFunction, Request, Response } from "express";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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
                owner: req.session.userId,
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

    public static async getRated(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const q = query(
            collection(db, "albums"),
            where("rated", "==", true),
            where("owner", "==", req.session.userId)
        );
        try {
            const albums = await getDocs(q);
            res.json(albums.docs.map((doc) => doc.data()));
        } catch (error) {
            next(error);
        }
    }

    public static async get() {
        //
    }
}
