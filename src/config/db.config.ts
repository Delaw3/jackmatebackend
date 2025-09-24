import mongoose from "mongoose";
import { config } from "./config";
import { customError } from "../utils/response";

let cachedDb: typeof mongoose | null = null;
const dbString = config.mongoUri

export const dbConnect = async () => {
  if (cachedDb) return cachedDb;

  if (!dbString) throw new customError("DB_STRING not set", 404);

  const connect = await mongoose.connect(dbString, {
    serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
    bufferCommands: false, // disables indefinite buffering
    maxPoolSize: 5, // reuse connections
  });

  cachedDb = connect;
  console.log("Connected to DB:", connect.connection.name);
  return connect;
};

export default dbConnect;
