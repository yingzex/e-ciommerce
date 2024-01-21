import { Subjects, Publisher, ExpirationCompleteEvent } from "@xyztix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}