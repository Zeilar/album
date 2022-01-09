import { app } from "./app";
import { AuthController } from "./controllers/auth";

const BASE_URL = "/api/v1";

app.post(`${BASE_URL}/auth/register`, AuthController.register);
