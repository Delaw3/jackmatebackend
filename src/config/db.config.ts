import mongoose from "mongoose";

let isConnected = false; 

export const dbConnect = async () => {
  if (isConnected) {
    return; 
  }

  try {
    const db = await mongoose.connect(process.env.DB_STRING!);
    isConnected = true;

    console.log("Connected to DB:", db.connection.name);
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw error; // don’t exit, let Vercel handle gracefully
  }
};
