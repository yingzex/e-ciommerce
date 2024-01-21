import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@xyztix/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    // make a query based on: both the id and the version number
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('ticket not found');
    }
    const { title, price } = data;
    // console.log(data);
    // console.log(ticket);
    ticket.set({ title, price }); // extract version number from the event and update in database
    await ticket.save();
    msg.ack();
  }
}