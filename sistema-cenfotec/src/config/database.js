import mongoose from "mongoose";

let connectionPromise;

export const connectDB = async () => {
    const mongoUri = import.meta.env?.MONGODB_URI ?? process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("Falta configurar MONGODB_URI en el archivo .env");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    try {
        connectionPromise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        await connectionPromise;

        console.log("MongoDB conectado");
        return mongoose.connection;
    } catch (error) {
        connectionPromise = undefined;
        console.error("Error conectando MongoDB", error);
        throw error;
    }
};
