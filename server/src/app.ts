import "../config/firebase";
import express, { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import session from "express-session";
import { router } from "./router";
import { join } from "path";

const PORT = env.get("PORT");
const clientPath = join(
    __dirname,
    `../../client/${env.get("NODE_ENV") === "production" ? "build" : "public"}`
);
export const app = express();

app.use(express.json());
app.use(
    session({
        secret: env.get("SESSION_SECRET"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            secure: false,
        },
    })
);
app.use("/api/v1", router);
app.use(express.static(clientPath));
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(500).send("Something went wrong!");
});

app.get("/*", (req, res) => {
    res.sendFile(join(`${clientPath}/index.html`));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
