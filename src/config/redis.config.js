import env from "./env.config.js";

/**
 * @type {import("ioredis").RedisOptions}
 */
const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
  lazyConnect: true,
};

export { redisConfig };
