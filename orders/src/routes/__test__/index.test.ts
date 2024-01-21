import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models/ticket';
import mongoose from 'mongoose';

const bulidTicket = async () => {
  const ticket: TicketDoc = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();
  return ticket;
}

it('fetches orders for an particular user', async () => {
  // create three tickets
  const ticket1 = bulidTicket();
  const ticket2 = bulidTicket();
  const ticket3 = bulidTicket();
  const user1 = global.signin();
  const user2 = global.signin();

  // create an order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1) 
    .send({ ticketId: (await ticket1).id })
    .expect(201);
  // create two orders as User #2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: (await ticket2).id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: (await ticket3).id })
    .expect(201);

  // make request to get users for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  console.log(order1);
  // make sure we only get orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual((await ticket2).id);
  expect(response.body[1].ticket.id).toEqual((await ticket3).id);
});