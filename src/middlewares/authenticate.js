import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../models/session.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
    if (!token) throw createError(401, 'Not authorized');

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw createError(401, 'Access token expired');
      throw createError(401, 'Not authorized');
    }

    const session = await Session.findOne({ userId: payload.sub, accessToken: token });
    if (!session) throw createError(401, 'Session not found');

    if (new Date(session.accessTokenValidUntil) < new Date())
      throw createError(401, 'Access token expired');

    req.user = { _id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(err);
  }
};
