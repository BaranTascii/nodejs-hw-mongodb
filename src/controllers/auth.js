import * as authService from '../services/auth.js';
import createError from 'http-errors';

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
