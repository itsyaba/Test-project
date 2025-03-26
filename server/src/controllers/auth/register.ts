import { type RequestHandler } from 'express'
// import joi from '../../utils/joi'
import jwt from '../../utils/jwt'
import crypt from '../../utils/crypt'
import Account from '../../models/Account'
import Joi from 'joi'


const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const register: RequestHandler = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = schema.validate(req.body);
    if (error) {
      return next({
        statusCode: 400,
        message: error.details.map((detail) => detail.message).join(', '),
      });
    }

    const { username, password } = req.body;

    // Verify account username as unique
    const found = await Account.findOne({ username });

    if (found) {
      return next({
        statusCode: 400,
        message: 'An account already exists with that username',
      });
    }

    // Encrypt password
    const hash = await crypt.hash(password);

    // Create account
    const account = new Account({ username, password: hash });
    await account.save();

    // Generate access token
    const token = jwt.signToken({ uid: account._id, role: account.role });

    // Exclude password from response
    const { password: _, ...data } = account.toObject();

    res.status(201).json({
      message: 'Successfully registered',
      data,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export default register
