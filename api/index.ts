import { createApp } from "../src/app";
import serverless from "serverless-http";
import { dbConnect } from "../src/config/db.config";

const app = createApp();

app.use(async (req, res, next) => {
  await dbConnect();
  next();
});

export default serverless(app);
