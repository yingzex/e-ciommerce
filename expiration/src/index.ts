
import { natsWrapper } from './nats-wrapper'; // Singleton: only one instance of NatsWrapper in the entire application shared between all different files
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// start application
const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('MONGO_URI must be defined');
  }  
  if (!process.env.NATS_URL) {
    throw new Error('MONGO_URI must be defined');
  }  
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('MONGO_URI must be defined');
  }  
  try {
    // clusterId, clientId, url
    // use name of the pod as clientId
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // everytime we try to shut down a client
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    // close client and close connections when receiving terminating signals
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
