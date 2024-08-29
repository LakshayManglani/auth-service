import env from "./env.config.js";

/**
 * @type {import("passport-google-oauth20").StrategyOptions}
 */
const googleConfig = {
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL,
};

export { googleConfig };
