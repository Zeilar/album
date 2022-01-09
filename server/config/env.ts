import convict from "convict";
import { join } from "path";

export const env = convict({
    NODE_ENV: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV",
    },
    PORT: {
        doc: "The port to bind.",
        format: "port",
        default: 4000,
        env: "PORT",
        arg: "port",
    },
});

export const NODE_ENV = env.get("NODE_ENV");
env.loadFile(join(__dirname, `./env/${NODE_ENV}.json`)).validate({
    allowed: "strict",
});
