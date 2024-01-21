import { Subjects, Publisher, PaymentCreatedEvent } from "@xyztix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}