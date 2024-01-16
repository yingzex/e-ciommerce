import express, { Request, Response } from 'express';
import { requireAuth } from '@xyztix/common';
import { Order } from '../models/order';

const router = express.Router();
router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  // find all orders created by this user
  const orders = await 
    Order.find({
      userId: req.currentUser!.id
    })
    .populate('ticket'); // also find info about the ticket associate with the order
  res.send(orders);
});

export { router as indexOrderRouter };