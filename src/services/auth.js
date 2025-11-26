import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SALT_ROUNDS = 10;

if (!ACCESS_SECRET || !REFRESH_SECRET) throw new Error('JWT secrets missing');

const parseExpires = (str) => {
  const num = Number(str.slice(0, -1));
  const unit = str.slice(-1);
  const now = new Date();
  if (unit === 'm') now.setMinutes(now.getMinutes() + num);
  else if (unit === 'h') now.setHours(now.getHours() + num);
  else if (unit === 'd') now.setDate(now.getDate() + num);
  else now.setMinutes(now.getMinutes() + 15);
  return now;
};

const signAccess = (payload) => jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
const signRefresh = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, 'Email in use');
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Email or password is wrong');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createError(401, 'Email or password is wrong');

  await Session.deleteMany({ userId: user._id });

  const accessToken = signAccess({ sub: user._id.toString(), email: user.email });
  const refreshToken = signRefresh({ sub: user._id.toString(), email: user.email });

  const accessTokenValidUntil = parseExpires(ACCESS_EXPIRES);
  const refreshTokenValidUntil = parseExpires(REFRESH_EXPIRES);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) throw createError(401, 'No refresh token');
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    throw createError(401, 'Invalid refresh token');
  }
  const userId = payload.sub;
  const old = await Session.findOne({ userId, refreshToken });
  if (!old) throw createError(401, 'Session not found');
  await Session.deleteOne({ _id: old._id });
  const accessToken = signAccess({ sub: userId, email: payload.email });
  const newRefresh = signRefresh({ sub: userId, email: payload.email });
  const accessTokenValidUntil = parseExpires(ACCESS_EXPIRES);
  const refreshTokenValidUntil = parseExpires(REFRESH_EXPIRES);
  await Session.create({
    userId,
    accessToken,
    refreshToken: newRefresh,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return { accessToken, refreshToken: newRefresh };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await Session.deleteOne({ refreshToken });
};

export const changePassword = async (userId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await User.findByIdAndUpdate(userId, { password: hashed });
};

export const logoutByUserId = async (userId) => {
  await Session.deleteMany({ userId });
};
