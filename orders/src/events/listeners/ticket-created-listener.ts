import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@xyztix/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price } = data;
    // this ticket in Ticket Service's database and in Order Service's database should have the same id
    const ticket = Ticket.build({
      id, title, price
    });
    await ticket.save();
    msg.ack(); // if not acknowledged, this event will be published again after timeout
  }
}