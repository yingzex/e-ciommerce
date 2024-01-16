import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
ticketSchema.methods.isReserved = async function() {
  // this === the ticket document that we just called 'isReserved' on
  // run query to look at all orders, find an order where the ticket is the ticket we just found AND the order status is NOT cancelled. If we find an order like that means that the ticket IS reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      // find an order whose status is in the list
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ]
    }
  }); // find an existing order which has already reserved this ticket
  return !!existingOrder; // turn the result into boolean
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };