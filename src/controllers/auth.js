import * as authService from '../services/auth.js';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { signResetToken, verifyResetToken } from '../utils/token.js';
import { sendResetEmail as sendEmail } from '../services/mailService.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ status: 201, message: 'Successfully registered a user!', data: user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.login(req.body);
    const cookieName = process.env.COOKIE_NAME || 'refreshToken';
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(cookieName, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ status: 200, message: 'Successfully logged in an user!', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'refreshToken';
    const refreshToken = req.cookies?.[cookieName];
    const { accessToken, refreshToken: newRefresh } =
      await authService.refreshSession(refreshToken);
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(cookieName, newRefresh, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ status: 200, message: 'Successfully refreshed a session!', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'refreshToken';
    const refreshToken = req.cookies?.[cookieName];
    await authService.logout(refreshToken);
    res.clearCookie(cookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');
    const token = signResetToken({ email });
    const appDomain = process.env.APP_DOMAIN || 'http://localhost:3000';
    const resetLink = `${appDomain.replace(/\/$/, '')}/reset-password?token=${token}`;
    try {
      await sendEmail({ to: email, resetLink });
    } catch (err) {
      console.error('Mail send error', err);
      throw createError(500, 'Failed to send the email, please try again later.');
    }
    res
      .status(200)
      .json({ status: 200, message: 'Reset password email has been successfully sent.', data: {} });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    let payload;
    try {
      payload = verifyResetToken(token);
    } catch (err) {
      throw createError(401, 'Token is expired or invalid.');
    }
    const { email } = payload;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');
    await authService.changePassword(user._id, password);
    await authService.logoutByUserId(user._id);
    res
      .status(200)
      .json({ status: 200, message: 'Password has been successfully reset.', data: {} });
  } catch (err) {
    next(err);
  }
};
