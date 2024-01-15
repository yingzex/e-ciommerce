import { Stan, Subscription } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

// gerneric class
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    // in order to use async `await` syntax, return a promise that will be created manually from this published function
    return new Promise((resolve, reject) => {
      // pass: subject(name of the channel), message(data to be shared) 
      // JSON.stringify: convert object to json before sending to NATS streaming server
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('event published to subject', this.subject);
        resolve(); // resolve nothing
        // invoked after publishing the data
        console.log('event published');
      });
    });
  }
}