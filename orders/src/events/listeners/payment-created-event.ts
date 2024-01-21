import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@xyztix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = this.queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('order not found');
    }
    order.set({
      status: OrderStatus.Complete
    });
    await order.save();
    // once the order is completed, it will never be updated again, so no need to publish a OrderUpdated event

    msg.ack();
  }
}