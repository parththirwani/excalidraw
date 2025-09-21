import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;


export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers["authorization"] ?? "").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    //@ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized" });
  }
}
