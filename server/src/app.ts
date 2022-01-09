import express from "express";
import { env } from "../config/env";

const PORT = env.get("PORT");
const app = express();

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
