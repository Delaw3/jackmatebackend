import morgan from "morgan";
import logger from "./logger";

const morganLogger = morgan("dev", {
  stream: {
    write: (message) => logger.http(message.trim()), // use http level in winston
  },
});

export default morganLogger;
