import { Publisher, Subjects, TicketCreatedEvent } from '@xyztix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}