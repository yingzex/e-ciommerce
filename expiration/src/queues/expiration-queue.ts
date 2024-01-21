/*
expirationQueue: queue up or crate a brand new job (job is similar to event)

1. enqueue (publish) a job, send job to redis server. in redis server, list of jobs with 'order:expiration'

2. 15 mins later, redis server send the job back to expirationQueue. expirationQueue process a job and publish a expiration:complete event.
*/

import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
