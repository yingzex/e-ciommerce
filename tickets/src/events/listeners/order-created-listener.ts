// everytime an order is called: lock the ticket

import { Listener, OrderStatus, Subjects } from "@xyztix/common";
import { OrderCreatedEvent } from "@xyztix/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string =  queueGroupName;
  
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // lock the ticket:

    // find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if not ticket, throw error
    if (!ticket) {
      throw new Error('ticket not found');
    }
    // mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    // save the ticket
    await ticket.save();

    // a listener that publishes its own events (ticket updated: mark as locked)
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}