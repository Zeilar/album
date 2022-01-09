import "../config/firebase";
import express from "express";
import { env } from "../config/env";

const PORT = env.get("PORT");
export const app = express();
app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

import "./routes";
