import nats, { Message, Stan } from 'node-nats-streaming';

export abstract class Listener {
  // abstract properties and methods: must be provided by subclasses
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // get all events emitted in the past. so the subscription is created for the first time only, can receive all events in the past 
      .setManualAckMode(true) // manual acknowledgement mode
      .setAckWait(this.ackWait)
      .setDurableName('order-service'); // durable subscription, make sure not miss events or reprocess events
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}