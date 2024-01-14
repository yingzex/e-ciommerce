import express , { Request, Response } from 'express';
import { body } from 'express-validator'; // validate the body of request
import * as jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@xyztix/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup', 
  // all middlewares run sequentially in order
  [
    // middleware: validation
    body('email')
      .isEmail()
      .withMessage('email must be valid'), // produce error message
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters')
  ], // middleware1
  validateRequest, // middleware2
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      throw new BadRequestError('email in use');
    }

    const user = User.build({ email,password });
    await user.save(); // save newly created user to db

    // generate jwt, store ueer info (id, email, password) in jwt
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      }, 
      // `!` tell typescript that developer has already checked that KWT_KEY exists
      process.env.JWT_KEY!
    );

    // store it on session 
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user); 
  }
);

export { router as signupRouter };
