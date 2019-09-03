import { Server } from "./api/server";
import { createLogger } from "./logger";

const logger = createLogger(__filename);

logger.info("Starting server 🚀");

const server = new Server();
server.start();
