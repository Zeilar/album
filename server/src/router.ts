import { Router } from "express";
import multer from "multer";
import { AlbumController } from "./controllers/album";
import { AuthController } from "./controllers/auth";
import { authenticated } from "./middlewares/authenticated";

const upload = multer({ dest: "./data", storage: multer.memoryStorage() });

export const router = Router();

// Auth
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/logout", AuthController.logout);
router.get("/auth/whoami", authenticated, AuthController.whoami);

// Album
router.get("/albums/rated", authenticated, AlbumController.getRated);
router.get("/albums/:id", AlbumController.getById);
router.post(
    "/albums",
    authenticated,
    upload.array("photos"),
    AlbumController.create
);
router.put(
    "/albums/:id",
    authenticated,
    upload.array("photos"),
    AlbumController.updateAlbum
);
router.post("/albums/:id/rate", AlbumController.rateAlbum);
