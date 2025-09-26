// utils/redisClient.ts
import logger from "./logger";
import { config } from "../config/config";
import { createClient } from "redis";

const redis = createClient({
  url: config.redisUrl as string,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  logger.error("Redis Error:", err);
});

export async function initRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}

export default redis;
