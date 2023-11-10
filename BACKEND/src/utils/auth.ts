import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
  user?: any;
}

const secretKey = 'funtec';

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (
  plainText: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedPassword);
};
