import { Router } from "express";
import { AuthController } from "./controllers/auth";
import { authenticated } from "./middlewares/authenticated";

export const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/logout", AuthController.logout);
router.get("/auth/whoami", authenticated, AuthController.whoami);
