import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@xyztix/common';

const router = express.Router();

router.get('/api/tickets/:id', async(req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  console.log(req.params.id);
  console.log(ticket);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };