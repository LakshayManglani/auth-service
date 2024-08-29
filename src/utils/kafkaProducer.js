import { Kafka, Partitioners } from "kafkajs";
import { kafkaConfig } from "../config/kafka.config.js";

class KafaProducer {
  #producer = null;

  async connect() {
    if (this.#producer) {
      return;
    }

    const kafka = new Kafka(kafkaConfig);

    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    try {
      await producer.connect();

      console.log("\n🔄 Kafka producer connected");
    } catch (error) {
      console.error("Failed to connect kafka producer:", error);

      process.exit(1);
    }

    this.#producer = producer;
  }

  /**
   *
   * @returns {import("kafkajs").Producer}
   */
  getInstance() {
    return this.#producer;
  }

  async disconnect() {
    if (this.#producer) {
      await this.getInstance().disconnect();
      console.log("\nKafka producer disconnected");
      this.#producer = null;
    }
  }
}

const kafkaProducer = new KafaProducer();
Object.freeze(kafkaProducer);

export default kafkaProducer;
