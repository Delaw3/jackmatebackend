import { createApp } from "../src/app";
import serverless from "serverless-http";
import { dbConnect } from "../src/config/db.config";

// Prevent double parsing
const app = createApp();
app.disable("x-powered-by");

dbConnect();

export const handler = serverless(app);
export default handler;
