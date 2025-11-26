import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
export const signResetToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '5m' });
export const verifyResetToken = (token) => jwt.verify(token, SECRET);
