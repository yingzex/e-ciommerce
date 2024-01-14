import express from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Request, Response } from 'express';
import { validateRequest, BadRequestError } from '@xyztix/common';
import { Password } from '../services/password';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('you must supply a password')
  ], // middleware1
  validateRequest, // middleware2
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      throw new BadRequestError('invalid credentials');
    }

    const passwordMatch = await Password.compare(exisitingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError('invalid credentials');
    }

    // user is now logged in. send them a jwt in a cookie
    // generate jwt, store ueer info (id, email, password) in jwt
    const userJwt = jwt.sign(
      {
        id: exisitingUser.id,
        email: exisitingUser.email,
      }, 
      // `!` tell typescript that developer has already checked that KWT_KEY exists
      process.env.JWT_KEY!
    );

    // store it on session 
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(exisitingUser);
  }
);

export { router as signinRouter };
