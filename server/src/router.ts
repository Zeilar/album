import { Router } from "express";
import multer from "multer";
import { AlbumController } from "./controllers/album";
import { AuthController } from "./controllers/auth";
import { authenticated } from "./middlewares/authenticated";

const upload = multer({ dest: "./data" });

export const router = Router();

// Auth
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/logout", AuthController.logout);
router.get("/auth/whoami", authenticated, AuthController.whoami);

// Album
router.post("/album", upload.array("photos", 10), AlbumController.create);