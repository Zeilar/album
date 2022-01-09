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
    },
    API_KEY: {
        format: String,
        env: "API_KEY",
        default: "",
    },
    AUTH_DOMAIN: {
        format: String,
        env: "AUTH_DOMAIN",
        default: "",
    },
    PROJECT_ID: {
        format: String,
        env: "PROJECT_ID",
        default: "",
    },
    STORAGE_BUCKET: {
        format: String,
        env: "STORAGE_BUCKET",
        default: "",
    },
    MESSAGING_SENDER_ID: {
        format: String,
        env: "MESSAGING_SENDER_ID",
        default: "",
    },
    APP_ID: {
        format: String,
        env: "APP_ID",
        default: "",
    },
});

export const NODE_ENV = env.get("NODE_ENV");
env.loadFile(join(__dirname, `./env/${NODE_ENV}.json`)).validate({
    allowed: "strict",
});
