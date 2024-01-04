import { ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import * as dotenv from "dotenv";

dotenv.config();
const connectionString = process.env["TOPIC_CONNECTION_STRING"] || "";
const topicName = process.env["TOPIC_NAME"] || "";
const subscriptionName = process.env["SUBSCRIPTION_NAME"] || "";

async function main(): Promise<void> {
  console.log(`Running desktop-topic-receiver-demo`);

  // Connect to Service Bus topic
  const sbClient = new ServiceBusClient(connectionString);
  const receiver = sbClient.createReceiver(topicName, subscriptionName);

  // Receive messages from the topic
  receiver.subscribe({
    processMessage: async (message: ServiceBusMessage ) => {
      console.log(`Received message: ${JSON.stringify(message.body)}`);
    },
    processError: async (err) => {
      console.log("Error occurred: ", err);
    },
  });

  // After timeout, stop processing and close the subscription.
  await new Promise((resolve) => setTimeout(resolve, 60 * 60 * 1000));
  await receiver.close();
  await sbClient.close();
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
