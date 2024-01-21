import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@xyztix/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('the title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('the price must be greater than 0'),  
], 
validateRequest, 
async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  });
  await ticket.save(); // await saving ticket doc to DB. any errors will be thrown and handled by error handling middleware
  await new TicketCreatedPublisher(natsWrapper.client).publish({ // await publishing event to NATS. any errors will be thrown and handled by error handling middleware
    id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });
  
  res.status(201).send(ticket);
});

export { router as createTicketRouter };