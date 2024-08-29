import env from "./env.config.js";

/**
 * @type {import("kafkajs").KafkaConfig}
 */
const kafkaConfig = {
  clientId: env.KAFKA_CLIENT_ID,
  brokers: [env.KAFKA_BROKERS_URI],
};

export { kafkaConfig };
