
import mongoose, { Query } from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper'; // Singleton: only one instance of NatsWrapper in the entire application shared between all different files
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// start application
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }  
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

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mangodb');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
