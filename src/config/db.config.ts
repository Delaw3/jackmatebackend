import mongoose from "mongoose";

let cachedDb: typeof mongoose | null = null;

export const dbConnect = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;

  if (!process.env.DB_STRING) throw new Error("DB_STRING not set");

  try {
    const connect = await mongoose.connect(process.env.DB_STRING, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
      maxPoolSize: 5,
    });

    cachedDb = connect;
    console.log("Connected to DB:", connect.connection.name);
    return connect;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    cachedDb = null; // reset cache on failure
    throw error;
  }
};

