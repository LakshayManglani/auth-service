import env from "./config/env.config.js";
import dbClient from "./db/index.js";
import redisClient from "./utils/redisClient.js";
import kafkaProducer from "./utils/kafkaProducer.js";
import { startApp } from "./app.js";

/**
 * @description Start the server.
 *
 * @return {Promise<import("express").Express>}
 */
async function startServer() {
  try {
    await dbClient.connect();

    await redisClient.connect();

    await kafkaProducer.connect();

    return startApp();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 * @param {import('http').Server} server
 */
function shutdown() {
  let shuttingDown = false;

  async function handleShutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`\nReceived ${signal}, closing HTTP server...`);

    try {
      await Promise.all([
        dbClient.disconnect(),
        redisClient.disconnect(),
        kafkaProducer.disconnect(),
      ]);

      console.log("\nAll services disconnected.");
    } catch (error) {
      console.error("\nError during shutdown:", error);
    } finally {
      process.exit(0);
    }
  }

  process.on("SIGINT", handleShutdown.bind(null, "SIGINT"));
  process.on("SIGTERM", handleShutdown.bind(null, "SIGTERM"));
}

(async () => {
  try {
    const app = await startServer();

    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log("\n⚙️ Server is running on port:", PORT);
    });

    shutdown();
  } catch (error) {
    console.error("Failed to listen server:", error);
    process.exit(1);
  }
})();

export { startServer };
