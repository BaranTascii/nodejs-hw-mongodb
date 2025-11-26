import jwt from 'jsonwebtoken';

export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
