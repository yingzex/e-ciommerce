import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@xyztix/common';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

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

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

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