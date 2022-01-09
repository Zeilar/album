import "../config/firebase";
import express from "express";
import { env } from "../config/env";
import session from "express-session";
import { router } from "./routes";

const PORT = env.get("PORT");
export const app = express();

app.use(express.json());
app.use(
    session({
        secret: env.get("SESSION_SECRET"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false,
        },
    })
);
app.use("/api/v1", router);

// app.use(express.static(path.join(__dirname, 'ui')));

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'ui/index.html'));
// });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
