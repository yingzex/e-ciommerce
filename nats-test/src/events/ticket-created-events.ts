import { Subjects } from "./subjects";

// coupling subject and data type together, make sure they match
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}