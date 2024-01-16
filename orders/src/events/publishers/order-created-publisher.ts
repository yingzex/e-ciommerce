import { Publisher, OrderCreatedEvent, Subjects } from "@xyztix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}