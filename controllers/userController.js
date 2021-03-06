import jwt from 'jsonwebtoken';
import Logger from '../utils/logger';
import * as UserModel from '../models/UserModel';
import AppError from '../errors/AppError';

const logger = Logger('userController');

const register = async (req, res) => {
  logger.log('debug', `register: ${JSON.stringify(req.body)}`);
  await UserModel.save({
    username: req.body.username,
    email: req.body.email,
    reHashedPassword: req.body.hashedPassword,
  }).catch(err => {
    throw new Error('DB ERROR');
  });

  res.status(200).send({ payload: { message: `Succesfully registered` } });
};

const logIn = async (req, res) => {
  logger.log('debug', `logIn: ${JSON.stringify(req.body)}`);
  const user = await UserModel.getUserByEmail(req.body.email);
  if (user) {
    const isPasswordsEqual = await UserModel.comparePassword({
      userPassword: req.body.hashedPassword,
      reHashedPassword: user.reHashedPassword,
    });
    if (isPasswordsEqual) {
      const token = jwt.sign(
        {
          data: { username: user.username },
        },
        process.env.JWT_SECRET,
        { expiresIn: '6h' },
      );
      logger.log('info', `Succesfully logged in ${user.username}`);
      res.status(200).send({ payload: { token } });
    }
  } else {
    throw new AppError('Wrong credentials!', 400);
  }
};

export { register, logIn };
