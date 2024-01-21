/*
listen on OrderCreated, tell Bull JS: "remind me to do something 15 mins from now"

Bull JS: 

work server: a server out side the app server

when client makes a request to server, BULL JS queue `JOB` (some processing needds to be done on some particular thing), send the JOB to Redis Server, and redis stores list of jobs. Work servers (in this project, work servers are also BULL JS) pull jobs from redis server and do some processing on it, and send msg back to redis that the job is completed.
*/

import { Listener, OrderCreatedEvent, Subjects } from '@xyztix/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
