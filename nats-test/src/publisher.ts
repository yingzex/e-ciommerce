import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import nats from 'node-nats-streaming';

console.clear();

// create a client: client will connect to our streaming server and try to exchange information
// NATS streaming server is running inside Kubernete cluster, and by default not exposed to outside world
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
}); // client is called `stan` in nats

// when client successfully connects to nats, streaming server will emit a connect event
stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  // wait for publish to be completed successfully before running other code
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    });
  } catch(err) {
    console.log(err);
  }

  // // convert object to json before sending to NATS streaming server
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });

  // // pass: subject(name of the channel), message(data to be shared) 
  // stan.publish('ticket:created', data, () => {
  //   // invoked after publishing the data
  //   console.log('event published');
  // });
})