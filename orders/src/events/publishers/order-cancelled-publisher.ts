import { Publisher, OrderCancelledEvent, Subjects } from "@xyztix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}