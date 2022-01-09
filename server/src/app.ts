import "../config/firebase";
import express from "express";
import { env } from "../config/env";
import session from "express-session";

const PORT = env.get("PORT");
export const app = express();
app.use(express.json()),
    session({
        secret: env.get("SESSION_SECRET"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false,
        },
    });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

import "./routes";
