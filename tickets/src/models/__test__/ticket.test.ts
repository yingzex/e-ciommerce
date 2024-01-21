import { Ticket } from "../ticket";

it('implement optimistic concurrency control', async (done) => {
  // create an instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // save the ticket to database
  await ticket.save();

  // fetch the ticket twice
  const instance1 = await Ticket.findById(ticket.id);
  const instance2 = await Ticket.findById(ticket.id);
  
  // make two separate changes to the ticket we fetched
  instance1!.set({ price: 10 });
  instance2!.set({ price: 15 });

  // save the first fetched ticket
  await instance1!.save();

  // save the second fetched ticket and expect an error (fetched version has incorrect version property)
  try {
    await instance2!.save();
  } catch (err) {
    done(); // done() invoke mannually to tell jest we all done with test
    return done; // should reach this point and return
  }

  throw new Error('should not reach this point'); 

});

it('implements the version number on multiple saves', async () => {
  // create an instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

/*
only the service which is primary responsible for the record can increment version number
*/