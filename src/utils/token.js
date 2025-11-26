import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
export const signResetToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '5m' });
};
export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
