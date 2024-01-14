import { channel } from 'diagnostics_channel';
import nats from 'node-nats-streaming';

console.clear();

// create a client: client will connect to our streaming server and try to exchange information
// NATS streaming server is running inside Kubernete cluster, and by default not exposed to outside world
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
}); // client is called `stan` in nats

// when client successfully connects to nats, streaming server will emit a connect event
stan.on('connect', () => {
  console.log('publisher connected to NATS');

  // convert object to json before sending to NATS streaming server
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20
  });

  // pass: subject(name of the channel), message(data to be shared) 
  stan.publish('ticket:created', data, () => {
    // invoked after publishing the data
    console.log('event published');
  })
})