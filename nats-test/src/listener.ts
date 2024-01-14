import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listner';

console.clear();

// use randomBytes to generate random client id, therefore can run multiple copies of clients without cliert id conflicts
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // everytime we try to shut down a client
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// close client and close connections when receiving terminating signals
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
