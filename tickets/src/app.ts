import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@xyztix/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();
// traffic is proxied into application through ingress and nginx. Tell express to trust the traffic even though it comes from proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // must be on Https connection
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res, next) => {
  // throw new NotFoundError();
  // mark a function as async: not immediately return value; return a promise that will resolve with some value in the future. 
  
  // method1: use `next` function instead
  // next(new NotFoundError());

  // method2: use `express-async-errors`
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };