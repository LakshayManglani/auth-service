import mongoose from "mongoose";
import env from "../config/env.config.js";

class DbClient {
  #db = null;
  async connect() {
    if (this.#db) {
      return;
    }

    const url = `${env.DB_URI}/${env.DB_NAME}`;

    try {
      const db = await mongoose.connect(url);
      console.log("\n☘️  MongoDB connected " + db.connection.host);

      this.#db = db;
    } catch (error) {
      console.error("Failed to connect to database:", error);
      process.exit(1);
    }
  }

  /**
   * @returns {import('mongoose').Mongoose}
   */
  getInstance() {
    return this.#db;
  }

  async disconnect() {
    if (this.#db) {
      await this.getInstance().disconnect();
      console.log("\n☘️  MongoDB disconnected");
      this.#db = null;
    }
  }
}

const dbClient = new DbClient();
Object.freeze(dbClient);

export default dbClient;
