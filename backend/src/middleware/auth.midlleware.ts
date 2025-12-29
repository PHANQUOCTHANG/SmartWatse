import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError"; 

interface AuthRequest extends Request {
  user?: string | object; 
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_default_secret_here';

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next(new AppError("Access denied. No token provided.", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 403));
  }
};