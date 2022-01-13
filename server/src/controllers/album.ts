import { NextFunction, Request, Response } from "express";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    UploadResult,
} from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";

export class AlbumController {
    private static async uploadPhotos(photos: Express.Multer.File[]) {
        return await Promise.all(
            photos.map(file => {
                const buffer = Buffer.from(file.buffer);
                const arrayBuffer = Uint8Array.from(buffer).buffer;
                return uploadBytes(
                    ref(storage, `/photos/${uuidv4()}`),
                    arrayBuffer
                );
            })
        );
    }

    private static async getPhotoUrls(photos: UploadResult[]) {
        return await Promise.all(
            photos.map(photo => getDownloadURL(photo.ref))
        );
    }

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
            const photos = await AlbumController.uploadPhotos(req.files);
            const photoUrls = await AlbumController.getPhotoUrls(photos);
            const { id } = await addDoc(collection(db, "albums"), {
                photos: photoUrls,
                title: req.body.title,
                rated: false,
                owner: req.session.userId,
            });
            res.json({ id });
        } catch (error) {
            next(error);
        }
    }

    public static async updateAlbum(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!Array.isArray(req.files)) {
                throw new Error("Files must be an array.");
            }
            const data: any = {};
            if (req.files) {
                const uploaded = await AlbumController.uploadPhotos(req.files);
                data.photos = await AlbumController.getPhotoUrls(uploaded);
            }
            if (req.params.id) {
                data.title = req.body.title;
            }
            await updateDoc(doc(db, "albums", req.params.id), data);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    public static async get(req: Request, res: Response, next: NextFunction) {
        const q = query(
            collection(db, "albums"),
            where("owner", "==", req.session.userId)
        );
        try {
            const albums = await getDocs(q);
            res.json(
                albums.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }))
            );
        } catch (error) {
            next(error);
        }
    }

    public static async getById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const album = await getDoc(doc(db, "albums", req.params.id));
        if (!album.exists()) {
            return res.sendStatus(404);
        }
        res.json(album.data());
    }

    public static async rateAlbum(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const album = await getDoc(doc(db, "albums", req.params.id));
            if (!album.exists()) {
                return res.sendStatus(404);
            }
            const data = album.data();
            const { id } = await addDoc(collection(db, "albums"), {
                owner: data.owner,
                title: `${data.title} - Rated`,
                photos: req.body.photos,
                rated: true,
            });
            res.json({ id });
        } catch (error) {
            next(error);
        }
    }
}
