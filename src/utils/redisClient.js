import { Redis } from "ioredis";
import { redisConfig } from "../config/redis.config.js";
import env from "../config/env.config.js";

class RedisClient {
  #redis = null;

  async connect() {
    if (this.#redis) {
      return;
    }

    const redis = new Redis(redisConfig);

    await redis.connect((err) => {
      if (err) {
        console.error("Redis connection error", err);
        process.exit(1);
      }

      console.log(`\n🟥 Redis connected! ${env.REDIS_HOST}:${env.REDIS_PORT}`);
    });

    redis.on("error", (error) => {
      if (error.message.includes("ECONNREFUSED")) {
        console.error("Redis connection refused", error);
        process.exit(1);
      }

      console.error("Redis error", error);
    });

    this.#redis = redis;
  }

  /**
   *
   * @returns {Redis}
   */
  getInstance() {
    return this.#redis;
  }

  async disconnect() {
    if (this.#redis) {
      await this.#redis.quit();
      console.log(
        `\n🟥 Redis disconnected! ${env.REDIS_HOST}:${env.REDIS_PORT}`
      );
      this.#redis = null;
    }
  }
}

const redisClient = new RedisClient();
Object.freeze(redisClient);

export default redisClient;
