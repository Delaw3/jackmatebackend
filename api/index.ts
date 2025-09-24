import { createApp } from "../src/app";
import serverless from "serverless-http";
import { dbConnect } from "../src/config/db.config";
import rawBody from "raw-body";

const app = createApp();

// Reuse DB connection
let cachedDb: any = null;
app.use(async (req, res, next) => {
  if (!cachedDb) cachedDb = await dbConnect();
  next();
});

// Raw-body fallback (prevents BadRequestError in serverless)
app.use(async (req, res, next) => {
  if (req.body === undefined && (req.is("application/json") || req.is("application/octet-stream"))) {
    try {
      const buf = await rawBody(req);
      req.body = buf.length ? JSON.parse(buf.toString()) : {};
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default serverless(app);
