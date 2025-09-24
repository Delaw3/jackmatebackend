
import { createApp } from "./app";
import { config } from "./config/config";
import { dbConnect } from "./config/db.config";



async function bootstrap() {
  try {
    // Connect to MongoDB
    dbConnect();
    
    const app = createApp();

    const port = Number(config.port) 

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(" Failed to start app:", err);
    process.exit(1);
  }
}

bootstrap();
