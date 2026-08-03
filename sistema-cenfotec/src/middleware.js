import { defineMiddleware } from "astro:middleware";
import { connectDB } from "./config/database.js";

export const onRequest = defineMiddleware(async (_, next) => {
    await connectDB();

    return next();
});
