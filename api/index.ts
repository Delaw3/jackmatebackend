import { createApp } from "../src/app";   // path to your app.ts
import serverless from "serverless-http";
import { dbConnect } from "../src/config/db.config";

// Connect to DB once
dbConnect();

const app = createApp();

export default serverless(app);
