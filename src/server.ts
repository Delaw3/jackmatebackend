import { createApp } from "./app";
import { config } from "./config/config";
import { dbConnect } from "./config/db.config";
import "./utils/redis.client";
import { initRedis } from "./utils/redis.client";


async function bootstrap() {
  try {

    dbConnect()
    initRedis();

    const app = createApp();

    const port = Number(config.port || 3000);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start app:", err);
    process.exit(1);
  }
}

bootstrap();
