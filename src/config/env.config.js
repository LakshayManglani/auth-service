import { configDotenv } from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

configDotenv({
  path: "./.env",
});

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
  }),
  PORT: port({ default: 3333 }),

  ACCESS_TOKEN_SECRET: str({ default: "access-token-secret" }),
  ACCESS_TOKEN_EXPIRES: num({ default: 60 * 60 * 24 }),
  REFRESH_TOKEN_SECRET: str({ default: "refresh-token-secret" }),
  REFRESH_TOKEN_EXPIRES: num({ default: 60 * 60 * 24 * 30 }),
  VERIFICATION_TOKEN_SECRET: str({ default: "verification-token-secret" }),
  VERIFICATION_TOKEN_EXPIRES: num({ default: 60 * 60 * 24 }),
  VERIFICATION_LINK: str({ default: "http://localhost:3000/auth/verify" }),

  DB_URI: str({ default: "mongodb://localhost:27017" }),
  DB_NAME: str({ default: "auth" }),

  REDIS_HOST: str({ default: "localhost" }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASSWORD: str({ default: "" }),
  REDIS_DB: num({ default: 0 }),

  KAFKA_CLIENT_ID: str({ default: "auth" }),
  KAFKA_BROKERS_URI: str({ default: "localhost:9092" }),

  GOOGLE_CLIENT_ID: str({ default: "" }),
  GOOGLE_CLIENT_SECRET: str({ default: "" }),
  GOOGLE_CALLBACK_URL: str({
    default: "http://localhost:3000/api/v1/auth/google/callback",
  }),

  SESSION_SECRET: str({ default: "session-secret" }),
});

export default env;
